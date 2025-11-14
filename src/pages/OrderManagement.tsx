// src/pages/OrderManagement.tsx
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
  IonCardHeader,
  IonCardTitle,
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
  IonButton,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonSegment,
  IonSegmentButton,
  IonSearchbar,
  IonAccordion,
  IonAccordionGroup,
  IonModal
} from '@ionic/react';
import {
  receiptOutline,
  timeOutline,
  locationOutline,
  cardOutline,
  personOutline,
  createOutline,
  eyeOutline
} from 'ionicons/icons';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types/Order';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });

  const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchText, filterStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
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
      showToast('Failed to load orders', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchText.toLowerCase()) ||
        order.userId.toLowerCase().includes(searchText.toLowerCase()) ||
        order.shippingAddress?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadOrders();
    event.detail.complete();
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));

      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating order:', error);
      showToast('Failed to update order status', 'danger');
    }
  };

  const showToast = (message: string, color: string = 'success') => {
    setToast({ show: true, message, color });
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      revenue: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="warning">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Order Management</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Search orders..."
          />
        </IonToolbar>
        <IonToolbar>
          <IonSegment 
            value={filterStatus} 
            onIonChange={(e) => setFilterStatus(e.detail.value as string)}
            scrollable
          >
            <IonSegmentButton value="all">
              <IonLabel>All ({stats.total})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pending">
              <IonLabel>Pending ({stats.pending})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="processing">
              <IonLabel>Processing ({stats.processing})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="shipped">
              <IonLabel>Shipped ({stats.shipped})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="delivered">
              <IonLabel>Delivered ({stats.delivered})</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Statistics Card */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Order Statistics</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>Total Orders</IonLabel>
                <IonNote slot="end">{stats.total}</IonNote>
              </IonItem>
              <IonItem>
                <IonLabel>Total Revenue</IonLabel>
                <IonNote slot="end" style={{ color: '#8B4513', fontWeight: 'bold' }}>
                  ₱{stats.revenue.toFixed(2)}
                </IonNote>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <IonSpinner name="crescent" />
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <IonIcon 
              icon={receiptOutline} 
              style={{ fontSize: '80px', color: '#ccc', marginBottom: '20px' }} 
            />
            <h2>No orders found</h2>
            <p style={{ color: '#666' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <IonAccordionGroup>
            {filteredOrders.map((order) => (
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
                          <IonIcon icon={personOutline} slot="start" />
                          <IonLabel>
                            <h3>Customer ID</h3>
                            <p style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                              {order.userId}
                            </p>
                          </IonLabel>
                        </IonItem>

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

                        <IonItem>
                          <IonIcon icon={createOutline} slot="start" />
                          <IonLabel>Update Status</IonLabel>
                          <IonSelect
                            value={order.status}
                            onIonChange={(e) => handleStatusChange(order.id, e.detail.value)}
                          >
                            {statusOptions.map(status => (
                              <IonSelectOption key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </IonSelectOption>
                            ))}
                          </IonSelect>
                        </IonItem>

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
                                Qty: {item.quantity} × ₱{item.cookie ? item.cookie.price : item.price}
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

                        <IonButton
                          expand="block"
                          fill="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          style={{ margin: '10px 0' }}
                        >
                          <IonIcon icon={eyeOutline} slot="start" />
                          View Full Details
                        </IonButton>
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                </div>
              </IonAccordion>
            ))}
          </IonAccordionGroup>
        )}

        {/* Order Details Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar color="warning">
              <IonTitle>Order Details</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {selectedOrder && (
              <IonList>
                <IonItem>
                  <IonLabel>
                    <h2>Order ID</h2>
                    <p>{selectedOrder.id}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Customer ID</h2>
                    <p>{selectedOrder.userId}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Status</h2>
                    <IonBadge color={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status.toUpperCase()}
                    </IonBadge>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Order Date</h2>
                    <p>{formatDate(selectedOrder.createdAt)}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Total Amount</h2>
                    <p style={{ fontSize: '18px', color: '#8B4513' }}>
                      ₱{selectedOrder.totalAmount.toFixed(2)}
                    </p>
                  </IonLabel>
                </IonItem>
                {selectedOrder.shippingAddress && (
                  <IonItem>
                    <IonLabel>
                      <h2>Shipping Address</h2>
                      <p>{selectedOrder.shippingAddress}</p>
                    </IonLabel>
                  </IonItem>
                )}
                {selectedOrder.paymentId && (
                  <IonItem>
                    <IonLabel>
                      <h2>Payment ID</h2>
                      <p style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                        {selectedOrder.paymentId}
                      </p>
                    </IonLabel>
                  </IonItem>
                )}
              </IonList>
            )}
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={toast.show}
          onDidDismiss={() => setToast({ ...toast, show: false })}
          message={toast.message}
          duration={2000}
          color={toast.color}
        />
      </IonContent>
    </IonPage>
  );
};

export default OrderManagement;