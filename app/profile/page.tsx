'use client';

export default function ProfilePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md p-8 rounded-lg bg-gray-800 border border-gray-700">
                <h1 className="text-3xl font-bold mb-4">Profiles</h1>
                <p className="text-gray-300 mb-6">
                    We're working on an exciting new profiles feature! Check back soon for updates.
                </p>
                <div className="animate-pulse text-red-500 text-sm">
                    Coming Soon
                </div>
            </div>
        </div>
    );
}