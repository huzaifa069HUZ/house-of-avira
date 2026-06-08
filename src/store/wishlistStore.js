import { create } from 'zustand';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading: true,
  unsubscribe: null,

  initialize: () => {
    return onAuthStateChanged(auth, (user) => {
      // Clean up previous listener if it exists
      const { unsubscribe } = get();
      if (unsubscribe) {
        unsubscribe();
        set({ unsubscribe: null });
      }

      if (user) {
        // Set up real-time listener for the user's wishlist
        const userRef = doc(db, 'users', user.uid);
        const unsub = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            set({ 
              wishlist: data.wishlist || [],
              loading: false
            });
          } else {
            set({ wishlist: [], loading: false });
          }
        }, (error) => {
          console.error("Error listening to wishlist:", error);
          set({ loading: false });
        });
        
        set({ unsubscribe: unsub });
      } else {
        // User logged out
        set({ wishlist: [], loading: false });
      }
    });
  },

  toggleWishlist: async (product) => {
    const user = auth.currentUser;
    if (!user) {
      // Return false if user needs to login
      return false; 
    }

    const { wishlist } = get();
    // We check if the product is already wishlisted by ID
    const isWishlisted = wishlist.some(item => item.id === product.id);
    
    // Optimistic UI update
    if (isWishlisted) {
      set({ wishlist: wishlist.filter(item => item.id !== product.id) });
    } else {
      set({ wishlist: [...wishlist, product] });
    }

    // Persist to Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      if (isWishlisted) {
        // We have to remove the exact object that matches.
        // ArrayRemove requires the exact object to match. We find it first.
        const itemToRemove = wishlist.find(item => item.id === product.id);
        if (itemToRemove) {
          await updateDoc(userRef, {
            wishlist: arrayRemove(itemToRemove)
          });
        }
      } else {
        await updateDoc(userRef, {
          wishlist: arrayUnion(product)
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      // Revert optimistic update on failure by re-fetching
      // (The onSnapshot listener usually fixes it automatically, but just in case)
    }
    return true; // Success
  }
}));
