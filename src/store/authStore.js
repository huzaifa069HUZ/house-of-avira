import { create } from 'zustand';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null, // 'customer', 'admin_owner', 'admin_team'
  loading: true,
  
  initialize: () => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user document from Firestore to get role and details
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            set({ 
              user: { uid: firebaseUser.uid, email: firebaseUser.email, ...userData }, 
              role: userData.role || 'customer',
              loading: false 
            });
          } else {
            // Document doesn't exist yet (e.g. during registration flow)
            // It will be created by the registration function, but we set basic info for now.
            // Also handle the special admin email case just in case the document is missing
            let role = 'customer';
            const allowedAdminEmails = ['orders.houseofavira@gmail.com', 'order.houseofavira@gmail.com', 'huzaifatabish9145@gmail.com', 'huaifatabish9145@gmail.com'];
            if (allowedAdminEmails.includes(firebaseUser.email.toLowerCase())) {
              role = 'admin_owner';
            }
            
            set({ 
              user: { 
                uid: firebaseUser.uid, 
                email: firebaseUser.email,
                name: firebaseUser.displayName || '',
              }, 
              role,
              loading: false 
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          set({ user: firebaseUser, role: 'customer', loading: false });
        }
      } else {
        set({ user: null, role: null, loading: false });
      }
    });
  },
  
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, role: null });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },

  updateUser: async (updates) => {
    try {
      const { user } = get();
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updates);

      if (updates.name && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: updates.name });
      }

      set({ user: { ...user, ...updates } });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}));
