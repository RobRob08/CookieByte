// src/pages/CompanyHistory.tsx
import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent
} from '@ionic/react';

// src/pages/AboutApp.tsx
export const AboutApp: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/main" />
          </IonButtons>
          <IonTitle>About the App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <h1>Cookie Byte</h1>
            <h3>Cookies Byte is a delightful cookie store app
              designed to satisfy your sweet cravings with just
              a few taps. Whether you're hunting for classic
              chocolate chip, double chocolate chip, or
              adventurous flavor combos, and gifting cookies
              a breeze. Cookies Bytes makes browsing and
              ordering cookies for everyone.
            </h3>

            <br>
            </br>

            <h1>Technology</h1>
            <p>Built with cutting-edge technology:</p>
            <ul>
              <li>Ionic Framework for cross-platform mobile development</li>
              <li>React for modern UI</li>
              <li>Firebase for backend services</li>
              <li>PayMongo for secure payments</li>
            </ul>
            
            <br>
            </br>
            
            <h1>Privacy & Security</h1>
            <p>
              Your data is encrypted and secure. We never share your personal information with third parties. 
              All payments are processed through PCI-compliant payment gateways.
            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
export default AboutApp;