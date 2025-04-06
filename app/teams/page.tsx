'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link'; // ✅ import Link for navigation

export default function TeamsPage() {
    const [teams, setTeams] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchTeams();
    }, []);

    async function fetchTeams() {
        const { data, error } = await supabase.from('teams').select('*');
        if (data) setTeams(data);
        if (error) console.error(error);
    }

    async function addOrUpdateTeam() {
        if (editingId) {
            await supabase.from('teams').update({ name, country }).eq('id', editingId);
        } else {
            await supabase.from('teams').insert({ name, country });
        }
        setName('');
        setCountry('');
        setEditingId(null);
        fetchTeams();
    }

    async function deleteTeam(id: number) {
        await supabase.from('teams').delete().eq('id', id);
        fetchTeams();
    }

    function editTeam(team: any) {
        setName(team.name);
        setCountry(team.country);
        setEditingId(team.id);
    }

    return (
        <main className="p-6 max-w-5xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6">Teams</h1>

            <div className="flex gap-2 mb-6">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team Name" className="p-2 rounded bg-gray-800 border border-gray-700 w-full" />
                <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="p-2 rounded bg-gray-800 border border-gray-700 w-full" />
                <button onClick={addOrUpdateTeam} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                    {editingId ? 'Update' : 'Add'}
                </button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {teams.map((team) => (
                    <div key={team.id} className="bg-gray-900 p-4 rounded shadow space-y-2">
                        <h2 className="text-xl font-semibold">{team.name}</h2>
                        <p className="text-sm text-gray-400">Country: {team.country}</p>
                        <div className="space-x-2">
                            <button onClick={() => editTeam(team)} className="px-3 py-1 bg-blue-600 rounded">Edit</button>
                            <button onClick={() => deleteTeam(team.id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>

                            {/* ✅ Link to Dashboard */}
                            <Link href={`/teams/${team.id}`}>
                                <button className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">View Dashboard</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
