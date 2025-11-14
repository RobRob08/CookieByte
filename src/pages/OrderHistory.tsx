// src/pages/OrderHistory.tsx
import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
  IonNote,
  IonAccordion,
  IonAccordionGroup
} from '@ionic/react';
import { receiptOutline, timeOutline, locationOutline, cardOutline } from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types/Order';

const OrderHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [currentUser]);

  const loadOrders = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const ordersList: Order[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        items: doc.data().items,
        totalAmount: doc.data().totalAmount,
        status: doc.data().status,
        paymentId: doc.data().paymentId,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        shippingAddress: doc.data().shippingAddress
      }));

      setOrders(ordersList);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadOrders();
    event.detail.complete();
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'warning',
      paid: 'success',
      processing: 'primary',
      shipped: 'secondary',
      delivered: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'medium';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Order History</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <IonSpinner name="crescent" />
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <IonIcon 
              icon={receiptOutline} 
              style={{ fontSize: '80px', color: '#ccc', marginBottom: '20px' }} 
            />
            <h2>No orders yet</h2>
            <p style={{ color: '#666' }}>Start shopping to see your orders here!</p>
          </div>
        ) : (
          <IonAccordionGroup>
            {orders.map((order) => (
              <IonAccordion key={order.id} value={order.id}>
                <IonItem slot="header">
                  <IonLabel>
                    <h2>Order #{order.id.substring(0, 8).toUpperCase()}</h2>
                    <p>
                      <IonIcon icon={timeOutline} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                      {formatDate(order.createdAt)}
                    </p>
                  </IonLabel>
                  <IonBadge color={getStatusColor(order.status)} slot="end">
                    {order.status.toUpperCase()}
                  </IonBadge>
                </IonItem>

                <div slot="content" style={{ padding: '0' }}>
                  <IonCard style={{ margin: '0', boxShadow: 'none' }}>
                    <IonCardContent>
                      <IonList>
                        <IonItem>
                          <IonIcon icon={cardOutline} slot="start" />
                          <IonLabel>
                            <h3>Total Amount</h3>
                            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#8B4513' }}>
                              ₱{order.totalAmount.toFixed(2)}
                            </p>
                          </IonLabel>
                        </IonItem>

                        {order.shippingAddress && (
                          <IonItem>
                            <IonIcon icon={locationOutline} slot="start" />
                            <IonLabel>
                              <h3>Shipping Address</h3>
                              <p>{order.shippingAddress}</p>
                            </IonLabel>
                          </IonItem>
                        )}

                        <IonItem lines="none">
                          <IonLabel>
                            <h3>Order Items</h3>
                          </IonLabel>
                        </IonItem>

                        {order.items.map((item, index) => (
                          <IonItem key={index}>
                            <IonLabel>
                              <h3>{item.cookie ? item.cookie.name : item.name}</h3>
                              <p>
                                Quantity: {item.quantity} × ₱{item.cookie ? item.cookie.price : item.price}
                              </p>
                            </IonLabel>
                            <IonNote slot="end">
                              ₱{((item.cookie ? item.cookie.price : item.price) * item.quantity).toFixed(2)}
                            </IonNote>
                          </IonItem>
                        ))}

                        {order.paymentId && (
                          <IonItem>
                            <IonLabel>
                              <h3>Payment ID</h3>
                              <p style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                                {order.paymentId}
                              </p>
                            </IonLabel>
                          </IonItem>
                        )}
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                </div>
              </IonAccordion>
            ))}
          </IonAccordionGroup>
        )}
      </IonContent>
    </IonPage>
  );
};

export default OrderHistory;