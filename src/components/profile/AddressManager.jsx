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
      <div className="bg-[#E5E0DA]/30 border border-[#000000]/10 rounded-md p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-sm font-bold tracking-widest uppercase text-[#000000] flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Default Address
          </h2>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-xs text-[#000000]/60 hover:text-[#000000] flex items-center gap-1 transition-colors"
          >
            <Edit2 className="w-3 h-3" /> Edit
          </button>
        </div>
        <div className="text-sm text-[#000000]/80 space-y-1">
          <p>{address.street}</p>
          <p>{address.city}, {address.stateName} {address.zip}</p>
          <p className="font-medium text-[#000000]">{address.countryName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#E5E0DA]/30 border border-[#000000]/10 rounded-md p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-sm font-bold tracking-widest uppercase text-[#000000] flex items-center gap-2">
          <MapPin className="w-4 h-4" /> 
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

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-[#000000]/60 mb-2">Street Address</label>
          <input 
            type="text" 
            required
            value={formData.street}
            onChange={(e) => setFormData({...formData, street: e.target.value})}
            className="w-full bg-white border border-[#000000]/10 text-[#000000] text-sm rounded-none px-4 py-3 outline-none focus:border-[#000000]/40 transition-colors"
            placeholder="123 Main St, Apt 4B"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[#000000]/60 mb-2">Country</label>
            <div className="relative">
              <select 
                required
                value={formData.countryCode}
                onChange={(e) => setFormData({...formData, countryCode: e.target.value, stateCode: '', city: ''})}
                className="w-full bg-white border border-[#000000]/10 text-[#000000] text-sm rounded-none px-4 py-3 appearance-none outline-none focus:border-[#000000]/40 transition-colors"
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
            <label className="block text-xs font-bold tracking-widest uppercase text-[#000000]/60 mb-2">State / Province</label>
            <div className="relative">
              <select 
                required
                disabled={!formData.countryCode || states.length === 0}
                value={formData.stateCode}
                onChange={(e) => setFormData({...formData, stateCode: e.target.value, city: ''})}
                className="w-full bg-white border border-[#000000]/10 text-[#000000] text-sm rounded-none px-4 py-3 appearance-none outline-none focus:border-[#000000]/40 transition-colors disabled:opacity-50"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[#000000]/60 mb-2">City</label>
            {cities.length > 0 ? (
              <div className="relative">
                <select 
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-white border border-[#000000]/10 text-[#000000] text-sm rounded-none px-4 py-3 appearance-none outline-none focus:border-[#000000]/40 transition-colors"
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
                className="w-full bg-white border border-[#000000]/10 text-[#000000] text-sm rounded-none px-4 py-3 outline-none focus:border-[#000000]/40 transition-colors"
                placeholder="City Name"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[#000000]/60 mb-2">Postal / Zip Code</label>
            <input 
              type="text" 
              required
              value={formData.zip}
              onChange={(e) => setFormData({...formData, zip: e.target.value})}
              className="w-full bg-white border border-[#000000]/10 text-[#000000] text-sm rounded-none px-4 py-3 outline-none focus:border-[#000000]/40 transition-colors"
              placeholder="10001"
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#000000] text-white text-xs font-bold tracking-widest uppercase py-4 flex items-center justify-center gap-2 hover:bg-[#000000]/90 transition-colors disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </form>
    </div>
  );
}
