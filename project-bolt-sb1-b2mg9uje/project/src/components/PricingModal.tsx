import React, { useState } from 'react';
import { X, Check, Crown, CreditCard, Smartphone } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('pro');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'indonesian'>('indonesian');

  if (!isOpen) return null;

  const plans = {
    free: {
      name: 'Free Plan',
      price: 'IDR 0',
      period: 'forever',
      features: [
        '3 searches per day',
        'Basic search functionality',
        'Search history',
        'Bookmark up to 10 questions',
        'Mobile responsive'
      ]
    },
    pro: {
      name: 'Pro Plan',
      price: 'IDR 29,000',
      period: 'per month',
      originalPrice: '$1.99 USD',
      features: [
        'Unlimited searches',
        'Advanced search filters',
        'Unlimited bookmarks',
        'Priority support',
        'Export mark schemes to PDF',
        'Early access to new features',
        'Ad-free experience'
      ]
    }
  };

  const indonesianPayments = [
    { id: 'shopee', name: 'ShopeePay', logo: '🛍️' },
    { id: 'gopay', name: 'GoPay', logo: '🏍️' },
    { id: 'ovo', name: 'OVO', logo: '💜' },
    { id: 'dana', name: 'DANA', logo: '💙' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Upgrade to Pro</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedPlan === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${key === 'pro' ? 'relative' : ''}`}
                onClick={() => setSelectedPlan(key as 'free' | 'pro')}
              >
                {key === 'pro' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-3 mb-4">
                  {key === 'pro' && <Crown className="w-6 h-6 text-yellow-500" />}
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                  {plan.originalPrice && (
                    <div className="text-sm text-gray-500 mt-1">≈ {plan.originalPrice}</div>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {selectedPlan === 'pro' && (
            <div className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('indonesian')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === 'indonesian'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="font-medium">Indonesian E-Wallets</div>
                    <div className="text-sm text-gray-600">ShopeePay, GoPay, OVO, DANA</div>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="font-medium">International Cards</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard, PayPal</div>
                  </button>
                </div>
              </div>

              {/* Payment Forms */}
              {paymentMethod === 'indonesian' && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Select E-Wallet</h4>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {indonesianPayments.map((payment) => (
                      <button
                        key={payment.id}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors"
                      >
                        <span className="text-2xl">{payment.logo}</span>
                        <span className="font-medium">{payment.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-blue-900">Payment Integration Coming Soon</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      We're working on integrating Indonesian payment methods. 
                      You'll be able to pay with your preferred e-wallet very soon!
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Card Details</h4>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-blue-900">Payment Integration Coming Soon</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Secure international payment processing is being integrated. 
                      Support for Visa, Mastercard, and PayPal coming soon!
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p>✓ 30-day money-back guarantee</p>
                  <p>✓ Cancel anytime</p>
                </div>
                
                <button
                  disabled
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium opacity-50 cursor-not-allowed"
                >
                  Subscribe to Pro - IDR 29,000/month
                </button>
              </div>
            </div>
          )}

          {selectedPlan === 'free' && (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">You're currently on the Free plan</p>
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Continue with Free Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}