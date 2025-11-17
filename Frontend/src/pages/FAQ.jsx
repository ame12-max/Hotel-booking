import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqCategories = [
    {
      id: 'booking',
      name: 'Booking & Reservations',
      questions: [
        {
          id: 1,
          question: 'How do I make a hotel booking?',
          answer: 'To make a booking, search for your destination, select your dates, choose a hotel and room type, and proceed to payment. You\'ll receive a confirmation email with all booking details.'
        },
        {
          id: 2,
          question: 'Can I modify my booking after confirmation?',
          answer: 'Yes, you can modify your booking up to 24 hours before check-in, depending on the hotel\'s policy. Changes are subject to availability and rate differences.'
        },
        {
          id: 3,
          question: 'What is the minimum age for booking?',
          answer: 'You must be at least 18 years old to make a booking. Some hotels may have higher age requirements, which will be specified during the booking process.'
        }
      ]
    },
    {
      id: 'payment',
      name: 'Payments & Pricing',
      questions: [
        {
          id: 4,
          question: 'What payment methods do you accept?',
          answer: 'We accept credit/debit cards (Visa, MasterCard), bank transfers, and mobile payments. All payments are processed securely through encrypted channels.'
        },
        {
          id: 5,
          question: 'Are there any hidden fees?',
          answer: 'No, we display the total price including all taxes and service fees before you confirm your booking. The price you see is the price you pay.'
        },
        {
          id: 6,
          question: 'When is my payment processed?',
          answer: 'Payment is processed immediately upon booking confirmation. For some hotels, you may pay at the property - this will be clearly indicated during booking.'
        }
      ]
    },
    {
      id: 'cancellation',
      name: 'Cancellations & Refunds',
      questions: [
        {
          id: 7,
          question: 'What is your cancellation policy?',
          answer: 'Cancellation policies vary by hotel. Most hotels offer free cancellation up to 24-48 hours before check-in. The specific policy for each booking is displayed before confirmation.'
        },
        {
          id: 8,
          question: 'How long do refunds take?',
          answer: 'Refunds typically take 5-10 business days to process, depending on your payment method and bank processing times.'
        },
        {
          id: 9,
          question: 'What if I need to cancel due to emergency?',
          answer: 'Contact our support team immediately with documentation of your emergency. We\'ll work with the hotel to find the best possible solution.'
        }
      ]
    },
    {
      id: 'technical',
      name: 'Technical Support',
      questions: [
        {
          id: 10,
          question: 'The website is not loading properly',
          answer: 'Try clearing your browser cache and cookies, or use a different browser. If the issue persists, contact our technical support team.'
        },
        {
          id: 11,
          question: 'I didn\'t receive my confirmation email',
          answer: 'Check your spam folder first. If you still can\'t find it, contact support with your booking details and we\'ll resend the confirmation.'
        },
        {
          id: 12,
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page and enter your email address. You\'ll receive instructions to reset your password.'
        }
      ]
    }
  ];

  const allQuestions = faqCategories.flatMap(category => category.questions);
  
  const filteredQuestions = allQuestions.filter(q =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find quick answers to common questions about EthioStay
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Search Results ({filteredQuestions.length})
            </h2>
            <div className="space-y-4">
              {filteredQuestions.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-semibold text-gray-900 text-lg">
                      {item.question}
                    </span>
                    {openItems[item.id] ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {openItems[item.id] && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {!searchTerm && faqCategories.map((category) => (
          <div key={category.id} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.name}</h2>
            <div className="space-y-4">
              {category.questions.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 rounded-xl transition-colors duration-200"
                  >
                    <span className="font-semibold text-gray-900 text-lg pr-4">
                      {item.question}
                    </span>
                    {openItems[item.id] ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openItems[item.id] && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-blue-100 mb-6 text-lg">
            Our support team is ready to help you with any other questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Visit Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;