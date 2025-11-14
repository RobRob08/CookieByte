// src/pages/Signup.tsx
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
  IonButton,
  IonButtons,
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
import { 
  mailOutline, 
  lockClosedOutline, 
  personOutline, 
  callOutline,
  personAddOutline 
} from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const history = useHistory();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !displayName || !phoneNumber) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password, displayName, phoneNumber);
      history.push('/main');
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
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
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: '500px', margin: '30px auto' }}>
          <IonCard>
            <IonCardHeader>
               <img src='../Logoooo.png'/>
              <IonCardTitle style={{ textAlign: 'center', fontSize: '24px' }}>
                Create Account
              </IonCardTitle>
              <p style={{ textAlign: 'center', color: '#666' }}>
                Join us and start shopping!
              </p>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleSignup}>
                <IonItem>
                  <IonIcon icon={personOutline} slot="start" />
                  <IonLabel position="floating">Full Name</IonLabel>
                  <IonInput
                    type="text"
                    value={displayName}
                    onIonInput={(e) => setDisplayName(e.detail.value!)}
                    required
                  />
                </IonItem>

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
                  <IonIcon icon={callOutline} slot="start" />
                  <IonLabel position="floating">Phone Number</IonLabel>
                  <IonInput
                    type="tel"
                    value={phoneNumber}
                    onIonInput={(e) => setPhoneNumber(e.detail.value!)}
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

                <IonItem>
                  <IonIcon icon={lockClosedOutline} slot="start" />
                  <IonLabel position="floating">Confirm Password</IonLabel>
                  <IonInput
                    type="password"
                    value={confirmPassword}
                    onIonInput={(e) => setConfirmPassword(e.detail.value!)}
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
                      <IonIcon icon={personAddOutline} slot="start" />
                      Sign Up
                    </>
                  )}
                </IonButton>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <IonText>
                    Already have an account?{' '}
                    <a href="/login" style={{ color: '#8B4513' }}>
                      Login
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

export default Signup;