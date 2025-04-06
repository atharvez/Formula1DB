'use client';

import './globals.css';
import Navbar from '@/app/components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
        <body className="bg-black text-white">
        <Navbar />
        <main>{children}</main>
        </body>
        </html>
    );
}
