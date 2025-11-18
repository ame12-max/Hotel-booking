import  express from 'express';
const router = express.Router();
import  {authenticateToken} from '../middleware/auth.js';
import pool from '../config/database.js';

// GET /api/payment/methods - Get user's payment methods
router.get('/methods', authenticateToken, async (req, res) => {
  try {
    console.log('📋 Fetching payment methods for user:', req.user.id);
    
    const [paymentMethods] = await pool.execute(
      `SELECT 
        id, 
        card_holder, 
        card_type, 
        last_four, 
        expiry_month, 
        expiry_year,
        is_default,
        created_at,
        updated_at
       FROM payment_methods 
       WHERE user_id = ? 
       ORDER BY is_default DESC, created_at DESC`,
      [req.user.id]
    );

    console.log(`✅ Found ${paymentMethods.length} payment methods`);

    res.json({
      success: true,
      data: paymentMethods
    });

  } catch (error) {
    console.error('❌ Get payment methods error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch payment methods',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/payment/methods - Add new payment method
router.post('/methods', authenticateToken, async (req, res) => {
  try {
    console.log('💳 Adding new payment method for user:', req.user.id);
    console.log('📨 Request body:', { ...req.body, cardNumber: '***' }); // Don't log full card number

    const { 
      cardHolder, 
      cardNumber, 
      expiryMonth, 
      expiryYear, 
      cvv, 
      isDefault 
    } = req.body;

    // Basic validation
    if (!cardHolder || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate card number (simple Luhn check)
    if (!isValidCardNumber(cardNumber)) {
      return res.status(400).json({ error: 'Invalid card number' });
    }

    // Get last 4 digits
    const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
    
    // Determine card type
    const cardType = getCardType(cardNumber);

    // If setting as default, update other cards
    if (isDefault) {
      await pool.execute(
        'UPDATE payment_methods SET is_default = FALSE WHERE user_id = ?',
        [req.user.id]
      );
    }

    // Insert new payment method
    const [result] = await pool.execute(
      `INSERT INTO payment_methods 
       (user_id, card_holder, card_type, last_four, expiry_month, expiry_year, is_default) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, cardHolder, cardType, lastFour, expiryMonth, expiryYear, isDefault || false]
    );

    console.log('✅ Payment method added successfully, ID:', result.insertId);

    // Get the newly created payment method
    const [newPaymentMethods] = await pool.execute(
      'SELECT * FROM payment_methods WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Payment method added successfully',
      data: newPaymentMethods[0]
    });

  } catch (error) {
    console.error('❌ Add payment method error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'This card is already added' });
    }

    res.status(500).json({ 
      error: 'Failed to add payment method',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/payment/methods/:id - Update payment method
router.put('/methods/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { cardHolder, isDefault } = req.body;

    console.log('✏️ Updating payment method:', id);

    // Verify the payment method belongs to the user
    const [userMethods] = await pool.execute(
      'SELECT user_id FROM payment_methods WHERE id = ?',
      [id]
    );

    if (userMethods.length === 0) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    if (userMethods[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // If setting as default, update other cards
    if (isDefault) {
      await pool.execute(
        'UPDATE payment_methods SET is_default = FALSE WHERE user_id = ? AND id != ?',
        [req.user.id, id]
      );
    }

    // Update the payment method
    await pool.execute(
      'UPDATE payment_methods SET card_holder = ?, is_default = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [cardHolder, isDefault, id]
    );

    console.log('✅ Payment method updated successfully');

    res.json({
      success: true,
      message: 'Payment method updated successfully'
    });

  } catch (error) {
    console.error('❌ Update payment method error:', error);
    res.status(500).json({ 
      error: 'Failed to update payment method',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/payment/methods/:id - Delete payment method
router.delete('/methods/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting payment method:', id);

    // Verify the payment method belongs to the user
    const [userMethods] = await pool.execute(
      'SELECT user_id, is_default FROM payment_methods WHERE id = ?',
      [id]
    );

    if (userMethods.length === 0) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    if (userMethods[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete the payment method
    await pool.execute('DELETE FROM payment_methods WHERE id = ?', [id]);

    console.log('✅ Payment method deleted successfully');

    res.json({
      success: true,
      message: 'Payment method deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete payment method error:', error);
    res.status(500).json({ 
      error: 'Failed to delete payment method',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/payment/methods/:id/default - Set as default payment method
router.put('/methods/:id/default', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    console.log('⭐ Setting payment method as default:', id);

    // Verify the payment method belongs to the user
    const [userMethods] = await pool.execute(
      'SELECT user_id FROM payment_methods WHERE id = ?',
      [id]
    );

    if (userMethods.length === 0) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    if (userMethods[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update all payment methods for this user
    await pool.execute(
      'UPDATE payment_methods SET is_default = FALSE WHERE user_id = ?',
      [req.user.id]
    );

    await pool.execute(
      'UPDATE payment_methods SET is_default = TRUE WHERE id = ?',
      [id]
    );

    console.log('✅ Default payment method updated successfully');

    res.json({
      success: true,
      message: 'Default payment method updated successfully'
    });

  } catch (error) {
    console.error('❌ Set default payment method error:', error);
    res.status(500).json({ 
      error: 'Failed to set default payment method',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper functions
function isValidCardNumber(cardNumber) {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  // Basic length check
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }

  // Simple Luhn algorithm check
  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

function getCardType(cardNumber) {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleanNumber)) return 'Visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'MasterCard';
  if (/^3[47]/.test(cleanNumber)) return 'American Express';
  if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';
  if (/^3(?:0[0-5]|[68])/.test(cleanNumber)) return 'Diners Club';
  if (/^(?:2131|1800|35)/.test(cleanNumber)) return 'JCB';
  
  return 'Credit Card';
}

export default router;