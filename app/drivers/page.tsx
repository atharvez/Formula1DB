"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function DriversPage() {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        nationality: "",
        team_id: ""
    });

    const fetchDrivers = async () => {
        const { data } = await supabase.from("drivers").select("*");
        setDrivers(data || []);
    };

    const fetchTeams = async () => {
        const { data } = await supabase.from("teams").select("id, name");
        setTeams(data || []);
    };

    const createDriver = async () => {
        await supabase.from("drivers").insert([form]);
        setForm({ first_name: "", last_name: "", nationality: "", team_id: "" });
        fetchDrivers();
    };

    const deleteDriver = async (id: string) => {
        await supabase.from("drivers").delete().eq("id", id);
        fetchDrivers();
    };

    useEffect(() => {
        fetchDrivers();
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
                F1 DRIVERS
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-black/70 backdrop-blur-md p-6 md:p-10 rounded-2xl mb-16 border border-red-600 max-w-5xl mx-auto"
            >
                <h2 className="text-2xl font-semibold mb-6 text-white text-center">Add New Driver</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="First Name"
                        value={form.first_name}
                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    />
                    <input
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Last Name"
                        value={form.last_name}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    />
                    <input
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Nationality"
                        value={form.nationality}
                        onChange={(e) => setForm({ ...form, nationality: e.target.value })}
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
                    onClick={createDriver}
                >
                    ➕ Add Driver
                </button>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {drivers.map((driver, i) => (
                    <motion.div
                        key={driver.id}
                        className="bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-red-600 hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <h2 className="text-2xl font-bold text-red-500 mb-1">
                            {driver.first_name} {driver.last_name}
                        </h2>
                        <p className="text-gray-400">Nationality: <span className="text-white">{driver.nationality}</span></p>
                        <p className="text-gray-400">Team ID: <span className="text-white">{driver.team_id}</span></p>
                        <button
                            className="mt-4 text-sm bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded"
                            onClick={() => deleteDriver(driver.id)}
                        >
                            Delete
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
