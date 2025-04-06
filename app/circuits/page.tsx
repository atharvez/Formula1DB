'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CircuitsPage() {
    const [circuits, setCircuits] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [gpName, setGpName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchCircuits();
    }, []);

    async function fetchCircuits() {
        const { data, error } = await supabase.from('circuits').select('*');
        if (data) setCircuits(data);
        if (error) console.error(error);
    }

    async function addOrUpdateCircuit() {
        const payload = {
            name,
            location,
            gp_name: gpName,
        };

        if (editingId) {
            await supabase.from('circuits').update(payload).eq('id', editingId);
        } else {
            await supabase.from('circuits').insert(payload);
        }

        setName('');
        setLocation('');
        setGpName('');
        setEditingId(null);
        fetchCircuits();
    }

    async function deleteCircuit(id: number) {
        await supabase.from('circuits').delete().eq('id', id);
        fetchCircuits();
    }

    function editCircuit(circuit: any) {
        setName(circuit.name);
        setLocation(circuit.location);
        setGpName(circuit.gp_name || '');
        setEditingId(circuit.id);
    }

    return (
        <main className="p-6 max-w-5xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6">Circuits</h1>

            <div className="grid sm:grid-cols-4 gap-2 mb-6">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Circuit Name"
                    className="p-2 rounded bg-gray-800 border border-gray-700"
                />
                <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="p-2 rounded bg-gray-800 border border-gray-700"
                />
                <input
                    value={gpName}
                    onChange={(e) => setGpName(e.target.value)}
                    placeholder="GP Name"
                    className="p-2 rounded bg-gray-800 border border-gray-700"
                />
                <button
                    onClick={addOrUpdateCircuit}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    {editingId ? 'Update' : 'Add'}
                </button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {circuits.map((circuit) => (
                    <div key={circuit.id} className="bg-gray-900 p-4 rounded shadow space-y-2">
                        <h2 className="text-xl font-semibold">{circuit.name}</h2>
                        <p className="text-sm text-gray-400">Location: {circuit.location}</p>
                        <p className="text-sm text-gray-400">GP: {circuit.gp_name || '—'}</p>
                        <div className="space-x-2">
                            <button onClick={() => editCircuit(circuit)} className="px-3 py-1 bg-blue-600 rounded">
                                Edit
                            </button>
                            <button onClick={() => deleteCircuit(circuit.id)} className="px-3 py-1 bg-red-600 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
