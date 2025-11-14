// src/services/paymongoService.ts
import { CartItem } from '../types/CartItem';

const PAYMONGO_SECRET_KEY = 'YOUR_PAYMONGO_SECRET_KEY';
const PAYMONGO_API_URL = 'https://api.paymongo.com/v1';

export interface PaymentIntent {
  id: string;
  status: string;
  amount: number;
  currency: string;
  client_key: string;
  payment_method_allowed: string[];
}

export const createPaymentIntent = async (
  amount: number,
  description: string
): Promise<PaymentIntent> => {
  try {
    const response = await fetch(`${PAYMONGO_API_URL}/payment_intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(PAYMONGO_SECRET_KEY)}`
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amount * 100, // Convert to centavos
            payment_method_allowed: ['card', 'gcash', 'paymaya'],
            currency: 'PHP',
            description: description,
            statement_descriptor: 'Cookie Shop'
          }
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Payment intent creation failed');
    }

    return data.data.attributes;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const attachPaymentMethod = async (
  paymentIntentId: string,
  paymentMethodId: string
): Promise<any> => {
  try {
    const response = await fetch(
      `${PAYMONGO_API_URL}/payment_intents/${paymentIntentId}/attach`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(PAYMONGO_SECRET_KEY)}`
        },
        body: JSON.stringify({
          data: {
            attributes: {
              payment_method: paymentMethodId,
              return_url: 'https://yourapp.com/payment/success'
            }
          }
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Payment method attachment failed');
    }

    return data.data;
  } catch (error) {
    console.error('Error attaching payment method:', error);
    throw error;
  }
};

export const createPaymentMethod = async (
  cardDetails: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  },
  billingDetails: {
    name: string;
    email: string;
    phone: string;
  }
): Promise<string> => {
  try {
    const response = await fetch(`${PAYMONGO_API_URL}/payment_methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(PAYMONGO_SECRET_KEY)}`
      },
      body: JSON.stringify({
        data: {
          attributes: {
            type: 'card',
            details: cardDetails,
            billing: billingDetails
          }
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Payment method creation failed');
    }

    return data.data.id;
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw error;
  }
};