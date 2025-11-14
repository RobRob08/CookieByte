// src/App.tsx
import React, { useEffect } from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

import Menu from './components/Menu';
import MainScreen from './pages/MainScreen';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import CompanyHistory from './pages/CompanyHistory';
import AboutProducts from './pages/AboutProducts';
import AboutApp from './pages/AboutApp';
import Developers from './pages/Developers';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';
import ProductManagement from './pages/ProductManagement';
import OrderManagement from './pages/OrderManagement';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import Checkout from './pages/Checkout';
import PrivateRoute from './components/PrivateRoute';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    const initApp = async () => {
      await SplashScreen.hide();
      
      try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#8B4513' });
      } catch (error) {
        console.log('StatusBar not available');
      }
    };

    initApp();
  }, []);

  return (
    <IonApp>
      <AuthProvider>
        <CartProvider>
          <IonReactRouter>
            <Menu />
            <IonRouterOutlet id="main">
              <Route path="/login" component={Login} exact />
              <Route path="/signup" component={Signup} exact />
              <Route path="/main" component={MainScreen} exact />
              <Route path="/cart" component={Cart} exact />
              <Route path="/checkout" component={Checkout} exact />
              <Route path="/company-history" component={CompanyHistory} exact />
              <Route path="/about-products" component={AboutProducts} exact />
              <Route path="/about-app" component={AboutApp} exact />
              <Route path="/developers" component={Developers} exact />
              <Route path="/contact-us" component={ContactUs} exact />
              <PrivateRoute path="/profile" component={Profile} exact />
              <PrivateRoute path="/order-history" component={OrderHistory} exact />
              <PrivateRoute path="/admin" component={AdminDashboard} adminOnly exact />
              <PrivateRoute path="/admin/products" component={ProductManagement} adminOnly exact />
              <PrivateRoute path="/admin/orders" component={OrderManagement} adminOnly exact />
              <Route path="/" exact>
                <Redirect to="/main" />
              </Route>
            </IonRouterOutlet>
          </IonReactRouter>
        </CartProvider>
      </AuthProvider>
    </IonApp>
  );
};

export default App;