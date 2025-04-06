'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type LeaderboardEntry = {
    driverId: number;
    driverName: string;
    teamName: string;
    totalWinnings: number;
};

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    async function fetchLeaderboard() {
        const { data, error } = await supabase
            .from('winnings')
            .select(`
        amount,
        drivers (
          id,
          name,
          teams (
            name
          )
        )
      `);

        if (error) {
            console.error(error);
            return;
        }

        // Aggregate total winnings per driver
        const aggregated: Record<number, LeaderboardEntry> = {};

        data?.forEach((entry: any) => {
            const driver = entry.drivers;
            const driverId = driver.id;
            const driverName = driver.name;
            const teamName = driver.teams?.name || 'Unknown';

            if (!aggregated[driverId]) {
                aggregated[driverId] = {
                    driverId,
                    driverName,
                    teamName,
                    totalWinnings: 0,
                };
            }

            aggregated[driverId].totalWinnings += entry.amount;
        });

        const sorted = Object.values(aggregated).sort(
            (a, b) => b.totalWinnings - a.totalWinnings
        );

        setLeaderboard(sorted);
    }

    return (
        <main className="p-6 max-w-4xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6 text-center">🏆 F1 Live Leaderboard</h1>
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                <table className="min-w-full table-auto">
                    <thead className="bg-red-700">
                    <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Driver</th>
                        <th className="p-3 text-left">Team</th>
                        <th className="p-3 text-left">Total Winnings ($)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leaderboard.map((item, index) => (
                        <tr key={item.driverId} className="border-t border-gray-800 hover:bg-gray-800">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">{item.driverName}</td>
                            <td className="p-3">{item.teamName}</td>
                            <td className="p-3">${item.totalWinnings.toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}