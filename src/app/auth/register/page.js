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
        phone: '',
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
        <h2 className="text-2xl font-serif tracking-tight text-[#1A1A1A]">Create Account</h2>
        <p className="mt-2 text-sm text-[#1A1A1A]/70">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-[#1A1A1A] underline hover:text-[#1A1A1A]/80">
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
            <label className="block text-xs font-medium text-[#1A1A1A]/80 uppercase tracking-widest mb-1">Full Name</label>
            <input
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 border border-[#1A1A1A]/20 bg-transparent rounded-sm shadow-sm placeholder-[#1A1A1A]/40 focus:outline-none focus:ring-[#1A1A1A] focus:border-[#1A1A1A] sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1A1A1A]/80 uppercase tracking-widest mb-1">Email address</label>
            <input
              type="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-[#1A1A1A]/20 bg-transparent rounded-sm shadow-sm placeholder-[#1A1A1A]/40 focus:outline-none focus:ring-[#1A1A1A] focus:border-[#1A1A1A] sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1A1A1A]/80 uppercase tracking-widest mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="appearance-none block w-full px-3 py-2 border border-[#1A1A1A]/20 bg-transparent rounded-sm shadow-sm placeholder-[#1A1A1A]/40 focus:outline-none focus:ring-[#1A1A1A] focus:border-[#1A1A1A] sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-[#F8F5F1] bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A1A1A] disabled:opacity-70 uppercase tracking-widest transition-colors"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
    </>
  );
}
