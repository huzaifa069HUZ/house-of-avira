'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      let role = 'customer';
      if (['Orders.houseofavira@gmail.com', 'huzaifatabish9145@gmail.com'].includes(user.email)) {
        role = 'admin_owner';
      }

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email: user.email,
        role,
        phone: `${countryCode} ${phone}`,
        instagramHandle: '',
        profilePicUrl: '',
        createdAt: serverTimestamp()
      });
      
      router.push('/account');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-serif tracking-tight text-[#000000]">Create Account</h2>
        <p className="mt-2 text-sm text-[#000000]/70">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-[#000000] underline hover:text-[#000000]/80">
            Sign in
          </Link>
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleRegister}>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#000000]/80 uppercase tracking-widest mb-1">Full Name</label>
            <input
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 border border-[#000000]/20 bg-transparent rounded-sm shadow-sm placeholder-[#000000]/40 focus:outline-none focus:ring-[#000000] focus:border-[#000000] sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#000000]/80 uppercase tracking-widest mb-1">Email address</label>
            <input
              type="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-[#000000]/20 bg-transparent rounded-sm shadow-sm placeholder-[#000000]/40 focus:outline-none focus:ring-[#000000] focus:border-[#000000] sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#000000]/80 uppercase tracking-widest mb-1">Phone Number</label>
            <div className="flex">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="appearance-none block w-[80px] px-3 py-2 border border-[#000000]/20 border-r-0 bg-transparent rounded-l-sm shadow-sm focus:outline-none focus:ring-[#000000] focus:border-[#000000] sm:text-sm text-center"
              >
                <option value="+91">+91 (IN)</option>
                <option value="+1">+1 (US/CA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+61">+61 (AU)</option>
                <option value="+971">+971 (AE)</option>
                <option value="+65">+65 (SG)</option>
              </select>
              <input
                type="tel"
                required
                className="appearance-none block w-full px-3 py-2 border border-[#000000]/20 bg-transparent rounded-r-sm shadow-sm placeholder-[#000000]/40 focus:outline-none focus:ring-[#000000] focus:border-[#000000] sm:text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="1234567890"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#000000]/80 uppercase tracking-widest mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="appearance-none block w-full px-3 py-2 border border-[#000000]/20 bg-transparent rounded-sm shadow-sm placeholder-[#000000]/40 focus:outline-none focus:ring-[#000000] focus:border-[#000000] sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-[#FFFFFF] bg-[#000000] hover:bg-[#8A001A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000000] disabled:opacity-70 uppercase tracking-widest transition-colors"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
    </>
  );
}
