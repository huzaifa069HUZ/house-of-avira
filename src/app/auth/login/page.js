'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LiquidButton } from '@/components/ui/liquid-button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  // States for new Google users missing details
  const [showGoogleExtraForm, setShowGoogleExtraForm] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/account');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch(err) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user doc exists in Firestore, if not create one
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        setGoogleUser(user);
        setName(user.displayName || '');
        setShowGoogleExtraForm(true);
      } else {
        router.push('/account');
      }
    } catch (err) {
      console.error("Google Sign-in error:", JSON.stringify({
        code: err.code,
        message: err.message,
        customData: err.customData,
        email: err.customData?.email,
      }));
      
      const code = err.code || '';
      const serverMsg = err.customData?._tokenResponse?.error?.message || '';
      
      setError(
        `Google Login failed [${code}]: ${err.message}` +
        (serverMsg ? ` | Server: ${serverMsg}` : '')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleExtraSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
        const userDocRef = doc(db, 'users', googleUser.uid);
        let role = 'customer';
        const allowedAdminEmails = ['huzaifatabish9145@gmail.com', 'houseofavira@gmail.com', 'orders.houseofavira@gmail.com'];
        if (allowedAdminEmails.includes(googleUser.email.toLowerCase())) {
          role = 'admin_owner';
        }
        
        await setDoc(userDocRef, {
          uid: googleUser.uid,
          name: name || googleUser.displayName || '',
          email: googleUser.email,
          role,
          phone: `+91 ${phone}`,
          instagramHandle: '',
          profilePicUrl: googleUser.photoURL || '',
          createdAt: serverTimestamp()
        });
        
        router.push('/account');
    } catch(err) {
        console.error(err);
        setError('Failed to save profile details.');
    } finally {
        setLoading(false);
    }
  };

  if (showGoogleExtraForm) {
    return (
      <>
        <div className="text-center">
          <h2 className="text-2xl font-serif tracking-tight text-white">Complete your Profile</h2>
          <p className="mt-2 text-sm text-white/70">
            Just a few more details to set up your account.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleGoogleExtraSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
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
          </div>

          <div>
            <LiquidButton
              type="submit"
              disabled={loading}
              label={loading ? 'Saving...' : 'Complete Setup'}
              className="w-full h-[48px] text-base font-perandory text-white uppercase tracking-widest rounded-sm disabled:opacity-70"
            />
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-serif tracking-tight text-white">Sign in</h2>
        <p className="mt-2 text-sm text-white/70">
          Or{' '}
          <Link href="/auth/register" className="font-medium text-white underline hover:text-white/80 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleLogin}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded text-sm text-center">
            {error}
          </div>
        )}
        {resetEmailSent && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-200 p-3 rounded text-sm text-center">
            Password reset email sent! Please check your inbox and spam folder.
          </div>
        )}
        
        <div className="space-y-4">
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-perandory text-white/90 uppercase tracking-widest">Password</label>
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-xs text-white/60 hover:text-white underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
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
            label={loading ? 'Signing in...' : 'Sign in'}
            className="w-full h-[48px] text-base font-perandory text-white uppercase tracking-widest rounded-sm disabled:opacity-70"
          />
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black/40 text-white/60 uppercase tracking-widest text-[10px] backdrop-blur-xl">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-white/20 rounded-sm shadow-sm bg-white/5 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </div>
      </div>
    </>
  );
}
