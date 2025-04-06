'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ResultsPage() {
    const [results, setResults] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [races, setRaces] = useState<any[]>([]);
    const [sortConfig, setSortConfig] = useState({ key: 'position', direction: 'asc' });
    const [isLoading, setIsLoading] = useState(true);

    const [driverId, setDriverId] = useState('');
    const [raceId, setRaceId] = useState('');
    const [position, setPosition] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setIsLoading(true);
        try {
            const [{ data: driversData }, { data: racesData }, { data: resultsData }] = await Promise.all([
                supabase.from('drivers').select('*'),
                supabase.from('races').select('*'),
                supabase.from('results').select('*, drivers(name), races(name, date)')
            ]);

            if (driversData) setDrivers(driversData);
            if (racesData) setRaces(racesData);
            if (resultsData) {
                const sortedData = sortResults(resultsData, sortConfig.key, sortConfig.direction);
                setResults(sortedData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    function sortResults(data: any[], key: string, direction: string) {
        return [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const requestSort = (key: string) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        const sortedResults = sortResults(results, key, direction);
        setResults(sortedResults);
    };

    function assignPoints(position: number) {
        const pointsDistribution = {
            1: 25,
            2: 18,
            3: 15,
            4: 12,
            5: 10,
            6: 8,
            7: 6,
            8: 4,
            9: 2,
            10: 1,
        };
        return (pointsDistribution as { [key: number]: number })[position] || 0;
    }

    async function addResult() {
        if (!driverId || !raceId || !position) return;
        const calculatedPoints = assignPoints(Number(position));

        try {
            await supabase.from('results').insert({
                driver_id: Number(driverId),
                race_id: Number(raceId),
                position: Number(position),
                points: calculatedPoints,
            });
            fetchData();
            setDriverId('');
            setRaceId('');
            setPosition('');
        } catch (error) {
            console.error('Error adding result:', error);
        }
    }

    const getPositionColor = (position: number) => {
        if (position === 1) return 'bg-yellow-500/20';
        if (position === 2) return 'bg-gray-400/20';
        if (position === 3) return 'bg-amber-700/20';
        if (position <= 10) return 'bg-green-900/20';
        return 'bg-gray-800';
    };

    return (
        <main className="p-6 text-white max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Race Results</h1>

            <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New Result</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                        value={driverId}
                        onChange={(e) => setDriverId(e.target.value)}
                        className="p-2 rounded bg-gray-700 border border-gray-600"
                    >
                        <option value="">Select Driver</option>
                        {drivers.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>

                    <select
                        value={raceId}
                        onChange={(e) => setRaceId(e.target.value)}
                        className="p-2 rounded bg-gray-700 border border-gray-600"
                    >
                        <option value="">Select Race</option>
                        {races.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name} ({new Date(r.date).toLocaleDateString()})
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="p-2 rounded bg-gray-700 border border-gray-600"
                        min="1"
                    />

                    <button
                        onClick={addResult}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-medium transition-colors"
                        disabled={!driverId || !raceId || !position}
                    >
                        Add Result
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('races.date')}
                                >
                                    <div className="flex items-center">
                                        Date
                                        {sortConfig.key === 'races.date' && (
                                            <span className="ml-1">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('races.name')}
                                >
                                    <div className="flex items-center">
                                        Race
                                        {sortConfig.key === 'races.name' && (
                                            <span className="ml-1">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('drivers.name')}
                                >
                                    <div className="flex items-center">
                                        Driver
                                        {sortConfig.key === 'drivers.name' && (
                                            <span className="ml-1">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('position')}
                                >
                                    <div className="flex items-center">
                                        Position
                                        {sortConfig.key === 'position' && (
                                            <span className="ml-1">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('points')}
                                >
                                    <div className="flex items-center">
                                        Points
                                        {sortConfig.key === 'points' && (
                                            <span className="ml-1">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                        )}
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {results.map((res) => (
                                <tr
                                    key={res.id}
                                    className={`hover:bg-gray-700/50 ${getPositionColor(res.position)}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {res.races?.date ? new Date(res.races.date).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {res.races?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {res.drivers?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full 
                                                ${res.position === 1 ? 'bg-yellow-500' :
                                                res.position === 2 ? 'bg-gray-400' :
                                                    res.position === 3 ? 'bg-amber-700' :
                                                        'bg-gray-600'}`}
                                            >
                                                {res.position}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                                        {res.points}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    );
}