// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
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
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner
} from '@ionic/react';
import { 
  receiptOutline, 
  trendingUpOutline,
  peopleOutline,
  arrowForwardOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const AdminDashboard: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get products count
      const productsSnapshot = await getDocs(collection(db, 'Cookies'));
      const products = productsSnapshot.docs.map(doc => doc.data());
      const lowStock = products.filter(p => (p.Stock || 0) <= 10).length;

      // Get orders data
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const orders = ordersSnapshot.docs.map(doc => doc.data());
      const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
      const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      setStats({
        totalProducts: productsSnapshot.size,
        totalOrders: ordersSnapshot.size,
        pendingOrders,
        totalRevenue,
        lowStockProducts: lowStock
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="warning">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Admin Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <IonSpinner name="crescent" />
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            <h2 style={{ marginTop: '20px', marginBottom: '20px' }}>Overview</h2>

            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeMd="6">
                  <IonCard style={{ background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)' }}>
                    <IonCardContent style={{ color: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Total Revenue</h3>
                          <h1 style={{ margin: '10px 0', fontSize: '32px' }}>
                            ₱{stats.totalRevenue.toFixed(2)}
                          </h1>
                        </div>
                        <IonIcon icon={trendingUpOutline} style={{ fontSize: '48px', opacity: 0.5 }} />
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="12" sizeMd="6">
                  <IonCard style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)' }}>
                    <IonCardContent style={{ color: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Total Orders</h3>
                          <h1 style={{ margin: '10px 0', fontSize: '32px' }}>
                            {stats.totalOrders}
                          </h1>
                          <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
                            {stats.pendingOrders} pending
                          </p>
                        </div>
                        <IonIcon icon={receiptOutline} style={{ fontSize: '48px', opacity: 0.5 }} />
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="12" sizeMd="6">
                  <IonCard style={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8A0 100%)' }}>
                    <IonCardContent style={{ color: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Total Products</h3>
                          <h1 style={{ margin: '10px 0', fontSize: '32px' }}>
                            {stats.totalProducts}
                          </h1>
                          {stats.lowStockProducts > 0 && (
                            <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
                              {stats.lowStockProducts} low stock
                            </p>
                          )}
                        </div>
                        <IonIcon style={{ fontSize: '48px', opacity: 0.5 }} />
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="12" sizeMd="6">
                  <IonCard style={{ background: 'linear-gradient(135deg, #95E1D3 0%, #75C9BA 100%)' }}>
                    <IonCardContent style={{ color: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Active Customers</h3>
                          <h1 style={{ margin: '10px 0', fontSize: '32px' }}>
                            Growing
                          </h1>
                        </div>
                        <IonIcon icon={peopleOutline} style={{ fontSize: '48px', opacity: 0.5 }} />
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>

            <h2 style={{ marginTop: '30px', marginBottom: '20px' }}>Quick Actions</h2>

            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeMd="6">
                  <IonCard button onClick={() => history.push('/admin/products')}>
                    <IonCardHeader>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <IonIcon 
                  
                            style={{ fontSize: '40px', color: '#8B4513' }} 
                          />
                          <div>
                            <IonCardTitle>Product Management</IonCardTitle>
                            <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>
                              Add, edit, or remove products
                            </p>
                          </div>
                        </div>
                        <IonIcon icon={arrowForwardOutline} />
                      </div>
                    </IonCardHeader>
                  </IonCard>
                </IonCol>

                <IonCol size="12" sizeMd="6">
                  <IonCard button onClick={() => history.push('/admin/orders')}>
                    <IonCardHeader>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <IonIcon 
                            icon={receiptOutline} 
                            style={{ fontSize: '40px', color: '#FF6B35' }} 
                          />
                          <div>
                            <IonCardTitle>Order Management</IonCardTitle>
                            <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>
                              View and manage customer orders
                            </p>
                          </div>
                        </div>
                        <IonIcon icon={arrowForwardOutline} />
                      </div>
                    </IonCardHeader>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>

            {stats.lowStockProducts > 0 && (
              <IonCard color="warning" style={{ marginTop: '20px' }}>
                <IonCardHeader>
                  <IonCardTitle>⚠️ Low Stock Alert</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>
                    You have {stats.lowStockProducts} product(s) with low stock. 
                    Please restock soon to avoid running out!
                  </p>
                  <IonButton 
                    fill="outline" 
                    onClick={() => history.push('/admin/products')}
                    style={{ marginTop: '10px' }}
                  >
                    View Products
                  </IonButton>
                </IonCardContent>
              </IonCard>
            )}

            {stats.pendingOrders > 0 && (
              <IonCard color="tertiary" style={{ marginTop: '20px' }}>
                <IonCardHeader>
                  <IonCardTitle>📦 Pending Orders</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>
                    You have {stats.pendingOrders} order(s) awaiting processing. 
                    Check them out and update their status!
                  </p>
                  <IonButton 
                    fill="outline" 
                    onClick={() => history.push('/admin/orders')}
                    style={{ marginTop: '10px' }}
                  >
                    View Orders
                  </IonButton>
                </IonCardContent>
              </IonCard>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;