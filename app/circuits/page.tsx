"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function CircuitsPage() {
    const [circuits, setCircuits] = useState<any[]>([]);
    const [form, setForm] = useState({ name: "", location: "", track_length: "" });

    const fetchCircuits = async () => {
        const { data } = await supabase.from("circuits").select("*");
        setCircuits(data || []);
    };

    const createCircuit = async () => {
        if (!form.name || !form.location || !form.track_length) {
            alert("Please fill in all fields.");
            return;
        }

        const { error } = await supabase.from("circuits").insert([form]);

        if (error) {
            alert("Error adding circuit: " + error.message);
            return;
        }

        setForm({ name: "", location: "", track_length: "" });
        fetchCircuits();
    };

    const deleteCircuit = async (id: string) => {
        await supabase.from("circuits").delete().eq("id", id);
        fetchCircuits();
    };

    useEffect(() => {
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
                F1 CIRCUITS
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-black/70 backdrop-blur-md p-6 md:p-10 rounded-2xl mb-16 border border-red-600 max-w-5xl mx-auto"
            >
                <h2 className="text-2xl font-semibold mb-6 text-white text-center">Add New Circuit</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <input
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Circuit Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Location"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                    <input
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Track Length (km)"
                        value={form.track_length}
                        onChange={(e) => setForm({ ...form, track_length: e.target.value })}
                    />
                </div>
                <button
                    className="mt-6 bg-red-600 hover:bg-red-700 transition text-white px-6 py-2 rounded-full block mx-auto"
                    onClick={createCircuit}
                >
                    ➕ Add Circuit
                </button>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {circuits.map((circuit, index) => (
                    <motion.div
                        key={circuit.id}
                        className="bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-red-600 hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <h3 className="text-2xl font-bold text-red-500 mb-2">{circuit.name}</h3>
                        <p className="text-gray-300">📍 Location: <span className="text-white">{circuit.location}</span></p>
                        <p className="text-gray-300">🛣️ Track Length: <span className="text-white">{circuit.track_length} km</span></p>
                        <button
                            className="mt-4 text-sm bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded"
                            onClick={() => deleteCircuit(circuit.id)}
                        >
                            Delete
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
