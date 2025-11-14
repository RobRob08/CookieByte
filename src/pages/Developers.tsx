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
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonAvatar,
  IonBadge
} from '@ionic/react';
import { mailOutline } from 'ionicons/icons';
export const Developers: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/main" />
          </IonButtons>
          <IonTitle>Developers</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <h2>Development Team</h2>
            <p>Meet the talented individuals who brought Cookie Shop to life!</p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <IonAvatar style={{ width: '80px', height: '80px' }}>
                <img src="../images/Keshe Blu.jpeg" alt="Kishi Santos" />
              </IonAvatar>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 5px' }}>Kishi Blue N. Santos</h2>
                <p style={{ margin: '0', color: '#8B4513', fontWeight: 'bold' }}>Lead Developer & Architect</p>
                <p style={{ margin: '5px 0 0', fontSize: '14px' }}>Full Stack Developer</p>
              </div>
            </div>
            <div style={{ marginTop: '15px' }}>
              <p><strong>Email:</strong> qkbnsantos@tip.edu.ph</p>
              <p><strong>Specialization:</strong> React, Firebase, Mobile Development</p>
              <p><strong>Experience:</strong> Experienced in Mobile App Development and Design</p>
              <h4>Portfolio Highlights:</h4>
              <ul>
                <li>Experienced in Ionic Framework and Capacitor</li>
                <li>Firebase Database Developer</li>
              </ul>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <IonBadge color="primary">React</IonBadge>
                <IonBadge color="primary">TypeScript</IonBadge>
                <IonBadge color="primary">Firebase</IonBadge>
                <IonBadge color="primary">Ionic</IonBadge>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <IonAvatar style={{ width: '80px', height: '80px' }}>
                <img src="../images/cayago.png" alt="Robert Cayago" />
              </IonAvatar>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 5px' }}>Robert Christian R. Cayago</h2>
                <p style={{ margin: '0', color: '#8B4513', fontWeight: 'bold' }}>UI/UX Designer</p>
                <p style={{ margin: '5px 0 0', fontSize: '14px' }}>Product Designer</p>
              </div>
            </div>
            <div style={{ marginTop: '15px' }}>
              <p><strong>Email:</strong> qrcrcayago@tip.edu.ph</p>
              <p><strong>Specialization:</strong> User Experience, Interface Design, Branding</p>
              <p><strong>Experience:</strong> Experienced UI/UX Designer</p>
              <h4>Portfolio Highlights:</h4>
              <ul>
                <li>Created Logos for Applications</li>
                <li>Certified Expert in Figma</li>

              </ul>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <IonBadge color="secondary">Figma</IonBadge>
                <IonBadge color="secondary">Illustrator</IonBadge>
              </div>
            </div>
          </IonCardContent>
        </IonCard>


        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Technologies Used</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <h3>Frontend</h3>
            <ul>
              <li>Ionic Framework 8.x - Cross-platform mobile development</li>
              <li>React 18.x - UI library</li>
              <li>TypeScript - Type-safe JavaScript</li>
              <li>Capacitor 6.x - Native mobile runtime</li>
            </ul>
            <h3>Backend</h3>
            <ul>
              <li>Firebase Authentication - User management</li>
              <li>Cloud Firestore - NoSQL database</li>
              <li>Cloud Functions - Serverless backend</li>
            </ul>
            <h3>Payment Integration</h3>
            <ul>
              <li>PayMongo API - Philippine payment gateway</li>
              <li>Support for Cards, GCash, and PayMaya</li>
            </ul>
            <h3>Tools & Services</h3>
            <ul>
              <li>Git & GitHub - Version control</li>
              <li>VS Code - Development environment</li>
              <li>Figma - Design collaboration</li>
            </ul>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h2>Get In Touch</h2>
            <p>Interested in working with our team or have questions about the app?</p>
            <IonButton expand="block" href="mailto:dev@cookieshop.com">
              <IonIcon icon={mailOutline} slot="start" />
              Contact Development Team
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
export default Developers;