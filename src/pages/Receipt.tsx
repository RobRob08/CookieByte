import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonBadge
} from '@ionic/react';
import { 
  checkmarkCircleOutline, 
  downloadOutline, 
  homeOutline,
  receiptOutline 
} from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ReceiptData {
  orderId: string;
  orderDate: Date;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentId?: string;
}

const Receipt: React.FC = () => {
  const location = useLocation<{ receiptData?: ReceiptData }>();
  const history = useHistory();
  const { currentUser } = useAuth();
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  useEffect(() => {
    if (location.state?.receiptData) {
      setReceiptData(location.state.receiptData);
    } else {
      // If no receipt data, redirect to main
      history.push('/main');
    }
  }, [location, history]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text receipt
    if (!receiptData) return;

    const receiptText = `
COOKIE BYTE RECEIPT
=====================================================

Order ID: ${receiptData.orderId}
Date: ${new Date(receiptData.orderDate).toLocaleString()}

Customer Information:
Name: ${currentUser?.displayName}
Email: ${currentUser?.email}
Phone: ${currentUser?.phoneNumber || 'N/A'}

Shipping Address:
${receiptData.shippingAddress}

=====================================================
ITEMS ORDERED:
=====================================================

${receiptData.items.map(item => 
  `${item.name}\n  Qty: ${item.quantity} × ₱${item.price.toFixed(2)} = ₱${(item.quantity * item.price).toFixed(2)}`
).join('\n\n')}

=====================================================
SUMMARY:
=====================================================

Subtotal:        ₱${receiptData.subtotal.toFixed(2)}
Shipping:        ₱${receiptData.shipping.toFixed(2)}
TOTAL:           ₱${receiptData.total.toFixed(2)}

Payment Method:  ${receiptData.paymentMethod.toUpperCase()}
${receiptData.paymentId ? `Payment ID:     ${receiptData.paymentId}` : ''}

=====================================================

Thank you for BYTEping with Cookie Byte!
Visit us at www.cookiebyte.com

For inquiries: support@cookiebyte.com
Phone: (02) 1234-5678
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${receiptData.orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!receiptData) {
    return null;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Order Receipt</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Success Message */}
          <div style={{ textAlign: 'center', padding: '30px 20px' }}>
            <IonIcon 
              icon={checkmarkCircleOutline} 
              style={{ fontSize: '80px', color: '#2dd36f' }}
            />
            <h1 style={{ margin: '20px 0 10px', color: '#2dd36f' }}>
              Order Successful!
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Receipt Card */}
          <IonCard className="receipt-card">
            <IonCardContent>
              {/* Header */}
              <div style={{ 
                textAlign: 'center', 
                borderBottom: '2px solid #8B4513',
                paddingBottom: '20px',
                marginBottom: '20px'
              }}>
                <h2 style={{ margin: 0, color: '#8B4513', fontSize: '28px' }}>
                  COOKIE BYTE
                </h2>
                <p style={{ margin: '5px 0 0', color: '#666' }}>
                  Official Receipt
                </p>
              </div>

              {/* Order Info */}
              <IonList>
                <IonItem>
                  <IonLabel>
                    <h3>Order ID</h3>
                    <p style={{ fontFamily: 'monospace' }}>
                      {receiptData.orderId}
                    </p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h3>Order Date</h3>
                    <p>{new Date(receiptData.orderDate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h3>Status</h3>
                    <IonBadge color="success">Paid</IonBadge>
                  </IonLabel>
                </IonItem>
              </IonList>

              {/* Customer Info */}
              <h3 style={{ marginTop: '30px', marginBottom: '10px', color: '#8B4513' }}>
                Customer Information
              </h3>
              <IonList>
                <IonItem>
                  <IonLabel>
                    <h3>Name</h3>
                    <p>{currentUser?.displayName}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h3>Email</h3>
                    <p>{currentUser?.email}</p>
                  </IonLabel>
                </IonItem>
                {currentUser?.phoneNumber && (
                  <IonItem>
                    <IonLabel>
                      <h3>Phone</h3>
                      <p>{currentUser.phoneNumber}</p>
                    </IonLabel>
                  </IonItem>
                )}
                <IonItem>
                  <IonLabel>
                    <h3>Shipping Address</h3>
                    <p>{receiptData.shippingAddress}</p>
                  </IonLabel>
                </IonItem>
              </IonList>

              {/* Items */}
              <h3 style={{ marginTop: '30px', marginBottom: '10px', color: '#8B4513' }}>
                Items Ordered
              </h3>
              <IonList>
                {receiptData.items.map((item, index) => (
                  <IonItem key={index}>
                    <IonLabel>
                      <h3>{item.name}</h3>
                      <p>Qty: {item.quantity} × ₱{item.price.toFixed(2)}</p>
                    </IonLabel>
                    <IonNote slot="end" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                      ₱{(item.quantity * item.price).toFixed(2)}
                    </IonNote>
                  </IonItem>
                ))}
              </IonList>

              {/* Summary */}
              <div style={{ 
                marginTop: '30px',
                padding: '20px',
                background: '#f8f8f8',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Subtotal:</span>
                  <span>₱{receiptData.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Shipping:</span>
                  <span>₱{receiptData.shipping.toFixed(2)}</span>
                </div>
                <hr style={{ margin: '15px 0' }} />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#8B4513'
                }}>
                  <span>TOTAL:</span>
                  <span>₱{receiptData.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <h3 style={{ marginTop: '30px', marginBottom: '10px', color: '#8B4513' }}>
                Payment Information
              </h3>
              <IonList>
                <IonItem>
                  <IonLabel>
                    <h3>Payment Method</h3>
                    <p>{receiptData.paymentMethod.toUpperCase()}</p>
                  </IonLabel>
                </IonItem>
                {receiptData.paymentId && (
                  <IonItem>
                    <IonLabel>
                      <h3>Payment ID</h3>
                      <p style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                        {receiptData.paymentId}
                      </p>
                    </IonLabel>
                  </IonItem>
                )}
              </IonList>

              {/* Footer */}
              <div style={{ 
                textAlign: 'center', 
                marginTop: '30px',
                padding: '20px',
                borderTop: '1px solid #ddd',
                color: '#666'
              }}>
                <p style={{ margin: '5px 0' }}>
                  Thank you for shopping with Cookie Byte!
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  For inquiries: support@cookiebyte.com | (02) 1234-5678
                </p>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginTop: '20px',
            flexWrap: 'wrap'
          }}>
            <IonButton 
              expand="block" 
              onClick={handlePrint}
              style={{ flex: 1 }}
            >
              <IonIcon icon={receiptOutline} slot="start" />
              Print Receipt
            </IonButton>
            <IonButton 
              expand="block" 
              fill="outline"
              onClick={handleDownload}
              style={{ flex: 1 }}
            >
              <IonIcon icon={downloadOutline} slot="start" />
              Download
            </IonButton>
          </div>

          <IonButton 
            expand="block"
            color="primary"
            onClick={() => history.push('/main')}
            style={{ marginTop: '10px' }}
          >
            <IonIcon icon={homeOutline} slot="start" />
            Continue Shopping
          </IonButton>
        </div>
      </IonContent>

      <style>{`
        @media print {
          ion-header, ion-toolbar, ion-button {
            display: none !important;
          }
          .receipt-card {
            box-shadow: none !important;
            border: 1px solid #ddd;
          }
        }
      `}</style>
    </IonPage>
  );
};

export default Receipt;
