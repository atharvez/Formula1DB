'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { JSX } from 'react';

type Driver = {
    id: number;
    name: string;
    teams: {
        id: number;
        name: string;
    } | null;
};

type Result = {
    points: number;
    drivers: Driver;
};

type DriverLeaderboardEntry = {
    driver_id: number;
    driver_name: string;
    team_name: string;
    total_points: number;
};

type TeamLeaderboardEntry = {
    team_name: string;
    total_points: number;
};

export default function HomePage() {
    const [driverLeaderboard, setDriverLeaderboard] = useState<DriverLeaderboardEntry[]>([]);
    const [teamLeaderboard, setTeamLeaderboard] = useState<TeamLeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLeaderboards();
    }, []);

    async function fetchLeaderboards() {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('results')
                .select(`
                    points,
                    drivers (
                        id,
                        first_name, 
                        last_name,
                        teams (
                            id,
                            name
                        )
                    )
                `);

            if (error) throw error;
            if (!data || !Array.isArray(data)) throw new Error('Invalid data format from Supabase');

            console.log('Raw data from Supabase:', data);

            const driverPoints: Record<number, DriverLeaderboardEntry> = {};
            const teamPoints: Record<string, number> = {};

            data.forEach((result: any) => {
                const driver = result.drivers;
                if (!driver) return;

                const driverId = driver.id;
                const driverName = driver.name;
                const teamName = driver.teams?.name || 'Unknown';
                const points = result.points || 0;

                if (!driverPoints[driverId]) {
                    driverPoints[driverId] = {
                        driver_id: driverId,
                        driver_name: `${driver.first_name} ${driver.last_name}`,
                        team_name: teamName,
                        total_points: 0,
                    };
                }

                driverPoints[driverId].total_points += points;

                if (!teamPoints[teamName]) {
                    teamPoints[teamName] = 0;
                }
                teamPoints[teamName] += points;
            });

            const sortedDrivers = Object.values(driverPoints).sort((a, b) => b.total_points - a.total_points);
            const sortedTeams = Object.entries(teamPoints)
                .map(([team_name, total_points]) => ({ team_name, total_points }))
                .sort((a, b) => b.total_points - a.total_points);

            setDriverLeaderboard(sortedDrivers);
            setTeamLeaderboard(sortedTeams);
        } catch (err: any) {
            console.error('Error fetching leaderboard:', err?.message || err);
            setError(err?.message || 'Failed to load leaderboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-4 md:p-8 font-[Racing Sans One]">
            {/* Hero Section */}
            <section className="text-center py-12 md:py-24">
                <motion.div
                    className="inline-block mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    <div className="bg-red-600 text-white p-3 rounded-full inline-block">
                        <Trophy className="w-8 h-8" />
                    </div>
                </motion.div>
                <motion.h1
                    className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-400"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Formula One Racing Hub
                </motion.h1>
                <motion.p
                    className="text-lg text-gray-300 max-w-xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    Current season driver and team standings
                </motion.p>
            </section>

            {/* Leaderboards */}
            <div className="space-y-20">
                {/* Driver Leaderboard */}
                <LeaderboardSection
                    title="Driver Standings"
                    icon={<Trophy className="w-6 h-6 text-yellow-400" />}
                    loading={loading}
                    error={error}
                    columns={['Pos', 'Driver', 'Team', 'Points']}
                    data={driverLeaderboard.map((d, index) => [
                        `${index + 1}`,
                        <span className="font-medium">{d.driver_name}</span>,
                        <span className="text-gray-300">{d.team_name}</span>,
                        <span className="font-bold">{d.total_points}</span>,
                    ])}
                />

                {/* Team Leaderboard */}
                <LeaderboardSection
                    title="Team Standings"
                    icon={<Trophy className="w-6 h-6 text-blue-400" />}
                    loading={loading}
                    error={error}
                    columns={['Pos', 'Team', 'Points']}
                    data={teamLeaderboard.map((t, index) => [
                        `${index + 1}`,
                        <span className="font-medium">{t.team_name}</span>,
                        <span className="font-bold">{t.total_points}</span>,
                    ])}
                />
            </div>
        </main>
    );
}

// Reusable leaderboard table component
function LeaderboardSection({
                                title,
                                icon,
                                loading,
                                error,
                                columns,
                                data,
                            }: {
    title: string;
    icon: JSX.Element;
    loading: boolean;
    error: string | null;
    columns: string[];
    data: (string | JSX.Element)[][];
}) {
    return (
        <section className="max-w-5xl mx-auto">
            <motion.div
                className="flex items-center justify-center mb-6 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                {icon}
                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                    {title}
                </h2>
            </motion.div>

            {error && (
                <div className="bg-red-900/50 p-4 rounded-lg mb-6 text-center max-w-md mx-auto">
                    <p className="text-red-200">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                </div>
            ) : (
                <motion.div
                    className="bg-gray-800/50 rounded-xl overflow-hidden shadow-xl border border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-red-800 to-red-600">
                        <tr>
                            {columns.map((col, i) => (
                                <th key={i} className="p-4 text-left text-sm md:text-base font-semibold">
                                    {col}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, idx) => (
                            <tr
                                key={idx}
                                className={`border-t border-gray-700 ${idx < 3 ? 'bg-gray-700/30' : ''} hover:bg-gray-700/50 transition-colors`}
                            >
                                {row.map((cell, j) => (
                                    <td key={j} className="p-4 text-sm md:text-base">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </motion.div>
            )}
        </section>
    );
}