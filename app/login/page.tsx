'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [authError, setAuthError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    async function handleAuth(type: 'sign-in' | 'sign-up') {
        setLoading(true);
        setAuthError('');

        try {
            let error;

            if (type === 'sign-in') {
                const res = await supabase.auth.signInWithPassword({ email, password });
                error = res.error;
            } else {
                const res = await supabase.auth.signUp({
                    email,
                    password,
                    // Optional: emailRedirectTo: `${location.origin}/verify`
                });
                error = res.error;
            }

            if (error) {
                setAuthError(error.message);
            } else {
                if (!rememberMe) {
                    await supabase.auth.signOut(); // Clear session
                }
                router.push('/');
            }
        } catch (err) {
            setAuthError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className={`${darkMode ? 'dark' : ''}`}>
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Welcome 👋</h1>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="text-xs bg-gray-200 dark:bg-gray-700 dark:text-white px-2 py-1 rounded-md"
                        >
                            {darkMode ? '🌞 Light' : '🌙 Dark'}
                        </button>
                    </div>
                    <p className="text-gray-500 dark:text-gray-300">Sign in or create an account</p>

                    <div className="space-y-4">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        />
                        <div className="relative">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                type={showPassword ? 'text' : 'password'}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-sm text-red-600 dark:text-red-300"
                            >
                                {showPassword ? '🙈 Hide' : '👁️ Show'}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="accent-red-600"
                            />
                            <span>Remember me</span>
                        </label>
                    </div>

                    {authError && (
                        <div className="text-red-500 text-sm">
                            ⚠️ {authError}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            onClick={() => handleAuth('sign-in')}
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                        <button
                            onClick={() => handleAuth('sign-up')}
                            disabled={loading}
                            className="w-full border border-red-600 text-red-600 dark:text-red-400 py-3 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
