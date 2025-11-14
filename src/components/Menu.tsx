// src/components/Menu.tsx
import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  IonAvatar,
  IonButton
} from '@ionic/react';
import {
  homeOutline,
  cartOutline,
  timeOutline,
  informationCircleOutline,
  callOutline,
  codeSlashOutline,
  logInOutline,
  logOutOutline,
  personAddOutline,
  shieldCheckmarkOutline,
  personOutline,
  receiptOutline
} from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useHistory } from 'react-router-dom';

const Menu: React.FC = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      history.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Cookie Shop</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {currentUser && (
          <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
            <IonAvatar style={{ width: '80px', height: '80px', margin: '0 auto' }}>
              <img 
                src={currentUser.photoURL || 'https://ionicframework.com/docs/img/demos/avatar.svg'} 
                alt="User" 
              />
            </IonAvatar>
            <h3 style={{ margin: '10px 0 5px' }}>{currentUser.displayName}</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              {currentUser.phoneNumber || currentUser.email}
            </p>
            {isAdmin && (
              <IonButton size="small" color="warning" style={{ marginTop: '10px' }}>
                <IonIcon icon={shieldCheckmarkOutline} slot="start" />
                Admin
              </IonButton>
            )}
          </div>
        )}

        <IonList>
          <IonMenuToggle autoHide={false}>
            <IonItem button routerLink="/main" routerDirection="none">
              <IonIcon icon={homeOutline} slot="start" />
              <IonLabel>Products</IonLabel>
            </IonItem>

            <IonItem button routerLink="/cart" routerDirection="none">
              <IonIcon icon={cartOutline} slot="start" />
              <IonLabel>Cart</IonLabel>
              {getTotalItems() > 0 && (
                <IonLabel slot="end" color="primary">
                  {getTotalItems()}
                </IonLabel>
              )}
            </IonItem>

            {currentUser && (
              <>
                <IonItem button routerLink="/profile" routerDirection="none">
                  <IonIcon icon={personOutline} slot="start" />
                  <IonLabel>My Profile</IonLabel>
                </IonItem>

                <IonItem button routerLink="/order-history" routerDirection="none">
                  <IonIcon icon={receiptOutline} slot="start" />
                  <IonLabel>Order History</IonLabel>
                </IonItem>
              </>
            )}

            <IonItem button routerLink="/company-history" routerDirection="none">
              <IonIcon icon={timeOutline} slot="start" />
              <IonLabel>Company History</IonLabel>
            </IonItem>

            <IonItem button routerLink="/about-products" routerDirection="none">
              <IonIcon slot="start" />
              <IonLabel>About our Products</IonLabel>
            </IonItem>

            <IonItem button routerLink="/about-app" routerDirection="none">
              <IonIcon icon={informationCircleOutline} slot="start" />
              <IonLabel>About the App</IonLabel>
            </IonItem>

            <IonItem button routerLink="/developers" routerDirection="none">
              <IonIcon icon={codeSlashOutline} slot="start" />
              <IonLabel>Developers</IonLabel>
            </IonItem>

            <IonItem button routerLink="/contact-us" routerDirection="none">
              <IonIcon icon={callOutline} slot="start" />
              <IonLabel>Contact Us</IonLabel>
            </IonItem>

            {isAdmin && (
              <>
                <IonItem button routerLink="/admin/products" routerDirection="none" color="warning">
                  <IonIcon slot="start" />
                  <IonLabel>Product Management</IonLabel>
                </IonItem>
                
                <IonItem button routerLink="/admin/orders" routerDirection="none" color="warning">
                  <IonIcon icon={receiptOutline} slot="start" />
                  <IonLabel>Order Management</IonLabel>
                </IonItem>
              </>
            )}

            {!currentUser ? (
              <>
                <IonItem button routerLink="/login" routerDirection="none">
                  <IonIcon icon={logInOutline} slot="start" />
                  <IonLabel>Login</IonLabel>
                </IonItem>
                <IonItem button routerLink="/signup" routerDirection="none">
                  <IonIcon icon={personAddOutline} slot="start" />
                  <IonLabel>Sign Up</IonLabel>
                </IonItem>
              </>
            ) : (
              <IonItem button onClick={handleLogout}>
                <IonIcon icon={logOutOutline} slot="start" />
                <IonLabel>Logout</IonLabel>
              </IonItem>
            )}
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;