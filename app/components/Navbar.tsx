'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiLogOut, FiSun, FiMoon, FiChevronDown } from 'react-icons/fi';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [darkMode, setDarkMode] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session && pathname !== '/login') router.push('/login');
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, [pathname, router]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push('/login');
    }

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const navLinks = [
        { href: '/teams', label: 'Teams' },
        { href: '/drivers', label: 'Drivers' },
        { href: '/cars', label: 'Cars' },
        { href: '/circuits', label: 'Circuits' },
        { href: '/races', label: 'Races' },
        { href: '/results', label: 'Results' }
    ];

    return (
        <nav className="bg-gray-900 text-white px-6 py-3 flex flex-wrap justify-between items-center shadow-md sticky top-0 z-50">
            <div className="flex items-center space-x-8">
                <Link href="/" className="font-bold text-xl text-red-500 hover:text-red-400 transition-colors flex items-center">
                    <span className="bg-red-600 text-white px-2 py-1 rounded mr-2">F1</span>
                    <span>Hub</span>
                </Link>

                <div className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`hover:text-red-400 transition-colors ${
                                pathname === link.href ? 'text-red-500 font-semibold' : ''
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>

                {!user ? (
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/login"
                            className="hover:text-red-400 transition-colors px-3 py-1 rounded hover:bg-gray-800"
                        >
                            Login
                        </Link>
                    </div>
                ) : (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center space-x-2 hover:bg-gray-800 px-3 py-2 rounded transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                <FiUser size={16} />
                            </div>
                            <span className="hidden md:inline">{user.email?.split('@')[0]}</span>
                            <FiChevronDown size={16} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-sm hover:bg-gray-700 flex items-center space-x-2"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    <FiUser size={14} />
                                    <span>My Profile</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center space-x-2"
                                >
                                    <FiLogOut size={14} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile menu button would go here */}
        </nav>
    );
}