"use client";
import FleetStatusStacked from "@/charts/fleet/FleetStatusStacked";
import SpeedHistogram from "@/charts/fleet/SpeedingHistogram";
import TripTimeline from "@/charts/fleet/TripTimeline";

export default function FleetOpsDashboard() {
  return (
    <div className="grid grid-cols-12 gap-6 p-8">
      
      <div className="col-span-12">
        <h1 className="text-2xl font-bold">Fleet Operations</h1>
        <p className="text-gray-500">Live vehicle health & trip performance</p>
      </div>

      <div className="col-span-6 glass p-6">
        <FleetStatusStacked />
      </div>

      <div className="col-span-6 glass p-6">
        <SpeedHistogram />
      </div>

      <div className="col-span-6 glass p-6">
        <TripTimeline />
      </div>

    </div>
  );
}
