'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to request OTP');
      }
      
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Verify OTP First
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      
      const verifyData = await verifyRes.json();
      
      if (!verifyRes.ok) {
        throw new Error(verifyData.message || 'Invalid OTP');
      }

      // OTP Verified! Now create the user in Firebase Auth natively
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      let role = 'customer';
      if (['Orders.houseofavira@gmail.com', 'huzaifatabish9145@gmail.com'].includes(user.email)) {
        role = 'admin_owner';
      }

      // Save user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email: user.email,
        role,
        phone,
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

      {step === 1 ? (
        <form className="mt-8 space-y-6" onSubmit={handleRequestOtp}>
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
              <input
                type="tel"
                required
                className="appearance-none block w-full px-3 py-2 border border-[#000000]/20 bg-transparent rounded-sm shadow-sm placeholder-[#000000]/40 focus:outline-none focus:ring-[#000000] focus:border-[#000000] sm:text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
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
              {loading ? 'Sending OTP...' : 'Next'}
            </button>
          </div>
        </form>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleVerifyAndRegister}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="text-sm text-center text-gray-600 mb-4">
            We've sent a 6-digit verification code to <strong>{email}</strong>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#000000]/80 uppercase tracking-widest mb-1 text-center">Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                className="appearance-none block w-full px-3 py-3 border border-[#000000]/20 bg-transparent rounded-sm shadow-sm placeholder-[#000000]/40 focus:outline-none focus:ring-[#000000] focus:border-[#000000] text-center text-xl tracking-[0.5em] font-bold"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-[#FFFFFF] bg-[#000000] hover:bg-[#8A001A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000000] disabled:opacity-70 uppercase tracking-widest transition-colors"
            >
              {loading ? 'Verifying & Creating...' : 'Verify & Create Account'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-sm text-xs font-bold text-[#000000] hover:underline uppercase tracking-widest transition-colors"
            >
              Back to Details
            </button>
          </div>
        </form>
      )}
    </>
  );
}
