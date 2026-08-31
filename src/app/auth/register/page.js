'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LiquidButton } from '@/components/ui/liquid-button';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      
      await updateProfile(user, { displayName: name });
      
      let role = 'customer';
      const allowedAdminEmails = ['huzaifatabish9145@gmail.com', 'houseofavira@gmail.com', 'orders.houseofavira@gmail.com'];
      if (allowedAdminEmails.includes(user.email.toLowerCase())) {
        role = 'admin_owner';
      }

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email: user.email,
        role,
        phone: `+91 ${phone}`,
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
        <h2 className="text-2xl font-serif tracking-tight text-white">Create Account</h2>
        <p className="mt-2 text-sm text-white/70">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-white underline hover:text-white/80 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleRegister}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded text-sm text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-perandory text-white/90 uppercase tracking-widest mb-1">Full Name</label>
            <input
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 border border-white/20 bg-white/5 text-white rounded-sm shadow-sm placeholder-white/40 focus:outline-none focus:ring-white/50 focus:border-white/50 sm:text-sm transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-perandory text-white/90 uppercase tracking-widest mb-1">Email address</label>
            <input
              type="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-white/20 bg-white/5 text-white rounded-sm shadow-sm placeholder-white/40 focus:outline-none focus:ring-white/50 focus:border-white/50 sm:text-sm transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-perandory text-white/90 uppercase tracking-widest mb-1">Phone Number</label>
            <div className="flex">
              <span
                className="flex items-center justify-center w-[80px] px-3 py-2 border border-white/20 border-r-0 bg-white/5 text-white rounded-l-sm shadow-sm sm:text-sm text-center"
              >
                +91
              </span>
              <input
                type="tel"
                required
                className="appearance-none block w-full px-3 py-2 border border-white/20 bg-white/5 text-white rounded-r-sm shadow-sm placeholder-white/40 focus:outline-none focus:ring-white/50 focus:border-white/50 sm:text-sm transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="1234567890"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-perandory text-white/90 uppercase tracking-widest mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="appearance-none block w-full px-3 py-2 border border-white/20 bg-white/5 text-white rounded-sm shadow-sm placeholder-white/40 focus:outline-none focus:ring-white/50 focus:border-white/50 sm:text-sm transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <LiquidButton
            type="submit"
            disabled={loading}
            label={loading ? 'Creating account...' : 'Create account'}
            className="w-full h-[48px] text-base font-perandory text-white uppercase tracking-widest rounded-sm disabled:opacity-70"
          />
        </div>
      </form>
    </>
  );
}
