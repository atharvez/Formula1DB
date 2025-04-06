'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

type Driver = {
    id: number;
    name: string;
    teams: {
        name: string;
    };
};

type Result = {
    points: number;
    drivers: Driver;
};

type LeaderboardEntry = {
    driver_id: number;
    driver_name: string;
    team_name: string;
    total_points: number;
};

export default function HomePage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    async function fetchLeaderboard() {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('results')
                .select(`
          points,
          drivers!inner(id, name, teams!inner(name))
        `) as { data: Result[] | null, error: any };

            if (error) throw error;
            if (!data) throw new Error('No data returned');

            // Aggregate points by driver
            const driverPoints: Record<number, LeaderboardEntry> = {};

            data.forEach(result => {
                const driver = result.drivers;
                if (!driver) return;

                if (!driverPoints[driver.id]) {
                    driverPoints[driver.id] = {
                        driver_id: driver.id,
                        driver_name: driver.name,
                        team_name: driver.teams?.name || 'Unknown',
                        total_points: 0
                    };
                }

                driverPoints[driver.id].total_points += result.points || 0;
            });

            const sorted = Object.values(driverPoints).sort((a, b) => b.total_points - a.total_points);
            setLeaderboard(sorted);

        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError('Failed to load leaderboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
            {/* Hero Section */}
            <section className="text-center py-20">
                <motion.h1
                    className="text-5xl font-extrabold mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    🏁 Formula One Racing Hub
                </motion.h1>
                <motion.p
                    className="text-lg text-gray-300 max-w-xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    Current season driver standings and statistics
                </motion.p>
            </section>

            {/* Leaderboard Section */}
            <section className="max-w-4xl mx-auto mt-10">
                <motion.div
                    className="flex items-center justify-center mb-8 gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-2xl font-bold">Driver Standings</h2>
                </motion.div>

                {error && (
                    <div className="bg-yellow-900/50 p-4 rounded-lg mb-4 text-center">
                        <p className="text-yellow-200">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <motion.div
                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <table className="w-full">
                            <thead className="bg-red-700">
                            <tr>
                                <th className="p-3 text-left">Pos</th>
                                <th className="p-3 text-left">Driver</th>
                                <th className="p-3 text-left">Team</th>
                                <th className="p-3 text-left">Points</th>
                            </tr>
                            </thead>
                            <tbody>
                            {leaderboard.map((driver, index) => (
                                <tr
                                    key={driver.driver_id}
                                    className={`border-t border-gray-700 hover:bg-gray-700/50 ${
                                        index < 3 ? 'font-semibold' : ''
                                    }`}
                                >
                                    <td className="p-3">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                    </td>
                                    <td className="p-3">{driver.driver_name}</td>
                                    <td className="p-3">{driver.team_name}</td>
                                    <td className="p-3">{driver.total_points}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </section>
        </main>
    );
}