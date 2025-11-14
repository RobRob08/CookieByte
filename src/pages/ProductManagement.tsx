// src/pages/ProductManagement.tsx
import React, { useState, useEffect, useRef } from 'react';
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
  IonButton,
  IonIcon,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonList,
  IonToast,
  IonSpinner,
  IonFab,
  IonFabButton,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonBadge,
  IonAlert
} from '@ionic/react';
import { 
  addOutline, 
  trashOutline, 
  createOutline, 
  imageOutline,
  searchOutline,
  cameraOutline,
  closeCircleOutline
} from 'ionicons/icons';
import { fetchCookies, addCookie, updateCookie, deleteCookie } from '../services/cookieService';
import { uploadProductImage } from '../services/imageUploadService';
import { Cookie } from '../types/Cookie';

const ProductManagement: React.FC = () => {
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [filteredCookies, setFilteredCookies] = useState<Cookie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCookie, setEditingCookie] = useState<Cookie | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [deleteAlert, setDeleteAlert] = useState<{ show: boolean; cookie: Cookie | null }>({
    show: false,
    cookie: null
  });
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    stock: 0
  });

  useEffect(() => {
    loadCookies();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [cookies, searchText, filterStatus]);

  const loadCookies = async () => {
    try {
      setLoading(true);
      const data = await fetchCookies();
      setCookies(data);
    } catch (error) {
      showToastMessage('Failed to load products', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = cookies;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(cookie =>
        cookie.name.toLowerCase().includes(searchText.toLowerCase()) ||
        cookie.description.toLowerCase().includes(searchText.toLowerCase()) ||
        cookie.category?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply stock filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(cookie => {
        const stock = cookie.stock || 0;
        if (filterStatus === 'in-stock') return stock > 10;
        if (filterStatus === 'low-stock') return stock > 0 && stock <= 10;
        if (filterStatus === 'out-of-stock') return stock === 0;
        return true;
      });
    }

    setFilteredCookies(filtered);
  };

  const showToastMessage = (message: string, color: string = 'success') => {
    setToast({ show: true, message, color });
  };

  const handleAddCookie = () => {
    setEditingCookie(null);
    setSelectedImage(null);
    setImagePreview('');
    setFormData({
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
      stock: 0
    });
    setShowModal(true);
  };

  const handleEditCookie = (cookie: Cookie) => {
    setEditingCookie(cookie);
    setSelectedImage(null);
    setImagePreview(cookie.imageUrl || '');
    setFormData({
      name: cookie.name,
      description: cookie.description,
      price: cookie.price,
      imageUrl: cookie.imageUrl || '',
      category: cookie.category || '',
      stock: cookie.stock || 0
    });
    setShowModal(true);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToastMessage('Please select an image file', 'warning');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToastMessage('Image size must be less than 5MB', 'warning');
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setFormData({ ...formData, imageUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveCookie = async () => {
    if (!formData.name || !formData.description || formData.price <= 0) {
      showToastMessage('Please fill in all required fields', 'warning');
      return;
    }

    try {
      setUploadingImage(true);
      
      let imageUrl = formData.imageUrl;

      // Upload new image if selected
      if (selectedImage) {
        imageUrl = await uploadProductImage(selectedImage, formData.name);
      }

      const cookieData = { ...formData, imageUrl };

      if (editingCookie) {
        await updateCookie(editingCookie.id, cookieData);
        showToastMessage('Product updated successfully!');
      } else {
        await addCookie(cookieData);
        showToastMessage('Product added successfully!');
      }
      
      setShowModal(false);
      setSelectedImage(null);
      setImagePreview('');
      loadCookies();
    } catch (error) {
      showToastMessage('Failed to save product', 'danger');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteCookie = async () => {
    if (!deleteAlert.cookie) return;

    try {
      await deleteCookie(deleteAlert.cookie.id);
      showToastMessage('Product deleted successfully!');
      setDeleteAlert({ show: false, cookie: null });
      loadCookies();
    } catch (error) {
      showToastMessage('Failed to delete product', 'danger');
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <IonBadge color="danger">Out of Stock</IonBadge>;
    if (stock <= 10) return <IonBadge color="warning">Low Stock: {stock}</IonBadge>;
    return <IonBadge color="success">In Stock: {stock}</IonBadge>;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="warning">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Product Management</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Search products..."
          />
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={filterStatus} onIonChange={(e) => setFilterStatus(e.detail.value as any)}>
            <IonSegmentButton value="all">
              <IonLabel>All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="in-stock">
              <IonLabel>In Stock</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="low-stock">
              <IonLabel>Low Stock</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="out-of-stock">
              <IonLabel>Out</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <IonSpinner name="crescent" />
            <p>Loading products...</p>
          </div>
        ) : (
          <IonGrid>
            <IonRow>
              {filteredCookies.length === 0 ? (
                <IonCol size="12">
                  <div style={{ textAlign: 'center', padding: '50px' }}>
                    <IonIcon icon={searchOutline} style={{ fontSize: '80px', color: '#ccc' }} />
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filters</p>
                  </div>
                </IonCol>
              ) : (
                filteredCookies.map((cookie) => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={cookie.id}>
                    <IonCard>
                      {cookie.imageUrl ? (
                        <img 
                            src={`/products/${cookie.imageUrl}`} 
                            alt={cookie.name}
                            style={{
                              display: 'block',        // Make the image a block-level element
                              width: '100%',           // Make it fill the container's width
                              height: '100%',         // Keep your fixed height
                              objectFit: 'cover',
                              paddingLeft: '100px',
                              paddingRight: '100px'       // This will center the image content within the box
                            }}
                          />
                      ) : (
                        <div style={{ 
                          height: '150px', 
                          background: '#f0f0f0', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <IonIcon icon={imageOutline} style={{ fontSize: '50px', color: '#ccc' }} />
                        </div>
                      )}
                      <IonCardHeader>
                        <IonCardTitle>{cookie.name}</IonCardTitle>
                        {getStockBadge(cookie.stock || 0)}
                      </IonCardHeader>
                      <IonCardContent>
                        <p style={{ minHeight: '40px' }}>{cookie.description}</p>
                        <div style={{ marginTop: '10px' }}>
                          <p><strong>Price:</strong> ₱{cookie.price.toFixed(2)}</p>
                          <p><strong>Category:</strong> {cookie.category || 'N/A'}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <IonButton 
                            expand="block" 
                            onClick={() => handleEditCookie(cookie)} 
                            size="small"
                          >
                            <IonIcon icon={createOutline} slot="start" />
                            Edit
                          </IonButton>
                          <IonButton 
                            expand="block"
                            color="danger" 
                            onClick={() => setDeleteAlert({ show: true, cookie })}
                            size="small"
                          >
                            <IonIcon icon={trashOutline} slot="start" />
                            Delete
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))
              )}
            </IonRow>
          </IonGrid>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleAddCookie} color="warning">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Add/Edit Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar color="warning">
              <IonTitle>{editingCookie ? 'Edit Product' : 'Add Product'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonItem>
                <IonLabel position="floating">Product Name *</IonLabel>
                <IonInput
                  value={formData.name}
                  onIonInput={(e) => setFormData({ ...formData, name: e.detail.value! })}
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Description *</IonLabel>
                <IonTextarea
                  value={formData.description}
                  onIonInput={(e) => setFormData({ ...formData, description: e.detail.value! })}
                  rows={3}
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Price (₱) *</IonLabel>
                <IonInput
                  type="number"
                  value={formData.price}
                  onIonInput={(e) => setFormData({ ...formData, price: parseFloat(e.detail.value!) || 0 })}
                  required
                />
              </IonItem>

              {/* Image Upload Section */}
              <IonItem lines="none">
                <IonLabel>
                  <h3>Product Image</h3>
                  <p>Upload a photo (max 5MB)</p>
                </IonLabel>
              </IonItem>
              
              <div style={{ padding: '0 16px' }}>
                {imagePreview ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        width: '200px', 
                        height: '200px', 
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <IonButton
                      fill="clear"
                      onClick={removeImage}
                      style={{ 
                        position: 'absolute', 
                        top: '-10px', 
                        right: '-10px',
                        '--background': 'rgba(255,255,255,0.9)'
                      }}
                    >
                      <IonIcon icon={closeCircleOutline} color="danger" />
                    </IonButton>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%',
                      height: '200px',
                      border: '2px dashed #ccc',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      marginBottom: '20px'
                    }}
                  >
                    <IonIcon icon={cameraOutline} style={{ fontSize: '48px', color: '#ccc' }} />
                    <p style={{ color: '#666', marginTop: '10px' }}>Click to upload image</p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageSelect}
                />
                
                {!imagePreview && (
                  <IonButton 
                    expand="block" 
                    fill="outline"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ marginBottom: '20px' }}
                  >
                    <IonIcon icon={imageOutline} slot="start" />
                    Choose Image
                  </IonButton>
                )}
              </div>

              <IonItem>
                <IonLabel position="floating">Image URL (Alternative)</IonLabel>
                <IonInput
                  value={formData.imageUrl}
                  onIonInput={(e) => setFormData({ ...formData, imageUrl: e.detail.value! })}
                  placeholder="https://example.com/image.jpg"
                  disabled={!!selectedImage}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Category</IonLabel>
                <IonInput
                  value={formData.category}
                  onIonInput={(e) => setFormData({ ...formData, category: e.detail.value! })}
                  placeholder="e.g., Chocolate, Vanilla"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Stock Quantity</IonLabel>
                <IonInput
                  type="number"
                  value={formData.stock}
                  onIonInput={(e) => setFormData({ ...formData, stock: parseInt(e.detail.value!) || 0 })}
                />
              </IonItem>
            </IonList>

            <IonButton 
              expand="block" 
              onClick={handleSaveCookie} 
              style={{ marginTop: '20px' }}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <IonSpinner name="crescent" />
              ) : (
                <>
                  <IonIcon icon={editingCookie ? createOutline : addOutline} slot="start" />
                  {editingCookie ? 'Update Product' : 'Add Product'}
                </>
              )}
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Delete Confirmation Alert */}
        <IonAlert
          isOpen={deleteAlert.show}
          onDidDismiss={() => setDeleteAlert({ show: false, cookie: null })}
          header="Delete Product"
          message={`Are you sure you want to delete "${deleteAlert.cookie?.name}"? This action cannot be undone.`}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: handleDeleteCookie
            }
          ]}
        />

        <IonToast
          isOpen={toast.show}
          onDidDismiss={() => setToast({ ...toast, show: false })}
          message={toast.message}
          duration={2000}
          color={toast.color}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProductManagement;