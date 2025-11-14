// src/pages/Checkout.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
  IonTextarea,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { cardOutline, walletOutline } from 'ionicons/icons';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createPaymentIntent, createPaymentMethod, attachPaymentMethod } from '../services/paymongoService';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useHistory } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Shipping Info
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Payment Info
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');

  const totalAmount = getTotalPrice() + 50; // Including shipping

  const handlePayment = async () => {
    if (!currentUser) {
      setError('Please login to continue');
      return;
    }

    if (!address || !city || !postalCode) {
      setError('Please fill in shipping details');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !expMonth || !expYear || !cvc) {
        setError('Please fill in payment details');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');

      // Create payment intent
      const paymentIntent = await createPaymentIntent(
        totalAmount,
        `Order from ${currentUser.displayName}`
      );

      let paymentResult;

      if (paymentMethod === 'card') {
        // Create payment method
        const paymentMethodId = await createPaymentMethod(
          {
            number: cardNumber.replace(/\s/g, ''),
            exp_month: parseInt(expMonth),
            exp_year: parseInt(expYear),
            cvc: cvc
          },
          {
            name: currentUser.displayName,
            email: currentUser.email,
            phone: currentUser.phoneNumber || ''
          }
        );

        // Attach payment method to intent
        paymentResult = await attachPaymentMethod(paymentIntent.id, paymentMethodId);
      }

      // Save order to Firestore
      await addDoc(collection(db, 'orders'), {
        userId: currentUser.uid,
        items: cart.map(item => ({
          cookieId: item.cookie.id,
          name: item.cookie.name,
          price: item.cookie.price,
          quantity: item.quantity
        })),
        totalAmount: totalAmount,
        shippingAddress: `${address}, ${city}, ${postalCode}`,
        paymentId: paymentIntent.id,
        paymentMethod: paymentMethod,
        status: 'paid',
        createdAt: new Date()
      });

      setSuccess('Payment successful! Your order has been placed.');
      clearCart();
      
      setTimeout(() => {
        history.push('/main');
      }, 3000);

    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/cart" />
          </IonButtons>
          <IonTitle>Checkout</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Shipping Information</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">Address</IonLabel>
              <IonTextarea
                value={address}
                onIonInput={(e) => setAddress(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">City</IonLabel>
              <IonInput
                value={city}
                onIonInput={(e) => setCity(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Postal Code</IonLabel>
              <IonInput
                value={postalCode}
                onIonInput={(e) => setPostalCode(e.detail.value!)}
                required
              />
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Payment Method</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel>Select Payment</IonLabel>
              <IonSelect value={paymentMethod} onIonChange={(e) => setPaymentMethod(e.detail.value)}>
                <IonSelectOption value="card">Credit/Debit Card</IonSelectOption>
                <IonSelectOption value="gcash">GCash</IonSelectOption>
                <IonSelectOption value="paymaya">PayMaya</IonSelectOption>
              </IonSelect>
            </IonItem>

            {paymentMethod === 'card' && (
              <>
                <IonItem>
                  <IonIcon icon={cardOutline} slot="start" />
                  <IonLabel position="floating">Card Number</IonLabel>
                  <IonInput
                    type="text"
                    value={cardNumber}
                    onIonInput={(e) => setCardNumber(e.detail.value!)}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </IonItem>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <IonItem style={{ flex: 1 }}>
                    <IonLabel position="floating">Exp Month</IonLabel>
                    <IonInput
                      type="number"
                      value={expMonth}
                      onIonInput={(e) => setExpMonth(e.detail.value!)}
                      placeholder="MM"
                      required
                    />
                  </IonItem>
                  <IonItem style={{ flex: 1 }}>
                    <IonLabel position="floating">Exp Year</IonLabel>
                    <IonInput
                      type="number"
                      value={expYear}
                      onIonInput={(e) => setExpYear(e.detail.value!)}
                      placeholder="YYYY"
                      required
                    />
                  </IonItem>
                  <IonItem style={{ flex: 1 }}>
                    <IonLabel position="floating">CVC</IonLabel>
                    <IonInput
                      type="number"
                      value={cvc}
                      onIonInput={(e) => setCvc(e.detail.value!)}
                      placeholder="123"
                      required
                    />
                  </IonItem>
                </div>
              </>
            )}

            {(paymentMethod === 'gcash' || paymentMethod === 'paymaya') && (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <IonIcon icon={walletOutline} style={{ fontSize: '50px', color: '#8B4513' }} />
                <p>You will be redirected to {paymentMethod === 'gcash' ? 'GCash' : 'PayMaya'} to complete your payment.</p>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Order Summary</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {cart.map((item) => (
              <div key={item.cookie.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>{item.cookie.name} x {item.quantity}</span>
                <span>₱{(item.cookie.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Subtotal:</span>
              <span>₱{getTotalPrice().toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Shipping:</span>
              <span>₱50.00</span>
            </div>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span style={{ color: '#8B4513' }}>₱{totalAmount.toFixed(2)}</span>
            </div>
          </IonCardContent>
        </IonCard>

        <IonButton
          expand="block"
          onClick={handlePayment}
          disabled={loading}
          size="large"
        >
          {loading ? <IonSpinner name="crescent" /> : `Pay ₱${totalAmount.toFixed(2)}`}
        </IonButton>

        <IonToast
          isOpen={!!error}
          onDidDismiss={() => setError('')}
          message={error}
          duration={3000}
          color="danger"
        />

        <IonToast
          isOpen={!!success}
          onDidDismiss={() => setSuccess('')}
          message={success}
          duration={3000}
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default Checkout;