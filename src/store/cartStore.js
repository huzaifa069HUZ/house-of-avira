import { create } from 'zustand';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, collection, getDocs, query, where } from 'firebase/firestore';

export const useCartStore = create((set, get) => ({
  cart: [],
  isOpen: false,
  loading: true,
  unsubscribe: null,
  appliedCoupon: null,
  discountAmount: 0,

  // UI Actions
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  initialize: () => {
    return onAuthStateChanged(auth, (user) => {
      // Clean up previous listener if it exists
      const { unsubscribe } = get();
      if (unsubscribe) {
        unsubscribe();
        set({ unsubscribe: null });
      }

      if (user) {
        // Set up real-time listener for the user's cart
        const userRef = doc(db, 'users', user.uid);
        const unsub = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            set({ 
              cart: data.cart || [],
              loading: false
            });
            get().recalculateCoupon();
          } else {
            set({ cart: [], loading: false });
            get().recalculateCoupon();
          }
        }, (error) => {
          console.error("Error listening to cart:", error);
          set({ loading: false });
        });
        
        set({ unsubscribe: unsub });
      } else {
        // User logged out
        set({ cart: [], loading: false });
      }
    });
  },

  addToCart: async (product) => {
    const user = auth.currentUser;
    if (!user) {
      return false; 
    }

    const { cart } = get();
    const cartItemId = `${product.id}-${product.size || ''}-${product.color || ''}`;
    const existingItemIndex = cart.findIndex(item => (item.cartItemId || item.id) === cartItemId);
    
    let newCart = [...cart];
    
    if (existingItemIndex >= 0) {
      // Update quantity
      newCart[existingItemIndex] = {
        ...newCart[existingItemIndex],
        quantity: newCart[existingItemIndex].quantity + 1
      };
    } else {
      // Add new item
      newCart.push({
        cartItemId,
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image || product.images?.[0] || null,
        size: product.size || null,
        color: product.color || null,
        quantity: 1,
        availableSizes: product.availableSizes || []
      });
    }

    // Optimistic UI update
    set({ cart: newCart, isOpen: true }); // Open cart when item is added
    get().recalculateCoupon();

    // Persist to Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { 
        cart: newCart,
        email: user.email || '',
        name: user.displayName || 'Unknown User'
      }, { merge: true });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
    return true; // Success
  },

  updateQuantity: async (cartItemId, delta) => {
    const user = auth.currentUser;
    if (!user) return false;

    const { cart } = get();
    const existingItemIndex = cart.findIndex(item => (item.cartItemId || item.id) === cartItemId);
    
    if (existingItemIndex < 0) return false;

    let newCart = [...cart];
    const newQuantity = newCart[existingItemIndex].quantity + delta;

    if (newQuantity <= 0) {
      newCart.splice(existingItemIndex, 1);
    } else {
      newCart[existingItemIndex] = {
        ...newCart[existingItemIndex],
        quantity: newQuantity
      };
    }

    set({ cart: newCart });
    get().recalculateCoupon();

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { cart: newCart }, { merge: true });
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
    return true;
  },

  updateItemSize: async (oldCartItemId, newSize) => {
    const user = auth.currentUser;
    if (!user) return false;

    const { cart } = get();
    const existingItemIndex = cart.findIndex(item => (item.cartItemId || item.id) === oldCartItemId);
    
    if (existingItemIndex < 0) return false;

    let newCart = [...cart];
    const item = newCart[existingItemIndex];
    const newCartItemId = `${item.id}-${newSize}-${item.color || ''}`;

    // Check if new size already exists
    const duplicateIndex = newCart.findIndex(i => (i.cartItemId || i.id) === newCartItemId && i !== item);

    if (duplicateIndex >= 0) {
      // Merge quantities and remove old item
      newCart[duplicateIndex].quantity += item.quantity;
      newCart.splice(existingItemIndex, 1);
    } else {
      // Update size and cartItemId
      newCart[existingItemIndex] = {
        ...item,
        size: newSize,
        cartItemId: newCartItemId
      };
    }

    set({ cart: newCart });
    get().recalculateCoupon();

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { cart: newCart }, { merge: true });
    } catch (error) {
      console.error("Error updating cart size:", error);
    }
    return true;
  },

  removeFromCart: async (cartItemId) => {
    const user = auth.currentUser;
    if (!user) return false;

    const { cart } = get();
    const newCart = cart.filter(item => (item.cartItemId || item.id) !== cartItemId);

    set({ cart: newCart });
    get().recalculateCoupon();

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { cart: newCart }, { merge: true });
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
    return true;
  },

  clearCart: async () => {
    const user = auth.currentUser;
    if (!user) return false;

    set({ cart: [] });
    get().recalculateCoupon();

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { cart: [] }, { merge: true });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
    return true;
  },

  recalculateCoupon: () => {
    const { cart, appliedCoupon } = get();
    if (!appliedCoupon) return;

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    if (appliedCoupon.minOrderValue && subtotal < appliedCoupon.minOrderValue) {
      set({ appliedCoupon: null, discountAmount: 0 });
      return;
    }

    let discount = 0;
    if (appliedCoupon.discountType === 'percentage') {
      discount = subtotal * (appliedCoupon.discountValue / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }

    set({ discountAmount: discount });
  },

  applyCoupon: async (code) => {
    try {
      const q = query(collection(db, 'coupons'), where('code', '==', code.toUpperCase()), where('isActive', '==', true));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return { success: false, message: 'Invalid or inactive coupon code.' };
      }

      const coupon = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      const { cart } = get();
      const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
        return { success: false, message: `Minimum order value of ₹${coupon.minOrderValue} required.` };
      }

      let discount = 0;
      if (coupon.discountType === 'percentage') {
        discount = subtotal * (coupon.discountValue / 100);
      } else {
        discount = coupon.discountValue;
      }

      set({ appliedCoupon: coupon, discountAmount: discount });
      return { success: true, message: 'Coupon applied successfully!' };
    } catch (error) {
      console.error("Error applying coupon:", error);
      return { success: false, message: 'An error occurred while applying the coupon.' };
    }
  },

  removeCoupon: () => set({ appliedCoupon: null, discountAmount: 0 })
}));
