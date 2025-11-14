// src/types/User.ts
export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  isAdmin?: boolean;
}