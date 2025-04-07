"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function TeamDashboard() {
    const { id } = useParams();
    const [team, setTeam] = useState<any>(null);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [cars, setCars] = useState<any[]>([]);

    const fetchTeamData = async () => {
        const { data: teamData } = await supabase.from("teams").select("*").eq("id", id).single();
        setTeam(teamData);

        const { data: driverData } = await supabase.from("drivers").select("*").eq("team_id", id);
        setDrivers(driverData || []);

        const { data: carData } = await supabase.from("cars").select("*").eq("team_id", id);
        setCars(carData || []);
    };

    useEffect(() => {
        if (id) fetchTeamData();
    }, [id]);

    if (!team) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-[url('/carbon-fiber.png')] bg-repeat text-white font-sora p-8">
            <motion.h1
                className="text-4xl text-center text-red-600 font-bold tracking-wide mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                {team.name} Team Dashboard
            </motion.h1>

            <div className="bg-black/70 backdrop-blur-sm p-6 rounded-xl border border-red-700 mb-8">
                <p><span className="text-red-500 font-semibold">Country:</span> {team.country}</p>
                <p><span className="text-red-500 font-semibold">Principal:</span> {team.principal}</p>
                <p><span className="text-red-500 font-semibold">Founded Year:</span> {team.founded_year}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-black/60 p-4 rounded-xl border border-gray-600">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Drivers</h2>
                    {drivers.map((driver) => (
                        <div key={driver.id} className="mb-2">
                            <p>{driver.first_name} {driver.last_name} </p>
                        </div>
                    ))}
                    {drivers.length === 0 && <p>No drivers listed.</p>}
                </div>

                <div className="bg-black/60 p-4 rounded-xl border border-gray-600">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Cars</h2>
                    {cars.map((car) => (
                        <div key={car.id} className="mb-2">
                            <p>{car.model} – {car.engine}</p>
                        </div>
                    ))}
                    {cars.length === 0 && <p>No cars listed.</p>}
                </div>
            </div>
        </div>
    );
}
