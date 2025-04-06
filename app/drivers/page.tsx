'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DriversPage() {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [country, setCountry] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchDrivers();
        fetchTeams();
    }, []);

    async function fetchDrivers() {
        const { data, error } = await supabase
            .from('drivers')
            .select('*, teams(name)'); // joining teams table
        if (error) {
            console.error('Error fetching drivers:', error);
        } else {
            setDrivers(data || []);
        }
    }

    async function fetchTeams() {
        const { data, error } = await supabase.from('teams').select('*');
        if (error) {
            console.error('Error fetching teams:', error);
        } else {
            setTeams(data || []);
        }
    }

    async function addOrUpdateDriver() {
        if (!name || !selectedTeamId || !country) return;

        const payload = {
            name,
            team_id: selectedTeamId,
            country,
        };

        if (editingId) {
            await supabase.from('drivers').update(payload).eq('id', editingId);
        } else {
            await supabase.from('drivers').insert(payload);
        }

        resetForm();
        fetchDrivers();
    }

    function resetForm() {
        setName('');
        setSelectedTeamId(null);
        setCountry('');
        setEditingId(null);
    }

    async function deleteDriver(id: number) {
        await supabase.from('drivers').delete().eq('id', id);
        fetchDrivers();
    }

    function editDriver(driver: any) {
        setName(driver.name);
        setSelectedTeamId(driver.team_id);
        setCountry(driver.country);
        setEditingId(driver.id);
    }

    return (
        <main className="p-6 max-w-3xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6">Drivers</h1>

            <div className="flex flex-wrap gap-2 mb-4">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Driver Name"
                    className="p-2 rounded bg-gray-800 border border-gray-700 w-full sm:w-auto flex-1"
                />
                <select
                    value={selectedTeamId ?? ''}
                    onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                    className="p-2 rounded bg-gray-800 border border-gray-700 w-full sm:w-auto flex-1 text-white"
                >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.name}
                        </option>
                    ))}
                </select>
                <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="p-2 rounded bg-gray-800 border border-gray-700 w-full sm:w-auto flex-1"
                />
                <button
                    onClick={addOrUpdateDriver}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    {editingId ? 'Update' : 'Add'}
                </button>
            </div>

            <ul className="space-y-3">
                {drivers.map((driver) => (
                    <li
                        key={driver.id}
                        className="flex justify-between items-center bg-gray-900 p-4 rounded shadow"
                    >
                        <span>
                            {driver.name} - {driver.teams?.name || 'No Team'} ({driver.country})
                        </span>
                        <div className="space-x-2">
                            <button
                                onClick={() => editDriver(driver)}
                                className="px-3 py-1 bg-blue-600 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteDriver(driver.id)}
                                className="px-3 py-1 bg-red-600 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}
