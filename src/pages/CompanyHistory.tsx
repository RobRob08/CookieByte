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

const CompanyHistory: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/main" />
          </IonButtons>
          <IonTitle>Company History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <h1>Our Story</h1>
            <h3>Delivering joy, one byte at a time.
                Cookies Byte was founded in 2025 by Robert Cayago
                and Kishi Santos, who share a passion for sweet
                treats and seamless digital experiences.
                Recognizing the growing demand for convenient,
                high-quality dessert delivery, they thought of
                creating a platform that would bring joy to
                cookie lovers everywhere in the country. 
                The company is committed to making high-quality
                cookies accessible with ease for everyone.
            </h3>
            <br></br>
            <h2>Our Mission</h2>
            <p>
              to provide a seamless platform
                      that lets users browse, order, and gift cookies
                      with just a few taps.


            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default CompanyHistory;

