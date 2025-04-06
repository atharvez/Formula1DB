'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CarsPage() {
    const [cars, setCars] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);

    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [engine, setEngine] = useState('');
    const [teamId, setTeamId] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchCars();
        fetchTeams();
    }, []);

    async function fetchCars() {
        const { data, error } = await supabase
            .from('cars')
            .select(`
        id,
        model,
        year,
        engine,
        team_id,
        teams ( name )
      `);

        if (data) setCars(data);
        if (error) console.error('Fetch cars error:', error);
    }

    async function fetchTeams() {
        const { data, error } = await supabase.from('teams').select('id, name');
        if (data) setTeams(data);
        if (error) console.error('Fetch teams error:', error);
    }

    async function addOrUpdateCar() {
        const payload = {
            model,
            year: Number(year),
            engine,
            team_id: Number(teamId),
        };

        if (editingId) {
            await supabase.from('cars').update(payload).eq('id', editingId);
        } else {
            await supabase.from('cars').insert(payload);
        }

        // Reset form
        setModel('');
        setYear('');
        setEngine('');
        setTeamId('');
        setEditingId(null);

        fetchCars();
    }

    async function deleteCar(id: number) {
        await supabase.from('cars').delete().eq('id', id);
        fetchCars();
    }

    function editCar(car: any) {
        setModel(car.model);
        setYear(car.year);
        setEngine(car.engine);
        setTeamId(car.team_id);
        setEditingId(car.id);
    }

    return (
        <main className="p-6 max-w-5xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6">Cars</h1>

            {/* Form */}
            <div className="grid sm:grid-cols-5 gap-2 mb-6">
                <input
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Model"
                    className="p-2 rounded bg-gray-800 border border-gray-700"
                />
                <input
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Year"
                    type="number"
                    className="p-2 rounded bg-gray-800 border border-gray-700"
                />
                <input
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    placeholder="Engine"
                    className="p-2 rounded bg-gray-800 border border-gray-700"
                />
                <select
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    className="p-2 rounded bg-gray-800 border border-gray-700"
                >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={addOrUpdateCar}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    {editingId ? 'Update' : 'Add'}
                </button>
            </div>

            {/* Cars List */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {cars.map((car) => (
                    <div key={car.id} className="bg-gray-900 p-4 rounded shadow space-y-2">
                        <h2 className="text-xl font-semibold">{car.model}</h2>
                        <p className="text-sm text-gray-400">Year: {car.year}</p>
                        <p className="text-sm text-gray-400">Engine: {car.engine}</p>
                        <p className="text-sm text-gray-400">
                            Team: {car.teams?.name || 'Unknown'}
                        </p>
                        <div className="space-x-2">
                            <button
                                onClick={() => editCar(car)}
                                className="px-3 py-1 bg-blue-600 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteCar(car.id)}
                                className="px-3 py-1 bg-red-600 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
