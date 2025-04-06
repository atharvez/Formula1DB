'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RacesPage() {
    const [races, setRaces] = useState<any[]>([]);
    const [circuits, setCircuits] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [circuitId, setCircuitId] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchRaces();
        fetchCircuits();
    }, []);

    async function fetchRaces() {
        const { data, error } = await supabase
            .from('races')
            .select('*, circuits(name)');
        if (data) setRaces(data);
        if (error) console.error(error);
    }

    async function fetchCircuits() {
        const { data, error } = await supabase.from('circuits').select('*');
        if (data) setCircuits(data);
        if (error) console.error(error);
    }

    async function addOrUpdateRace() {
        const payload = {
            name,
            date,
            circuit_id: Number(circuitId),
        };

        if (editingId) {
            await supabase.from('races').update(payload).eq('id', editingId);
        } else {
            await supabase.from('races').insert(payload);
        }

        setName('');
        setDate('');
        setCircuitId('');
        setEditingId(null);
        fetchRaces();
    }

    async function deleteRace(id: number) {
        await supabase.from('races').delete().eq('id', id);
        fetchRaces();
    }

    function editRace(race: any) {
        setName(race.name);
        setDate(race.date);
        setCircuitId(race.circuit_id);
        setEditingId(race.id);
    }

    return (
        <main className="p-6 max-w-5xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6">Races</h1>

            <div className="grid sm:grid-cols-4 gap-2 mb-6">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Race Name"
                    className="p-2 rounded bg-gray-800 border border-gray-700"
                />
                <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    className="p-2 rounded bg-gray-800 border border-gray-700"
                />
                <select
                    value={circuitId}
                    onChange={(e) => setCircuitId(e.target.value)}
                    className="p-2 rounded bg-gray-800 border border-gray-700"
                >
                    <option value="">Select Circuit</option>
                    {circuits.map((circuit) => (
                        <option key={circuit.id} value={circuit.id}>
                            {circuit.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={addOrUpdateRace}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    {editingId ? 'Update' : 'Add'}
                </button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {races.map((race) => (
                    <div key={race.id} className="bg-gray-900 p-4 rounded shadow space-y-2">
                        <h2 className="text-xl font-semibold">{race.name}</h2>
                        <p className="text-sm text-gray-400">Date: {race.date}</p>
                        <p className="text-sm text-gray-400">
                            Circuit: {race.circuits?.name || '—'}
                        </p>
                        <div className="space-x-2">
                            <button
                                onClick={() => editRace(race)}
                                className="px-3 py-1 bg-blue-600 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteRace(race.id)}
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
