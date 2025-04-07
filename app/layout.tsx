// app/layout.tsx
import './globals.css';
import { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';

export const metadata: Metadata = {
    title: 'F1 Hub',
    description: 'Formula 1 Racing Database - Teams, Drivers, Circuits, Cars, and Results',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />
        </head>
        <body className="bg-slate-950 text-white font-[Inter]">
        <Navbar />
        <main className="min-h-screen px-6 py-4">{children}</main>
        </body>
        </html>
    );
}
