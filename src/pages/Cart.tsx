// src/pages/Cart.tsx
import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonBackButton
} from '@ionic/react';
import { 
  addOutline, 
  removeOutline, 
  trashOutline,
  cartOutline 
} from 'ionicons/icons';
import { useCart } from '../contexts/CartContext';
import { useHistory } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const history = useHistory();

  const handleCheckout = () => {
    if (cart.length > 0) {
      history.push('/checkout');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/main" />
          </IonButtons>
          <IonTitle>Shopping Cart</IonTitle>
          <IonButtons slot="end">
            {cart.length > 0 && (
              <IonButton onClick={clearCart}>Clear</IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {cart.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            <IonIcon 
              icon={cartOutline} 
              style={{ fontSize: '100px', color: '#ccc', marginBottom: '20px' }}
            />
            <h2>Your cart is empty</h2>
            <p style={{ color: '#666' }}>Add some delicious cookies to get started!</p>
            <IonButton onClick={() => history.push('/main')} style={{ marginTop: '20px' }}>
              Browse Products
            </IonButton>
          </div>
        ) : (
          <>
            <IonList>
              {cart.map((item) => (
                <IonItem key={item.cookie.id}>
                  <IonThumbnail slot="start">
                    <img 
                            src={`/products/${item.cookie.imageUrl}`} 
                            alt={item.cookie.name}
                           
                          />
                  </IonThumbnail>
                  <IonLabel>
                    <h2>{item.cookie.name}</h2>
                    <p>₱{item.cookie.price.toFixed(2)} each</p>
                    <h3 style={{ color: '#8B4513' }}>
                      ₱{(item.cookie.price * item.quantity).toFixed(2)}
                    </h3>
                  </IonLabel>
                  <div slot="end" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IonButton
                      fill="clear"
                      onClick={() => updateQuantity(item.cookie.id, item.quantity - 1)}
                    >
                      <IonIcon icon={removeOutline} />
                    </IonButton>
                    <span style={{ minWidth: '30px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <IonButton
                      fill="clear"
                      onClick={() => updateQuantity(item.cookie.id, item.quantity + 1)}
                    >
                      <IonIcon icon={addOutline} />
                    </IonButton>
                    <IonButton
                      fill="clear"
                      color="danger"
                      onClick={() => removeFromCart(item.cookie.id)}
                    >
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  </div>
                </IonItem>
              ))}
            </IonList>

            <IonCard style={{ margin: '20px' }}>
              <IonCardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>Subtotal:</strong>
                  <span>₱{getTotalPrice().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>Shipping:</strong>
                  <span>₱50.00</span>
                </div>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px' }}>
                  <strong>Total:</strong>
                  <strong style={{ color: '#8B4513' }}>
                    ₱{(getTotalPrice() + 50).toFixed(2)}
                  </strong>
                </div>
                <IonButton 
                  expand="block" 
                  onClick={handleCheckout}
                  style={{ marginTop: '20px' }}
                >
                  Proceed to Checkout
                </IonButton>
              </IonCardContent>
            </IonCard>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Cart;