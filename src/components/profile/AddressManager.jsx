'use client';

import { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/authStore';
import { MapPin, Edit2, Check, X, Loader2, ChevronDown, Plus, Trash2, Star } from 'lucide-react';

export default function AddressManager() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false); // false, 'new', or address.id
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const [formData, setFormData] = useState({
    id: '',
    street: '',
    city: '',
    stateCode: '',
    countryCode: '',
    zip: '',
    isDefault: false,
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
    if (user?.uid) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        let fetchedAddresses = data.addresses || [];
        
        // Migrate legacy single address if it exists and no addresses array exists
        if (data.address && fetchedAddresses.length === 0) {
          const migratedAddress = {
            ...data.address,
            id: Date.now().toString(),
            isDefault: true,
          };
          fetchedAddresses = [migratedAddress];
          // Update db with migrated address
          await setDoc(docRef, { addresses: fetchedAddresses }, { merge: true });
        }

        setAddresses(fetchedAddresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    if (formData.countryCode) {
      setStates(State.getStatesOfCountry(formData.countryCode));
    } else {
      setStates([]);
      setCities([]);
    }
  }, [formData.countryCode]);

  useEffect(() => {
    if (formData.countryCode && formData.stateCode) {
      setCities(City.getCitiesOfState(formData.countryCode, formData.stateCode));
    } else {
      setCities([]);
    }
  }, [formData.stateCode, formData.countryCode]);

  const handleEdit = (address) => {
    setFormData({
      id: address.id,
      street: address.street || '',
      city: address.city || '',
      stateCode: address.stateCode || '',
      countryCode: address.countryCode || '',
      zip: address.zip || '',
      isDefault: address.isDefault || false,
    });
    setIsEditing(address.id);
  };

  const handleAddNew = () => {
    setFormData({
      id: Date.now().toString(),
      street: '',
      city: '',
      stateCode: '',
      countryCode: '',
      zip: '',
      isDefault: addresses.length === 0, // Auto default if first
    });
    setIsEditing('new');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      
      const updatedAddress = {
        id: formData.id,
        street: formData.street,
        city: formData.city,
        stateCode: formData.stateCode,
        countryCode: formData.countryCode,
        zip: formData.zip,
        countryName: Country.getCountryByCode(formData.countryCode)?.name || '',
        stateName: State.getStateByCodeAndCountry(formData.stateCode, formData.countryCode)?.name || formData.stateCode,
        isDefault: formData.isDefault,
      };

      let newAddresses = [...addresses];

      if (isEditing === 'new') {
        newAddresses.push(updatedAddress);
      } else {
        newAddresses = newAddresses.map(addr => addr.id === formData.id ? updatedAddress : addr);
      }

      // If this address is set as default, unset others
      if (updatedAddress.isDefault) {
        newAddresses = newAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === updatedAddress.id
        }));
      } else if (newAddresses.length === 1) {
        // Enforce default if it's the only one
        newAddresses[0].isDefault = true;
      }

      await setDoc(docRef, { addresses: newAddresses }, { merge: true });
      setAddresses(newAddresses);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating addresses:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    setLoading(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      let newAddresses = addresses.filter(addr => addr.id !== id);
      
      // If we deleted the default, make the first remaining one default
      if (addresses.find(a => a.id === id)?.isDefault && newAddresses.length > 0) {
        newAddresses[0].isDefault = true;
      }

      await setDoc(docRef, { addresses: newAddresses }, { merge: true });
      setAddresses(newAddresses);
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      const newAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));

      await setDoc(docRef, { addresses: newAddresses }, { merge: true });
      setAddresses(newAddresses);
    } catch (error) {
      console.error('Error setting default address:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-black/5">
          <h2 className="text-3xl lg:text-4xl font-perandory tracking-tight text-[#000000] flex items-center gap-3">
            <MapPin className="w-6 h-6 md:w-8 md:h-8" /> Saved Addresses <span className="text-base text-black/40 font-sans tracking-widest mt-2">({addresses.length}/3)</span>
          </h2>
          {addresses.length < 3 && (
            <button 
              onClick={handleAddNew}
              className="text-[10px] uppercase font-bold tracking-widest text-[#000000]/60 hover:text-[#000000] flex items-center gap-1.5 transition-colors border border-black/10 px-3 py-1.5 hover:bg-black/5"
            >
              <Plus className="w-3 h-3" /> Add New
            </button>
          )}
        </div>

        {addresses.length === 0 ? (
          <div className="bg-[#FAFAFA] border border-black/5 p-12 text-center flex flex-col items-center justify-center">
            <p className="text-lg font-gambetta italic text-[#000000]/60 mb-6">No saved addresses</p>
            <button onClick={handleAddNew} className="text-[11px] font-dm-sans uppercase tracking-widest font-bold border-b-2 border-black pb-1 hover:text-black/60 hover:border-black/60 transition-colors">
              Add your first address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className={`bg-white border p-6 relative ${addr.isDefault ? 'border-black' : 'border-black/10'}`}>
                {addr.isDefault && (
                  <div className="absolute top-0 right-0 bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1">
                    Default
                  </div>
                )}
                
                <div className="text-sm font-dm-sans text-[#000000] space-y-1 mb-6 mt-2">
                  <p className="font-bold">{addr.street}</p>
                  <p className="opacity-80">{addr.city}, {addr.stateName} {addr.zip}</p>
                  <p className="opacity-80">{addr.countryName}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-black/5">
                  <button 
                    onClick={() => handleEdit(addr)}
                    className="text-[10px] uppercase font-bold tracking-widest text-[#000000]/50 hover:text-[#000000] flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    className="text-[10px] uppercase font-bold tracking-widest text-red-500/70 hover:text-red-500 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                  
                  {!addr.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(addr.id)}
                      className="ml-auto text-[10px] uppercase font-bold tracking-widest text-blue-500/70 hover:text-blue-500 flex items-center gap-1 transition-colors"
                    >
                      <Star className="w-3 h-3" /> Set Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/10 p-8">
      <div className="flex justify-between items-start mb-8 pb-4 border-b border-black/5">
        <h2 className="text-3xl lg:text-4xl font-perandory tracking-tight text-[#000000] flex items-center gap-3">
          <MapPin className="w-6 h-6 md:w-8 md:h-8" /> 
          {isEditing === 'new' ? 'Add New Address' : 'Edit Address'}
        </h2>
        <button 
          onClick={() => setIsEditing(false)}
          className="text-[#000000]/60 hover:text-[#000000] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-[9px] font-sans font-bold tracking-[0.25em] uppercase text-[#000000]/40 mb-1.5">Street Address</label>
          <input 
            type="text" 
            required
            value={formData.street}
            onChange={(e) => setFormData({...formData, street: e.target.value})}
            className="w-full border-b border-black/20 pb-2 outline-none focus:border-black text-sm transition-colors bg-transparent"
            placeholder="123 Main St, Apt 4B"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[9px] font-sans font-bold tracking-[0.25em] uppercase text-[#000000]/40 mb-1.5">Country</label>
            <div className="relative">
              <select 
                required
                value={formData.countryCode}
                onChange={(e) => setFormData({...formData, countryCode: e.target.value, stateCode: '', city: ''})}
                className="w-full border-b border-black/20 pb-2 appearance-none outline-none focus:border-black text-sm transition-colors bg-transparent"
              >
                <option value="">Select Country</option>
                {countries.map(c => (
                  <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#000000]/40 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-sans font-bold tracking-[0.25em] uppercase text-[#000000]/40 mb-1.5">State / Province</label>
            <div className="relative">
              <select 
                required
                disabled={!formData.countryCode || states.length === 0}
                value={formData.stateCode}
                onChange={(e) => setFormData({...formData, stateCode: e.target.value, city: ''})}
                className="w-full border-b border-black/20 pb-2 appearance-none outline-none focus:border-black text-sm transition-colors bg-transparent disabled:opacity-50"
              >
                <option value="">{states.length === 0 && formData.countryCode ? 'No States Available' : 'Select State'}</option>
                {states.map(s => (
                  <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#000000]/40 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[9px] font-sans font-bold tracking-[0.25em] uppercase text-[#000000]/40 mb-1.5">City</label>
            {cities.length > 0 ? (
              <div className="relative">
                <select 
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full border-b border-black/20 pb-2 appearance-none outline-none focus:border-black text-sm transition-colors bg-transparent"
                >
                  <option value="">Select City</option>
                  {cities.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#000000]/40 pointer-events-none" />
              </div>
            ) : (
              <input 
                type="text" 
                required
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full border-b border-black/20 pb-2 outline-none focus:border-black text-sm transition-colors bg-transparent"
                placeholder="City Name"
              />
            )}
          </div>

          <div>
            <label className="block text-[9px] font-sans font-bold tracking-[0.25em] uppercase text-[#000000]/40 mb-1.5">Postal / Zip Code</label>
            <input 
              type="text" 
              required
              value={formData.zip}
              onChange={(e) => setFormData({...formData, zip: e.target.value})}
              className="w-full border-b border-black/20 pb-2 outline-none focus:border-black text-sm transition-colors bg-transparent"
              placeholder="10001"
            />
          </div>
        </div>

        {addresses.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="isDefault" 
              checked={formData.isDefault}
              onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
              className="w-4 h-4 accent-black"
            />
            <label htmlFor="isDefault" className="text-sm font-dm-sans font-medium">Set as default address</label>
          </div>
        )}

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#000000] text-white text-[10px] font-bold tracking-[0.2em] uppercase py-3.5 flex items-center justify-center gap-2 hover:bg-black/80 transition-colors disabled:opacity-70 mt-6"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </form>
    </div>
  );
}
