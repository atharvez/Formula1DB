"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function ResultsPage() {
    const [results, setResults] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [races, setRaces] = useState<any[]>([]);
    const [form, setForm] = useState({
        driver_id: "",
        race_id: "",
        position: "",
        fastest_lap: false,
        points: 0,
    });

    const pointsTable: Record<number, number> = {
        1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1
    };

    const fetchResults = async () => {
        const { data, error } = await supabase
            .from("results")
            .select("*, drivers(first_name, last_name), races(name, circuits(name))");
        if (error) console.error("Error fetching results:", error);
        setResults(data || []);
    };

    const fetchDrivers = async () => {
        const { data, error } = await supabase.from("drivers").select("id, first_name, last_name");
        if (error) console.error("Error fetching drivers:", error);
        setDrivers(data || []);
    };

    const fetchRaces = async () => {
        const { data, error } = await supabase.from("races").select("id, name");
        if (error) console.error("Error fetching races:", error);
        setRaces(data || []);
    };

    const calculatePoints = (position: number, fastestLap: boolean) => {
        let base = pointsTable[position] || 0;
        if (fastestLap && position <= 10) base += 1;
        return base;
    };

    const createResult = async () => {
        const position = parseInt(form.position);
        if (!form.driver_id || !form.race_id || isNaN(position)) {
            alert("Please fill all fields properly.");
            return;
        }

        const points = calculatePoints(position, form.fastest_lap);

        const { error } = await supabase.from("results").insert([
            {
                ...form,
                position,
                points,
            },
        ]);

        if (error) {
            alert("Failed to add result: " + error.message);
            return;
        }

        setForm({
            driver_id: "",
            race_id: "",
            position: "",
            fastest_lap: false,
            points: 0,
        });

        fetchResults();
    };

    const deleteResult = async (id: string) => {
        await supabase.from("results").delete().eq("id", id);
        fetchResults();
    };

    useEffect(() => {
        fetchResults();
        fetchDrivers();
        fetchRaces();
    }, []);

    return (
        <div className="min-h-screen bg-[url('/carbon-fiber.png')] bg-repeat text-white font-sora py-12 px-6">
            <motion.h1
                className="text-center text-4xl md:text-5xl font-bold text-red-500 mb-12 tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                RACE RESULTS
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-black/70 backdrop-blur-md p-6 md:p-10 rounded-2xl mb-16 border border-red-600 max-w-5xl mx-auto"
            >
                <h2 className="text-2xl font-semibold mb-6 text-white text-center">Add New Result</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <select
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white"
                        value={form.driver_id}
                        onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
                    >
                        <option value="">Select Driver</option>
                        {drivers.map((driver) => (
                            <option key={driver.id} value={driver.id}>
                                {driver.first_name} {driver.last_name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white"
                        value={form.race_id}
                        onChange={(e) => setForm({ ...form, race_id: e.target.value })}
                    >
                        <option value="">Select Race</option>
                        {races.map((race) => (
                            <option key={race.id} value={race.id}>
                                {race.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white"
                        placeholder="Position"
                        value={form.position}
                        onChange={(e) => setForm({ ...form, position: e.target.value })}
                    />

                    <label className="text-white flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.fastest_lap}
                            onChange={(e) => setForm({ ...form, fastest_lap: e.target.checked })}
                        />
                        Fastest Lap
                    </label>
                </div>
                <button
                    className="mt-6 bg-red-600 hover:bg-red-700 transition text-white px-6 py-2 rounded-full block mx-auto"
                    onClick={createResult}
                >
                    ➕ Add Result
                </button>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {results.map((result, i) => (
                    <motion.div
                        key={result.id}
                        className="bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-red-600 hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <h2 className="text-xl font-bold text-red-500 mb-2">
                            {result.drivers?.first_name} {result.drivers?.last_name}
                        </h2>
                        <p className="text-gray-300 mb-1">Race: <span className="text-white">{result.races?.name}</span></p>
                        <p className="text-gray-300 mb-1">Circuit: <span className="text-white">{result.races?.circuits?.name || "N/A"}</span></p>
                        <p className="text-gray-300 mb-1">Position: <span className="text-white">{result.position}</span></p>
                        <p className="text-gray-300 mb-1">Points: <span className="text-white">{result.points}</span></p>
                        <p className="text-gray-300 mb-2">Fastest Lap: <span className="text-white">{result.fastest_lap ? "Yes" : "No"}</span></p>
                        <button
                            className="mt-2 text-sm bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded"
                            onClick={() => deleteResult(result.id)}
                        >
                            Delete
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
