import express from 'express';
const router = express.Router();
import { Resend } from 'resend';
import rateLimit from 'express-rate-limit';

// Rate limiting to prevent spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: 'Too many contact form submissions from this IP, please try again after 15 minutes'
  }
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Debug: Check if Resend is initialized properly
console.log('Resend API Key present:', !!process.env.RESEND_API_KEY);
if (process.env.RESEND_API_KEY) {
  console.log('Resend API Key length:', process.env.RESEND_API_KEY.length);
}

router.post('/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    console.log('Received contact form submission:', { name, email, subject, messageLength: message?.length });

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Please provide a valid email address'
      });
    }

    if (message.length < 10) {
      return res.status(400).json({
        error: 'Message must be at least 10 characters long'
      });
    }

    // Email templates (simplified for testing)
    const adminEmailTemplate = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${getSubjectDisplayName(subject)}</p>
      <p><strong>Message:</strong></p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      <p><em>Received: ${new Date().toLocaleString()}</em></p>
    `;

    const userEmailTemplate = `
      <h2>Thank You for Contacting EthioStay</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>We have received your message and will get back to you within 2-4 hours.</p>
      <p><strong>Your Message:</strong> ${message.substring(0, 100)}...</p>
      <p>Best regards,<br>The EthioStay Team</p>
    `;

    console.log('Attempting to send emails...');

    // Send email to admin/support team
    const adminEmailResult = await resend.emails.send({
      from: 'EthioStay <onboarding@resend.dev>', // Use Resend's test domain
      to: ['your-verified-email@gmail.com'], // REPLACE WITH YOUR VERIFIED EMAIL
      subject: `Contact Form: ${getSubjectDisplayName(subject)}`,
      html: adminEmailTemplate,
      reply_to: email
    });

    console.log('Admin email result:', adminEmailResult);

    // Send confirmation email to user
    const userEmailResult = await resend.emails.send({
      from: 'EthioStay <onboarding@resend.dev>', // Use Resend's test domain
      to: [email],
      subject: 'Thank You for Contacting EthioStay',
      html: userEmailTemplate
    });

    console.log('User email result:', userEmailResult);

    // Check if emails were sent successfully
    if (adminEmailResult.error) {
      console.error('Admin email error:', adminEmailResult.error);
      throw new Error(`Failed to send admin email: ${adminEmailResult.error.message}`);
    }

    if (userEmailResult.error) {
      console.error('User email error:', userEmailResult.error);
      // Don't throw here, just log since admin email might have worked
      console.warn('User confirmation email failed, but admin email was sent');
    }

    console.log('Contact form processed successfully');

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: {
        adminEmailId: adminEmailResult.data?.id,
        userEmailId: userEmailResult.data?.id
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // More specific error handling
    if (error.message.includes('Failed to send admin email')) {
      return res.status(500).json({
        error: 'Failed to send email. Please try again later or contact us directly at support@ethiostay.com'
      });
    }

    if (error.response?.data?.error) {
      return res.status(500).json({
        error: 'Email service error. Please try again later.'
      });
    }

    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to get display name for subject
function getSubjectDisplayName(subjectValue) {
  const subjectMap = {
    'booking-help': 'Booking Assistance',
    'payment-issue': 'Payment Issue',
    'cancellation': 'Cancellation Request',
    'refund': 'Refund Inquiry',
    'hotel-partnership': 'Hotel Partnership',
    'general-inquiry': 'General Inquiry',
    'technical-support': 'Technical Support',
    'feedback': 'Feedback & Suggestions'
  };
  
  return subjectMap[subjectValue] || subjectValue;
}

export default router;