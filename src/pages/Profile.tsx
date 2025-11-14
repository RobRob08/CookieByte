// src/pages/Profile.tsx
import React, { useState, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonAvatar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonToast,
  IonSpinner,
  IonList,
  IonActionSheet
} from '@ionic/react';
import {
  personOutline,
  mailOutline,
  callOutline,
  saveOutline,
  cameraOutline,
  shieldCheckmarkOutline,
  imageOutline,
  closeOutline
} from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile, updateEmail } from 'firebase/auth';
import { db, auth } from '../firebase';

const Profile: React.FC = () => {
  const { currentUser, isAdmin, uploadProfilePhoto } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phoneNumber: currentUser?.phoneNumber || ''
  });

  const showToast = (message: string, color: string = 'success') => {
    setToast({ show: true, message, color });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'danger');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'danger');
      return;
    }

    try {
      setUploadingPhoto(true);
      await uploadProfilePhoto(file);
      showToast('Profile photo updated successfully!');
      // Reload page to reflect changes
      window.location.reload();
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      showToast(error.message || 'Failed to upload photo', 'danger');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);

      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName
        });

        // Update email if changed
        if (formData.email !== currentUser.email) {
          await updateEmail(auth.currentUser, formData.email);
        }
      }

      // Update Firestore user document
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      });

      showToast('Profile updated successfully!');
      setEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showToast(error.message || 'Failed to update profile', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: currentUser?.displayName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || ''
    });
    setEditing(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>My Profile</IonTitle>
          <IonButtons slot="end">
            {!editing && (
              <IonButton onClick={() => setEditing(true)}>
                Edit
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ textAlign: 'center', padding: '30px 20px 20px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <IonAvatar style={{ width: '120px', height: '120px', margin: '0 auto' }}>
              {uploadingPhoto ? (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: '#f0f0f0'
                }}>
                  <IonSpinner name="crescent" />
                </div>
              ) : (
                <img 
                  src={currentUser?.photoURL || 'https://ionicframework.com/docs/img/demos/avatar.svg'} 
                  alt="Profile" 
                />
              )}
            </IonAvatar>
            {uploadingPhoto && (
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '50%'
              }}>
                <IonSpinner name="crescent" color="light" />
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoUpload}
          />
          
          <IonButton 
            fill="clear" 
            size="small" 
            style={{ marginTop: '10px' }}
            onClick={() => setShowActionSheet(true)}
          >
            <IonIcon icon={cameraOutline} slot="start" />
            Change Photo
          </IonButton>
          
          {isAdmin && (
            <div style={{ marginTop: '10px' }}>
              <IonButton size="small" color="warning">
                <IonIcon icon={shieldCheckmarkOutline} slot="start" />
                Admin Account
              </IonButton>
            </div>
          )}
        </div>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Personal Information</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonIcon icon={personOutline} slot="start" />
                <IonLabel position={editing ? "floating" : "stacked"}>Full Name</IonLabel>
                <IonInput
                  value={formData.displayName}
                  onIonInput={(e) => setFormData({ ...formData, displayName: e.detail.value! })}
                  readonly={!editing}
                />
              </IonItem>

              <IonItem>
                <IonIcon icon={mailOutline} slot="start" />
                <IonLabel position={editing ? "floating" : "stacked"}>Email</IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonInput={(e) => setFormData({ ...formData, email: e.detail.value! })}
                  readonly={!editing}
                />
              </IonItem>

              <IonItem>
                <IonIcon icon={callOutline} slot="start" />
                <IonLabel position={editing ? "floating" : "stacked"}>Phone Number</IonLabel>
                <IonInput
                  type="tel"
                  value={formData.phoneNumber}
                  onIonInput={(e) => setFormData({ ...formData, phoneNumber: e.detail.value! })}
                  readonly={!editing}
                />
              </IonItem>
            </IonList>

            {editing && (
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <IonButton expand="block" onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <IonSpinner name="crescent" />
                  ) : (
                    <>
                      <IonIcon icon={saveOutline} slot="start" />
                      Save Changes
                    </>
                  )}
                </IonButton>
                <IonButton expand="block" fill="outline" onClick={handleCancel} disabled={loading}>
                  Cancel
                </IonButton>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Account Statistics</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>
                  <h3>Member Since</h3>
                  <p>{new Date().toLocaleDateString()}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Total Orders</h3>
                  <p>View order history for details</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Account Type</h3>
                  <p>{isAdmin ? 'Administrator' : 'Customer'}</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: 'Choose from Gallery',
              icon: imageOutline,
              handler: () => {
                fileInputRef.current?.click();
              }
            },
            {
              text: 'Cancel',
              icon: closeOutline,
              role: 'cancel'
            }
          ]}
        />

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

export default Profile;