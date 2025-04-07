"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TeamsPage() {
    const [teams, setTeams] = useState<any[]>([]);
    const [form, setForm] = useState({ name: "", country: "", principal: "", founded_year: "" });

    const fetchTeams = async () => {
        const { data } = await supabase.from("teams").select("*");
        setTeams(data || []);
    };

    const createTeam = async () => {
        await supabase.from("teams").insert([form]);
        setForm({ name: "", country: "", principal: "", founded_year: "" });
        fetchTeams();
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    return (
        <div className="min-h-screen bg-[url('/carbon-fiber.png')] bg-repeat text-white font-[Racing Sans One]">
            <main className="p-8">
                <h1 className="text-center text-4xl font-bold text-red-600 tracking-widest mb-10">Teams</h1>

                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-black/70 backdrop-blur-sm p-6 rounded-xl mb-10 border border-gray-700"
                >
                    <h2 className="text-xl font-semibold mb-4 text-white">Add a New Team</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input
                            className="bg-gray-900 border border-gray-700 p-2 rounded text-white"
                            placeholder="Team Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                        <input
                            className="bg-gray-900 border border-gray-700 p-2 rounded text-white"
                            placeholder="Country"
                            value={form.country}
                            onChange={(e) => setForm({ ...form, country: e.target.value })}
                        />
                        <input
                            className="bg-gray-900 border border-gray-700 p-2 rounded text-white"
                            placeholder="Principal"
                            value={form.principal}
                            onChange={(e) => setForm({ ...form, principal: e.target.value })}
                        />
                        <input
                            className="bg-gray-900 border border-gray-700 p-2 rounded text-white"
                            placeholder="Founded Year"
                            type="number"
                            value={form.founded_year}
                            onChange={(e) => setForm({ ...form, founded_year: e.target.value })}
                        />
                    </div>
                    <button className="mt-4 bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded" onClick={createTeam}>
                        Add Team
                    </button>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teams.map((team, i) => (
                        <Link key={team.id} href={`/teams/${team.id}`}>
                            <motion.div
                                className="cursor-pointer bg-black/70 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-800 hover:shadow-red-600 transition"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <h2 className="text-2xl font-bold text-red-500 mb-2">{team.name}</h2>
                                <p className="text-gray-300">Country: <span className="text-white">{team.country}</span></p>
                                <p className="text-gray-300">Principal: <span className="text-white">{team.principal}</span></p>
                                <p className="text-gray-300">Founded: <span className="text-white">{team.founded_year}</span></p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
