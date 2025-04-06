'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function TeamDetailPage() {
    const { id } = useParams();
    const [team, setTeam] = useState<any>(null);
    const [cars, setCars] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [points, setPoints] = useState<number>(0);

    useEffect(() => {
        if (id) fetchTeamData(id as string);
    }, [id]);

    async function fetchTeamData(teamId: string) {
        const teamRes = await supabase.from('teams').select('*').eq('id', teamId).single();
        const carsRes = await supabase.from('cars').select('*').eq('team_id', teamId);
        const driversRes = await supabase.from('drivers').select('*').eq('team_id', teamId);

        if (teamRes.data) setTeam(teamRes.data);
        if (carsRes.data) setCars(carsRes.data);
        if (driversRes.data) setDrivers(driversRes.data);

        if (driversRes.data?.length) {
            const driverIds = driversRes.data.map((d: any) => d.id);
            const resultsRes = await supabase.from('results').select('*').in('driver_id', driverIds);
            const totalPoints = resultsRes.data?.reduce((sum: number, r: any) => sum + r.points, 0) ?? 0;
            setPoints(totalPoints);
        }
    }

    if (!team) return <p className="text-center text-white p-6">Loading team data...</p>;

    return (
        <main className="max-w-6xl mx-auto p-6 text-white space-y-6">
            {/* Team Section */}
            <div className="flex items-center gap-6 bg-gray-900 p-6 rounded-xl shadow-lg">
                <div className="w-20 h-20 flex items-center justify-center bg-gray-800 rounded-full">
                    <span className="text-2xl font-bold">{team.name.charAt(0)}</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{team.name}</h1>
                    <p className="text-gray-400">Country: {team.country}</p>
                    <p className="text-green-400 font-semibold mt-2">🏆 Points: {points}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Cars Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-3">Cars</h2>
                    <div className="space-y-3">
                        {cars.map((car) => (
                            <div key={car.id} className="bg-gray-800 p-4 rounded-lg shadow">
                                <div className="flex justify-between">
                                    <span className="font-medium">{car.model}</span>
                                    <span className="text-gray-400">Year: {car.year}</span>
                                </div>
                                {car.engine && <p className="text-sm text-gray-400 mt-1">Engine: {car.engine}</p>}
                            </div>
                        ))}
                        {cars.length === 0 && <p className="text-gray-500">No cars registered yet.</p>}
                    </div>
                </div>

                {/* Drivers Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-3">Drivers</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {drivers.map((driver) => (
                            <div key={driver.id} className="bg-gray-800 p-4 rounded-lg shadow">
                                <h3 className="text-lg font-bold">{driver.name}</h3>
                                <p className="text-sm text-gray-400">{driver.nationality}</p>
                                {driver.number && <p className="text-sm text-gray-400">#{driver.number}</p>}
                            </div>
                        ))}
                        {drivers.length === 0 && <p className="text-gray-500">No drivers listed.</p>}
                    </div>
                </div>
            </div>
        </main>
    );
}