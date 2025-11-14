// src/pages/Login.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButtons,
  IonButton,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonText,
  IonSpinner,
  IonToast
} from '@ionic/react';
import { mailOutline, lockClosedOutline, logInOutline } from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      history.push('/main');
    } catch (error: any) {
      setError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
           <IonButtons slot="start">
                      <IonBackButton defaultHref="/main" />
                    </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: '500px', margin: '50px auto' }}>
          <IonCard>
            <IonCardHeader>
              <img src='../Logoooo.png'/>
              <IonCardTitle style={{ textAlign: 'center', fontSize: '24px' }}>
                Welcome Back!
              </IonCardTitle>
              <p style={{ textAlign: 'center', color: '#666' }}>
                Login to continue shopping
              </p>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleLogin}>
                <IonItem>
                  <IonIcon icon={mailOutline} slot="start" />
                  <IonLabel position="floating">Email</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonInput={(e) => setEmail(e.detail.value!)}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonIcon icon={lockClosedOutline} slot="start" />
                  <IonLabel position="floating">Password</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value!)}
                    required
                  />
                </IonItem>

                <IonButton
                  expand="block"
                  type="submit"
                  style={{ marginTop: '20px' }}
                  disabled={loading}
                >
                  {loading ? <IonSpinner name="crescent" /> : (
                    <>
                      <IonIcon icon={logInOutline} slot="start" />
                      Login
                    </>
                  )}
                </IonButton>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <IonText>
                    Don't have an account?{' '}
                    <a href="/signup" style={{ color: '#8B4513' }}>
                      Sign Up
                    </a>
                  </IonText>
                </div>
              </form>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={!!error}
          onDidDismiss={() => setError('')}
          message={error}
          duration={3000}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;