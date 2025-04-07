"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function RacesPage() {
    const [races, setRaces] = useState<any[]>([]);
    const [circuits, setCircuits] = useState<any[]>([]);
    const [form, setForm] = useState({ name: "", date: "", circuit_id: "" });

    const fetchRaces = async () => {
        const { data } = await supabase
            .from("races")
            .select("*, circuits(name)")
            .order("date", { ascending: true });

        setRaces(data || []);
    };

    const fetchCircuits = async () => {
        const { data } = await supabase.from("circuits").select("id, name");
        setCircuits(data || []);
    };

    const createRace = async () => {
        if (!form.name || !form.date || !form.circuit_id) {
            alert("Please fill in all fields.");
            return;
        }

        const { error } = await supabase.from("races").insert([form]);
        if (error) {
            alert("Failed to add race: " + error.message);
            return;
        }

        setForm({ name: "", date: "", circuit_id: "" });
        fetchRaces();
    };

    const deleteRace = async (id: string) => {
        await supabase.from("races").delete().eq("id", id);
        fetchRaces();
    };

    useEffect(() => {
        fetchRaces();
        fetchCircuits();
    }, []);

    return (
        <div className="min-h-screen bg-[url('/carbon-fiber.png')] bg-repeat text-white font-sora py-12 px-6">
            <motion.h1
                className="text-center text-4xl md:text-5xl font-bold text-red-500 mb-12 tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                F1 RACES
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-black/70 backdrop-blur-md p-6 md:p-10 rounded-2xl mb-16 border border-red-600 max-w-5xl mx-auto"
            >
                <h2 className="text-2xl font-semibold mb-6 text-white text-center">Add New Race</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <input
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Race Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        type="date"
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                    <select
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={form.circuit_id}
                        onChange={(e) => setForm({ ...form, circuit_id: e.target.value })}
                    >
                        <option value="">Select Circuit</option>
                        {circuits.map((circuit) => (
                            <option key={circuit.id} value={circuit.id}>{circuit.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    className="mt-6 bg-red-600 hover:bg-red-700 transition text-white px-6 py-2 rounded-full block mx-auto"
                    onClick={createRace}
                >
                    ➕ Add Race
                </button>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {races.map((race, i) => (
                    <motion.div
                        key={race.id}
                        className="bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-red-600 hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <h2 className="text-2xl font-bold text-red-500 mb-1">{race.name}</h2>
                        <p className="text-gray-400">Date: <span className="text-white">{new Date(race.date).toDateString()}</span></p>
                        <p className="text-gray-400">Circuit: <span className="text-white">{race.circuits?.name || "Unknown"}</span></p>
                        <button
                            className="mt-4 text-sm bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded"
                            onClick={() => deleteRace(race.id)}
                        >
                            Delete
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
