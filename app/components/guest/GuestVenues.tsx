"use client";

import React, { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";

export const GuestVenues: React.FC = () => {
  const { settings } = usePlanner();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyAddress = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="section-venues" className="py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
          Locations & Logistics
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Venues, Directions & Parking
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Detailed addresses and transit guidance for Irrua, Edo State
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Church Venue Card */}
        <div className="bg-slate-900/80 rounded-2xl p-6 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Funeral Mass Venue
              </span>
              <span className="text-xs text-slate-400">10:00 AM – 12:00 PM</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {settings.churchVenue}
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Directly opposite Udowo Primary School, Eidenu, Irrua, Edo State
            </p>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 space-y-2 text-xs text-slate-300 mb-5">
              <p className="font-semibold text-amber-300">Key Landmarks & Transit Tips:</p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li><strong className="text-slate-200">Opposite Landmark:</strong> The church is situated directly opposite <strong>Udowo Primary School</strong>, Eidenu, Irrua.</li>
                <li><strong className="text-amber-300">Navigation Note:</strong> Because the church building is not yet mapped separately on Google Maps, navigate to <strong>Udowo Primary School</strong> via the map button below.</li>
                <li>Designated parish compound parking with traffic warden escorts.</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
            <button
              onClick={() => copyAddress("church", "St. Matthew Catholic Church, Opposite Udowo Primary School, Eidenu, Irrua, Edo State")}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors text-center"
            >
              {copiedId === "church" ? "Address Copied!" : "Copy Address"}
            </button>
            <a
              href="https://www.google.com/maps/place/Udowo+Primary+School/@6.7729349,6.2605227,17z/data=!3m1!4b1!4m6!3m5!1s0x104699bdf36aaaab:0x4192c0a50423e14b!8m2!3d6.7729296!4d6.2653936!16s%2Fg%2F11k4ybvk4r?entry=ttu&g_ep=EgoyMDI2MTAwNi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors shadow-md text-center"
            >
              Map (Opp. Udowo School)
            </a>
          </div>
        </div>

        {/* Family Residence Venue Card */}
        <div className="bg-slate-900/80 rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Interment & Reception Grounds
              </span>
              <span className="text-xs text-slate-400">01:15 PM – Evening</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {settings.residenceVenue}
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              {settings.residenceAddress}
            </p>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 space-y-2 text-xs text-slate-300 mb-5">
              <p className="font-semibold text-amber-300">Compound Access & Seating:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Turn off along the Eidenu road artery into Akhabue Crescent.</li>
                <li>Large white marquees and directional family signage visible from the junction.</li>
                <li>VIP parking inside perimeter compound; open secured parking on adjacent access avenue.</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
            <button
              onClick={() => copyAddress("residence", settings.residenceAddress)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors text-center"
            >
              {copiedId === "residence" ? "Address Copied!" : "Copy Address"}
            </button>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.residenceVenue + " Eidenu Irrua Edo State")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-slate-950 transition-colors text-center"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>

      {/* Security & Parking Notice */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
        <div>
          <p className="font-semibold text-white mb-0.5">Security & Guest Escort Protocol</p>
          <p className="text-slate-400">
            Designated security marshals and Catholic Youth Brigade ushers will direct vehicular traffic and canopy seating. For guests arriving from outside Edo State requiring hotel lodging recommendations in Irrua, Ekpoma or Uromi, please contact the secretariat at{" "}
            <span className="text-amber-300 font-medium">{settings.contactPhone}</span>.
          </p>
        </div>
      </div>
    </section>
  );
};
