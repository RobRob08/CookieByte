// src/pages/CompanyHistory.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
  IonSelect,
  IonSelectOption,
  IonList
} from '@ionic/react';
import { sendOutline } from 'ionicons/icons';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setToast({ show: true, message: 'Please fill in all required fields', color: 'warning' });
      return;
    }

    try {
      setLoading(true);
      
      // Save feedback to Firestore
      const { addDoc, collection } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      
      await addDoc(collection(db, 'feedback'), {
        ...formData,
        createdAt: new Date(),
        status: 'pending'
      });

      setToast({ show: true, message: 'Thank you for your feedback!', color: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '', rating: 5 });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setToast({ show: true, message: 'Failed to submit feedback', color: 'danger' });
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
          <IonTitle>Contact Us</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you! Reach out to us through any of the following channels:</p>
            
            <h3>Address</h3>
            <p>
              123 Cookie Street<br />
              Marikina City, Metro Manila<br />
              Philippines 1800
            </p>
            
            <h3>Phone</h3>
            <p>
              Main Line: (02) 1234-5678<br />
              Mobile: +63 917 123 4567
            </p>
            
            <h3>Email</h3>
            <p>
              General Inquiries: info@cookieshop.com<br />
              Support: support@cookieshop.com<br />
              Orders: orders@cookieshop.com
            </p>
            
            <h3>Business Hours</h3>
            <p>
              Monday - Friday: 8:00 AM - 8:00 PM<br />
              Saturday - Sunday: 9:00 AM - 6:00 PM
            </p>
            
            <h3>Social Media</h3>
            <p>
              Facebook: @CookieShopPH<br />
              Instagram: @cookieshop_ph<br />
              Twitter: @CookieShopPH
            </p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Send Us Feedback</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <form onSubmit={handleSubmit}>
              <IonList>
                <IonItem>
                  <IonLabel position="floating">Your Name *</IonLabel>
                  <IonInput
                    value={formData.name}
                    onIonInput={(e) => setFormData({ ...formData, name: e.detail.value! })}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">Email Address *</IonLabel>
                  <IonInput
                    type="email"
                    value={formData.email}
                    onIonInput={(e) => setFormData({ ...formData, email: e.detail.value! })}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">Subject</IonLabel>
                  <IonInput
                    value={formData.subject}
                    onIonInput={(e) => setFormData({ ...formData, subject: e.detail.value! })}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">How would you rate us?</IonLabel>
                  <IonSelect 
                    value={formData.rating}
                    onIonChange={(e) => setFormData({ ...formData, rating: e.detail.value })}
                  >
                    <IonSelectOption value={5}>⭐⭐⭐⭐⭐ Excellent</IonSelectOption>
                    <IonSelectOption value={4}>⭐⭐⭐⭐ Very Good</IonSelectOption>
                    <IonSelectOption value={3}>⭐⭐⭐ Good</IonSelectOption>
                    <IonSelectOption value={2}>⭐⭐ Fair</IonSelectOption>
                    <IonSelectOption value={1}>⭐ Poor</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">Your Message *</IonLabel>
                  <IonTextarea
                    value={formData.message}
                    onIonInput={(e) => setFormData({ ...formData, message: e.detail.value! })}
                    rows={6}
                    required
                  />
                </IonItem>
              </IonList>

              <IonButton 
                expand="block" 
                type="submit"
                disabled={loading}
                style={{ marginTop: '20px' }}
              >
                {loading ? (
                  <IonSpinner name="crescent" />
                ) : (
                  <>
                    <IonIcon icon={sendOutline} slot="start" />
                    Submit Feedback
                  </>
                )}
              </IonButton>
            </form>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={toast.show}
          onDidDismiss={() => setToast({ ...toast, show: false })}
          message={toast.message}
          duration={3000}
          color={toast.color}
        />
      </IonContent>
    </IonPage>
  );
};

export default ContactUs;