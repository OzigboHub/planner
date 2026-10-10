"use client";

import React from "react";
import Image from "next/image";
import { usePlanner } from "../../context/PlannerContext";
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  Users,
  Compass,
  FileText,
  ChevronDown,
  Gift,
} from "lucide-react";

export const GuestMemorialHero: React.FC = () => {
  const { settings, financialMetrics } = usePlanner();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white border-b border-white/10">
      {/* Background Hero Banner */}
      <div className="absolute inset-0 z-0 opacity-35 mix-blend-luminosity">
        <Image
          src="/memorial_banner.jpg"
          alt="Memorial Flowers Banner"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
        {/* Memorial Medallion */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 opacity-60 blur-md group-hover:opacity-100 transition duration-500" />
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-amber-400/80 shadow-2xl bg-slate-900">
              <Image
                src="/memorial_portrait.jpg"
                alt={settings.honoree}
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-2 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-slate-900">
              <Heart className="w-4 h-4 fill-slate-950" />
            </div>
          </div>
        </div>

        {/* Solemn Header Text */}
        <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-amber-400 mb-2">
          In Loving & Blessed Memory of
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 drop-shadow-sm font-serif">
          {settings.honoree}
        </h1>
        <p className="italic text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-light mb-8 px-4 border-l-2 border-r-2 border-amber-500/40 py-1">
          &ldquo;{settings.honoreeEpitaph}&rdquo;
        </p>

        {/* Event Meta Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto mb-10 text-left">
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Date of Service</p>
                <p className="text-sm font-bold text-white">Friday, 30 October 2026</p>
                <p className="text-[11px] text-amber-300">One-Day Solemn Burial</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Commencement</p>
                <p className="text-sm font-bold text-white">09:00 AM Mortuary</p>
                <p className="text-[11px] text-blue-300">10:00 AM Funeral Mass</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Primary Location</p>
                <p className="text-sm font-bold text-white">Eidenu, Irrua, Edo State</p>
                <p className="text-[11px] text-emerald-300">St. Matthew Parish & Akhabue Compound</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick CTA Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => scrollTo("section-about")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
          >
            <FileText className="w-4 h-4" />
            <span>About Pa Festus</span>
          </button>

          <button
            onClick={() => scrollTo("section-programme")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-medium text-sm border border-white/10 transition-colors"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Burial Programme</span>
          </button>

          <button
            onClick={() => scrollTo("section-venues")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-medium text-sm border border-white/10 transition-colors"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Directions & Venues</span>
          </button>

          <button
            onClick={() => scrollTo("section-condolences")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-medium text-sm border border-white/10 transition-colors"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Memorial Tributes</span>
          </button>

          <button
            onClick={() => scrollTo("section-support")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-medium text-sm border border-white/10 transition-colors"
          >
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Support the Family</span>
          </button>
        </div>
      </div>
    </div>
  );
};
