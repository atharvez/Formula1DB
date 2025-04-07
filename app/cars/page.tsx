"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function CarsPage() {
    const [cars, setCars] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [form, setForm] = useState({ model: "", engine: "", team_id: "" });

    const fetchCars = async () => {
        const { data } = await supabase
            .from("cars")
            .select("*, teams(name)");
        setCars(data || []);
    };

    const fetchTeams = async () => {
        const { data } = await supabase.from("teams").select("id, name");
        setTeams(data || []);
    };

    const createCar = async () => {
        if (!form.model || !form.engine || !form.team_id) {
            alert("Please fill in all fields.");
            return;
        }

        const { error } = await supabase.from("cars").insert([form]);

        if (error) {
            alert("Failed to add car: " + error.message);
            return;
        }

        setForm({ model: "", engine: "", team_id: "" });
        fetchCars();
    };

    const deleteCar = async (id: string) => {
        await supabase.from("cars").delete().eq("id", id);
        fetchCars();
    };

    useEffect(() => {
        fetchCars();
        fetchTeams();
    }, []);

    return (
        <div className="min-h-screen bg-[url('/carbon-fiber.png')] bg-repeat text-white font-sora py-12 px-6">
            <motion.h1
                className="text-center text-4xl md:text-5xl font-bold text-red-500 mb-12 tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                F1 CARS
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-black/70 backdrop-blur-md p-6 md:p-10 rounded-2xl mb-16 border border-red-600 max-w-5xl mx-auto"
            >
                <h2 className="text-2xl font-semibold mb-6 text-white text-center">Add New Car</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <input
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Model"
                        value={form.model}
                        onChange={(e) => setForm({ ...form, model: e.target.value })}
                    />
                    <input
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Engine"
                        value={form.engine}
                        onChange={(e) => setForm({ ...form, engine: e.target.value })}
                    />
                    <select
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={form.team_id}
                        onChange={(e) => setForm({ ...form, team_id: e.target.value })}
                    >
                        <option value="">Select Team</option>
                        {teams.map((team) => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    className="mt-6 bg-red-600 hover:bg-red-700 transition text-white px-6 py-2 rounded-full block mx-auto"
                    onClick={createCar}
                >
                    ➕ Add Car
                </button>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {cars.map((car, i) => (
                    <motion.div
                        key={car.id}
                        className="bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-red-600 hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <h2 className="text-2xl font-bold text-red-500 mb-1">{car.model}</h2>
                        <p className="text-gray-400">Engine: <span className="text-white">{car.engine}</span></p>
                        <p className="text-gray-400">Team: <span className="text-white">{car.teams?.name || "N/A"}</span></p>
                        <button
                            className="mt-4 text-sm bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded"
                            onClick={() => deleteCar(car.id)}
                        >
                            Delete
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
