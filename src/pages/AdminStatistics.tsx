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
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonChip,
  IonAvatar
} from '@ionic/react';
import {
  statsChartOutline,
  trendingUpOutline,
  trendingDownOutline,
  peopleOutline,
  cartOutline,
  alertCircleOutline,
  starOutline,
  cashOutline
} from 'ionicons/icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface ProductStat {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
  stock: number;
}

interface UserStat {
  userId: string;
  userName: string;
  userEmail: string;
  totalOrders: number;
  totalSpent: number;
}

interface DailyStat {
  date: string;
  orders: number;
  revenue: number;
}

const AdminStatistics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  // Statistics state
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  
  // Product statistics
  const [lowStockProducts, setLowStockProducts] = useState<ProductStat[]>([]);
  const [topProducts, setTopProducts] = useState<ProductStat[]>([]);
  
  // User statistics
  const [topUsers, setTopUsers] = useState<UserStat[]>([]);
  
  // Daily statistics for chart
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  
  // Growth metrics
  const [revenueGrowth, setRevenueGrowth] = useState(0);
  const [orderGrowth, setOrderGrowth] = useState(0);

  useEffect(() => {
    loadStatistics();
  }, [timeRange]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      
      // Fetch all collections
      const [ordersSnapshot, productsSnapshot, usersSnapshot] = await Promise.all([
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'Cookies')),
        getDocs(collection(db, 'users'))
      ]);

      // Process orders
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));

      // Process products
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().Name || doc.data().name,
        stock: doc.data().Stock || doc.data().stock || 0,
        price: doc.data().Price || doc.data().price || 0
      }));

      // Calculate date range
      const now = new Date();
      const rangeStart = new Date();
      if (timeRange === 'week') {
        rangeStart.setDate(now.getDate() - 7);
      } else if (timeRange === 'month') {
        rangeStart.setMonth(now.getMonth() - 1);
      } else {
        rangeStart.setFullYear(now.getFullYear() - 1);
      }

      // Filter orders by date range
      const filteredOrders = orders.filter(order => order.createdAt >= rangeStart);

      // Calculate basic stats
      const revenue = filteredOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      const orderCount = filteredOrders.length;
      const customerIds = new Set(filteredOrders.map(o => o.userId));
      const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;

      setTotalRevenue(revenue);
      setTotalOrders(orderCount);
      setTotalCustomers(customerIds.size);
      setAverageOrderValue(avgOrderValue);

      // Calculate growth (compare with previous period)
      const previousPeriodStart = new Date(rangeStart);
      if (timeRange === 'week') {
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
      } else if (timeRange === 'month') {
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
      } else {
        previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1);
      }

      const previousOrders = orders.filter(
        order => order.createdAt >= previousPeriodStart && order.createdAt < rangeStart
      );
      const previousRevenue = previousOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const previousOrderCount = previousOrders.length;

      const revGrowth = previousRevenue > 0 
        ? ((revenue - previousRevenue) / previousRevenue) * 100 
        : 0;
      const ordGrowth = previousOrderCount > 0
        ? ((orderCount - previousOrderCount) / previousOrderCount) * 100
        : 0;

      setRevenueGrowth(revGrowth);
      setOrderGrowth(ordGrowth);

      // Process product statistics
      const productStats = new Map<string, { name: string; totalSold: number; revenue: number; stock: number }>();
      
      products.forEach(product => {
        productStats.set(product.id, {
          name: product.name,
          totalSold: 0,
          revenue: 0,
          stock: product.stock
        });
      });

      filteredOrders.forEach(order => {
        if (order.status === 'cancelled') return;
        order.items?.forEach((item: any) => {
          const productId = item.cookieId;
          if (productStats.has(productId)) {
            const stat = productStats.get(productId)!;
            stat.totalSold += item.quantity;
            stat.revenue += item.price * item.quantity;
          }
        });
      });

      // Top selling products
      const topProductsArray = Array.from(productStats.entries())
        .map(([id, stat]) => ({ id, ...stat }))
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 5);

      setTopProducts(topProductsArray);

      // Low stock products
      const lowStock = Array.from(productStats.entries())
        .map(([id, stat]) => ({ id, ...stat }))
        .filter(p => p.stock <= 10 && p.stock > 0)
        .sort((a, b) => a.stock - b.stock);

      setLowStockProducts(lowStock);

      // Process user statistics
      const userStats = new Map<string, { userName: string; userEmail: string; totalOrders: number; totalSpent: number }>();

      filteredOrders.forEach(order => {
        if (order.status === 'cancelled') return;
        const userId = order.userId;
        if (!userStats.has(userId)) {
          userStats.set(userId, {
            userName: order.userName || 'Unknown',
            userEmail: order.userEmail || 'N/A',
            totalOrders: 0,
            totalSpent: 0
          });
        }
        const stat = userStats.get(userId)!;
        stat.totalOrders += 1;
        stat.totalSpent += order.totalAmount || 0;
      });

      const topUsersArray = Array.from(userStats.entries())
        .map(([userId, stat]) => ({ userId, ...stat }))
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);

      setTopUsers(topUsersArray);

      // Process daily statistics for chart
      const dailyData = new Map<string, { orders: number; revenue: number }>();
      
      filteredOrders.forEach(order => {
        const dateKey = order.createdAt.toLocaleDateString('en-CA'); // YYYY-MM-DD
        if (!dailyData.has(dateKey)) {
          dailyData.set(dateKey, { orders: 0, revenue: 0 });
        }
        const stat = dailyData.get(dateKey)!;
        stat.orders += 1;
        if (order.status !== 'cancelled') {
          stat.revenue += order.totalAmount || 0;
        }
      });

      const dailyStatsArray = Array.from(dailyData.entries())
        .map(([date, stat]) => ({ date, ...stat }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setDailyStats(dailyStatsArray);

    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadStatistics();
    event.detail.complete();
  };

  const formatCurrency = (amount: number) => `₱${amount.toFixed(2)}`;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="warning">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Statistics Dashboard</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={timeRange} onIonChange={(e) => setTimeRange(e.detail.value as any)}>
            <IonSegmentButton value="week">
              <IonLabel>Week</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="month">
              <IonLabel>Month</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="year">
              <IonLabel>Year</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <IonSpinner name="crescent" />
            <p>Loading statistics...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <IonGrid>
              <IonRow>
                <IonCol size="6" sizeMd="3">
                  <IonCard style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', margin: '8px' }}>
                    <IonCardContent>
                      <IonIcon icon={cashOutline} style={{ fontSize: '32px', opacity: 0.8 }} />
                      <h2 style={{ margin: '10px 0 5px', fontSize: '24px' }}>{formatCurrency(totalRevenue)}</h2>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Total Revenue</p>
                      {revenueGrowth !== 0 && (
                        <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                          <IonIcon 
                            icon={revenueGrowth > 0 ? trendingUpOutline : trendingDownOutline}
                            style={{ fontSize: '16px' }}
                          />
                          <span style={{ fontSize: '12px', marginLeft: '5px' }}>
                            {revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="6" sizeMd="3">
                  <IonCard style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', margin: '8px' }}>
                    <IonCardContent>
                      <IonIcon icon={cartOutline} style={{ fontSize: '32px', opacity: 0.8 }} />
                      <h2 style={{ margin: '10px 0 5px', fontSize: '24px' }}>{totalOrders}</h2>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Total Orders</p>
                      {orderGrowth !== 0 && (
                        <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                          <IonIcon 
                            icon={orderGrowth > 0 ? trendingUpOutline : trendingDownOutline}
                            style={{ fontSize: '16px' }}
                          />
                          <span style={{ fontSize: '12px', marginLeft: '5px' }}>
                            {orderGrowth > 0 ? '+' : ''}{orderGrowth.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="6" sizeMd="3">
                  <IonCard style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', margin: '8px' }}>
                    <IonCardContent>
                      <IonIcon icon={peopleOutline} style={{ fontSize: '32px', opacity: 0.8 }} />
                      <h2 style={{ margin: '10px 0 5px', fontSize: '24px' }}>{totalCustomers}</h2>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Customers</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="6" sizeMd="3">
                  <IonCard style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white', margin: '8px' }}>
                    <IonCardContent>
                      <IonIcon icon={statsChartOutline} style={{ fontSize: '32px', opacity: 0.8 }} />
                      <h2 style={{ margin: '10px 0 5px', fontSize: '24px' }}>{formatCurrency(averageOrderValue)}</h2>
                      <p style={{ margin: '0', fontSize: '12px', opacity: 0.9 }}>Avg Order Value</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <IonCard color="warning">
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={alertCircleOutline} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                    Low Stock Alert ({lowStockProducts.length})
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    {lowStockProducts.map(product => (
                      <IonItem key={product.id}>
                        <IonLabel>
                          <h3>{product.name}</h3>
                          <p>Only {product.stock} left in stock</p>
                        </IonLabel>
                        <IonBadge color="danger" slot="end">{product.stock}</IonBadge>
                      </IonItem>
                    ))}
                  </IonList>
                </IonCardContent>
              </IonCard>
            )}

            {/* Top Products */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={starOutline} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                  Top Selling Products
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {topProducts.length > 0 ? (
                  <IonList>
                    {topProducts.map((product, index) => (
                      <IonItem key={product.id}>
                        <IonLabel>
                          <h3>
                            <IonBadge color="primary" style={{ marginRight: '10px' }}>#{index + 1}</IonBadge>
                            {product.name}
                          </h3>
                          <p>Sold: {product.totalSold} units | Revenue: {formatCurrency(product.revenue)}</p>
                        </IonLabel>
                        <IonChip slot="end" color="success">
                          {product.totalSold} sold
                        </IonChip>
                      </IonItem>
                    ))}
                  </IonList>
                ) : (
                  <p style={{ textAlign: 'center', color: '#666' }}>No sales data available</p>
                )}
              </IonCardContent>
            </IonCard>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AdminStatistics;