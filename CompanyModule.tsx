import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { Zap, Mail, Lock, Chrome, Github, ArrowRight, Loader2 } from 'lucide-react';

interface AuthProps {
  onBack: () => void;
}

export default function Auth({ onBack }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Authentication method not enabled. Please enable Email/Password in Firebase Console.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google Sign-In not enabled. Please enable Google provider in Firebase Console.');
      } else {
        setError(err.message);
      }
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithPopup(auth, new GithubAuthProvider());
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('GitHub Sign-In not enabled. Please enable GitHub provider in Firebase Console.');
      } else {
        setError(err.message);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1018] flex items-center justify-center p-4 font-sans text-[#e2e5f0]">
      <div className="w-full max-w-md bg-[#141824] rounded-2xl border border-[#252b3b] p-8 shadow-2xl relative">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-[#8892ab] hover:text-[#6c63ff] transition-colors flex items-center gap-1 text-xs"
        >
          <ArrowRight className="w-3 h-3 rotate-180" />
          Back
        </button>
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#6c63ff] to-[#9c5cff] rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-[#6c63ff]/20">
            <Zap className="text-white w-7 h-7 fill-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Slayte<span className="text-[#6c63ff]">Flow</span>
          </h1>
          <p className="text-[#8892ab] text-xs uppercase tracking-[0.2em] mt-1">Billing · Flow</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#4e566b] mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1f2e] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#4e566b] mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1f2e] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-[#ef4444] text-xs px-1">{error}</p>}
          {message && <p className="text-[#22c55e] text-xs px-1">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6c63ff] hover:bg-[#5a52e0] text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6c63ff]/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-[#1a1f2e] border border-[#252b3b] hover:border-[#6c63ff]/50 text-[#e2e5f0] font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Chrome className="w-4 h-4" />
            Continue with Google
          </button>

          <button
            onClick={handleGithubSignIn}
            className="w-full bg-[#1a1f2e] border border-[#252b3b] hover:border-[#6c63ff]/50 text-[#e2e5f0] font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Github className="w-4 h-4" />
            Continue with GitHub
          </button>

          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-[#8892ab] hover:text-[#6c63ff] transition-colors"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </button>
            {isLogin && (
              <button
                onClick={handleForgotPassword}
                className="text-xs text-[#8892ab] hover:text-[#6c63ff] transition-colors"
              >
                Forgot Password?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
