'use client';

import { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/authStore';
import { MapPin, Edit2, Check, X, Loader2, ChevronDown } from 'lucide-react';

export default function AddressManager() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    stateCode: '',
    countryCode: '',
    zip: '',
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
    if (user?.uid) {
      fetchAddress();
    }
  }, [user]);

  const fetchAddress = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.address) {
          setAddress(data.address);
          setFormData({
            street: data.address.street || '',
            city: data.address.city || '',
            stateCode: data.address.stateCode || '',
            countryCode: data.address.countryCode || '',
            zip: data.address.zip || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
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

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      const newAddress = {
        street: formData.street,
        city: formData.city,
        stateCode: formData.stateCode,
        countryCode: formData.countryCode,
        zip: formData.zip,
        countryName: Country.getCountryByCode(formData.countryCode)?.name || '',
        stateName: State.getStateByCodeAndCountry(formData.stateCode, formData.countryCode)?.name || formData.stateCode,
      };
      await updateDoc(docRef, { address: newAddress });
      setAddress(newAddress);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing && address) {
    return (
      <div className="bg-white border border-black/10 p-8 relative">
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-black/5">
          <h2 className="text-2xl font-perandory tracking-tight text-[#000000] flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Default Address
          </h2>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-[10px] uppercase font-bold tracking-widest text-[#000000]/50 hover:text-[#000000] flex items-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-3 h-3" /> Edit
          </button>
        </div>
        <div className="text-lg font-dm-sans text-[#000000] space-y-1 mt-2">
          <p>{address.street}</p>
          <p className="opacity-80">{address.city}, {address.stateName} {address.zip}</p>
          <p className="opacity-80">{address.countryName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/10 p-8">
      <div className="flex justify-between items-start mb-8 pb-4 border-b border-black/5">
        <h2 className="text-2xl font-perandory tracking-tight text-[#000000] flex items-center gap-2">
            <MapPin className="w-5 h-5" /> 
          {address ? 'Edit Address' : 'Add New Address'}
        </h2>
        {address && (
          <button 
            onClick={() => setIsEditing(false)}
            className="text-[#000000]/60 hover:text-[#000000] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
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
