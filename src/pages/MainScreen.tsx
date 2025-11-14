// src/pages/MainScreen.tsx
import React, { useEffect, useState } from 'react';
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
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonToast,
  IonSearchbar,
  IonChip,
  IonLabel,
  IonModal,
  IonAlert,
  IonText,
  IonItem
} from '@ionic/react';
import { 
  cartOutline, 
  addOutline, 
  closeOutline, 
  removeOutline,
  eyeOutline,
  bagOutline
} from 'ionicons/icons';
import { fetchCookies } from '../services/cookieService';
import { Cookie } from '../types/Cookie';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

const MainScreen: React.FC = () => {
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [filteredCookies, setFilteredCookies] = useState<Cookie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [categories, setCategories] = useState<string[]>(['All']);
  
  // Modal and Auth states
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Cookie | null>(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, getTotalItems } = useCart();
  const { currentUser } = useAuth();
  const history = useHistory();

  useEffect(() => {
    loadCookies();
  }, []);

  useEffect(() => {
    filterCookies();
  }, [cookies, searchText, selectedCategory]);

  const loadCookies = async () => {
    try {
      setLoading(true);
      const data = await fetchCookies();
      setCookies(data);
      extractCategories(data);
    } catch (error) {
      console.error('Error loading cookies:', error);
      setToastMessage('Failed to load products');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const extractCategories = (cookiesData: Cookie[]) => {
    const uniqueCategories = new Set<string>();
    cookiesData.forEach(cookie => {
      if (cookie.category) {
        uniqueCategories.add(cookie.category);
      }
    });
    
    const sortedCategories = Array.from(uniqueCategories).sort();
    setCategories(['All', ...sortedCategories]);
  };

  const filterCookies = () => {
    let filtered = cookies;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(cookie => 
        cookie.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchText) {
      filtered = filtered.filter(cookie =>
        cookie.name.toLowerCase().includes(searchText.toLowerCase()) ||
        cookie.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredCookies(filtered);
  };

  const handleViewProduct = (cookie: Cookie) => {
    setSelectedProduct(cookie);
    setQuantity(1);
    setShowProductModal(true);
  };

  const handleAddToCart = (cookie: Cookie, qty: number = 1) => {
    // Check if user is logged in
    if (!currentUser) {
      setShowLoginAlert(true);
      return;
    }

    // Check stock availability
    if (cookie.stock !== undefined && cookie.stock < qty) {
      setToastMessage('Not enough stock available');
      setShowToast(true);
      return;
    }

    addToCart(cookie, qty);
    setToastMessage(`${qty} × ${cookie.name} added to cart!`);
    setShowToast(true);
    setShowProductModal(false);
  };

  const handleQuickAddToCart = (cookie: Cookie) => {
    if (!currentUser) {
      setShowLoginAlert(true);
      return;
    }
    handleAddToCart(cookie, 1);
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadCookies();
    event.detail.complete();
  };

  const increaseQuantity = () => {
    if (selectedProduct && selectedProduct.stock) {
      if (quantity < selectedProduct.stock) {
        setQuantity(quantity + 1);
      }
    } else {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Cookie Shop</IonTitle>
          <IonButtons slot="end">
            {currentUser && (
              <IonButton onClick={() => history.push('/cart')}>
                <IonIcon icon={cartOutline} />
                {getTotalItems() > 0 && (
                  <IonBadge color="danger" style={{ position: 'absolute', top: 5, right: 5 }}>
                    {getTotalItems()}
                  </IonBadge>
                )}
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Search cookies..."
          />
        </IonToolbar>
        <IonToolbar>
          <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '8px' }}>
            {categories.map(category => (
              <IonChip
                key={category}
                color={selectedCategory === category ? 'primary' : 'medium'}
                onClick={() => setSelectedCategory(category)}
              >
                <IonLabel>{category}</IonLabel>
              </IonChip>
            ))}
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {!currentUser && (
          <IonCard color="warning" style={{ margin: '16px' }}>
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IonIcon icon={bagOutline} style={{ fontSize: '24px' }} />
                <div>
                  <strong>Sign in to shop!</strong>
                  <p style={{ margin: '5px 0 0' }}>Login or create an account to add items to cart</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <IonSpinner name="crescent" />
            <p>Loading delicious cookies...</p>
          </div>
        ) : (
          <IonGrid>
            <IonRow>
              {filteredCookies.length === 0 ? (
                <IonCol size="12">
                  <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h3>No cookies found</h3>
                    <p>Try adjusting your search or filters</p>
                  </div>
                </IonCol>
              ) : (
                filteredCookies.map((cookie) => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={cookie.id}>
                    <IonCard button onClick={() => handleViewProduct(cookie)}>
                      {cookie.imageUrl && (
                        <img 
                          src={cookie.imageUrl.startsWith('http') ? cookie.imageUrl : `/products/${cookie.imageUrl}`}
                          alt={cookie.name}
                          style={{
                            display: 'block',
                            objectPosition: '0px 10px',
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <IonCardHeader>
                        <IonCardTitle>{cookie.name}</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <p style={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {cookie.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                          <div>
                            <h2 style={{ margin: 0, color: '#8B4513' }}>
                              ₱{cookie.price.toFixed(2)}
                            </h2>
                            {cookie.stock !== undefined && (
                              <small style={{ color: cookie.stock > 0 ? 'green' : 'red' }}>
                                {cookie.stock > 0 ? `${cookie.stock} in stock` : 'Out of stock'}
                              </small>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <IonButton 
                              size="small"
                              fill="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProduct(cookie);
                              }}
                            >
                              <IonIcon icon={eyeOutline} />
                            </IonButton>
                            <IonButton 
                           onClick={(e) => {
                                e.stopPropagation();
                                handleQuickAddToCart(cookie);
                              }}
                            disabled={cookie.stock === 0}
                          >
                            <IonIcon icon={addOutline} slot="start" />
                            Add to Cart
                          </IonButton>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))
              )}
            </IonRow>
          </IonGrid>
        )}

        {/* Product Detail Modal */}
        <IonModal isOpen={showProductModal} onDidDismiss={() => setShowProductModal(false)}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Product Details</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowProductModal(false)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {selectedProduct && (
              <div>
                {selectedProduct.imageUrl && (
                  <img 
                    src={selectedProduct.imageUrl.startsWith('http') ? selectedProduct.imageUrl : `/products/${selectedProduct.imageUrl}`}
                    alt={selectedProduct.name}
                     style={{
                      display: 'block',        // Make the image a block-level element
                      width: '100%',           // Make it fill the container's width
                      height: '100%',         // Keep your fixed height
                      objectFit: 'cover',
                      paddingLeft: '100px',
                      paddingRight: '100px'       // This will center the image content within the box
                    }}
                  />
                )}
                
                <div style={{ padding: '20px' }}>
                  <h1 style={{ margin: '0 0 10px', color: '#8B4513' }}>
                    {selectedProduct.name}
                  </h1>
                  
                  {selectedProduct.category && (
                    <IonBadge color="primary" style={{ marginBottom: '15px' }}>
                      {selectedProduct.category}
                    </IonBadge>
                  )}

                  <h2 style={{ margin: '15px 0', fontSize: '28px', color: '#8B4513' }}>
                    ₱{selectedProduct.price.toFixed(2)}
                  </h2>

                  {selectedProduct.stock !== undefined && (
                    <IonItem lines="none" style={{ '--padding-start': '0' }}>
                      <IonLabel>
                        <h3>Availability</h3>
                        <p style={{ color: selectedProduct.stock > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                          {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of stock'}
                        </p>
                      </IonLabel>
                    </IonItem>
                  )}

                  <div style={{ margin: '20px 0' }}>
                    <h3>Description</h3>
                    <p style={{ lineHeight: '1.6', color: '#666' }}>
                      {selectedProduct.description}
                    </p>
                  </div>

                  {currentUser && selectedProduct.stock !== 0 && (
                    <div style={{ marginTop: '30px' }}>
                      <h3>Quantity</h3>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '15px', 
                        marginTop: '10px',
                        marginBottom: '20px'
                      }}>
                        <IonButton 
                          fill="outline" 
                          onClick={decreaseQuantity}
                          disabled={quantity <= 1}
                        >
                          <IonIcon icon={removeOutline} />
                        </IonButton>
                        <IonText style={{ 
                          fontSize: '24px', 
                          fontWeight: 'bold',
                          minWidth: '50px',
                          textAlign: 'center'
                        }}>
                          {quantity}
                        </IonText>
                        <IonButton 
                          fill="outline" 
                          onClick={increaseQuantity}
                          disabled={selectedProduct.stock !== undefined && quantity >= selectedProduct.stock}
                        >
                          <IonIcon icon={addOutline} />
                        </IonButton>
                      </div>

                      <IonButton 
                        expand="block" 
                        size="large"
                        onClick={() => handleAddToCart(selectedProduct, quantity)}
                      >
                        <IonIcon icon={cartOutline} slot="start" />
                        Add {quantity} to Cart - ₱{(selectedProduct.price * quantity).toFixed(2)}
                      </IonButton>
                    </div>
                  )}

                  {!currentUser && (
                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                      <IonText color="medium">
                        <p>Please login to add items to cart</p>
                      </IonText>
                      <IonButton 
                        expand="block" 
                        onClick={() => {
                          setShowProductModal(false);
                          history.push('/login');
                        }}
                      >
                        Login to Continue
                      </IonButton>
                    </div>
                  )}
                </div>
              </div>
            )}
          </IonContent>
        </IonModal>

        {/* Login Alert */}
        <IonAlert
          isOpen={showLoginAlert}
          onDidDismiss={() => setShowLoginAlert(false)}
          header="Login Required"
          message="You need to be logged in to add items to cart. Would you like to login now?"
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Login',
              handler: () => {
                history.push('/login');
              }
            },
            {
              text: 'Sign Up',
              handler: () => {
                history.push('/signup');
              }
            }
          ]}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default MainScreen;