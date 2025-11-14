// src/services/cookieService.ts
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Cookie } from '../types/Cookie';

export const fetchCookies = async (): Promise<Cookie[]> => {
  const cookiesRef = collection(db, 'Cookies');
  console.log('Fetching cookies from Firestore...');
  
  try {
    const snapshot = await getDocs(cookiesRef);
    console.log('Firestore Snapshot:', snapshot);
    
    if (snapshot.empty) {
      console.log('No cookies found!');
      return [];
    }

    const cookiesList: Cookie[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      description: doc.data().Description || doc.data().description || '',
      name: doc.data().Name || doc.data().name || '',
      price: doc.data().Price || doc.data().price || 0,
      imageUrl: doc.data().ImageUrl || doc.data().imageUrl,
      category: doc.data().Category || doc.data().category,
      stock: doc.data().Stock || doc.data().stock || 0
    }));

    console.log('Fetched cookies:', cookiesList);
    return cookiesList;
  } catch (error) {
    console.error('Error fetching cookies:', error);
    throw error;
  }
};

export const addCookie = async (cookie: Omit<Cookie, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'Cookies'), {
      Name: cookie.name,
      Description: cookie.description,
      Price: cookie.price,
      ImageUrl: cookie.imageUrl,
      Category: cookie.category,
      Stock: cookie.stock || 0
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding cookie:', error);
    throw error;
  }
};

export const updateCookie = async (id: string, cookie: Partial<Cookie>): Promise<void> => {
  try {
    const cookieRef = doc(db, 'Cookies', id);
    const updateData: any = {};
    
    if (cookie.name) updateData.Name = cookie.name;
    if (cookie.description) updateData.Description = cookie.description;
    if (cookie.price !== undefined) updateData.Price = cookie.price;
    if (cookie.imageUrl) updateData.ImageUrl = cookie.imageUrl;
    if (cookie.category) updateData.Category = cookie.category;
    if (cookie.stock !== undefined) updateData.Stock = cookie.stock;
    
    await updateDoc(cookieRef, updateData);
  } catch (error) {
    console.error('Error updating cookie:', error);
    throw error;
  }
};

export const deleteCookie = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'Cookies', id));
  } catch (error) {
    console.error('Error deleting cookie:', error);
    throw error;
  }
};