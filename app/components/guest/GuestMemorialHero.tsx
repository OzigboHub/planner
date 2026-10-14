"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlanner } from "../../context/PlannerContext";
import { Calendar, Clock, MapPin } from "lucide-react";

export const GuestMemorialHero: React.FC = () => {
  const {
    settings,
    financialMetrics,
    isInvitedGuest,
    setIsShareModalOpen,
    isFamilyAuthenticated,
    setCurrentView,
    setIsAuthModalOpen,
  } = usePlanner();

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
          src="/memorial_banner.png"
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
                src="/pa_festus_portrait.png"
                alt={settings.honoree}
                fill
                priority
                unoptimized
                className="object-cover object-[center_16%]"
              />
            </div>
          </div>
        </div>

        {/* Invited Guest Greeting Badge */}
        {isInvitedGuest && (
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-5 shadow-lg shadow-amber-500/10">
            <span>Official Guest Invitation • Cordially Invited by the Akhabue Family</span>
          </div>
        )}

        {/* Solemn Header Text */}
        <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-amber-400 mb-2">
          In Loving &amp; Blessed Memory of
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 drop-shadow-sm font-serif">
          {settings.honoree}
        </h1>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4">
          <span>Aged 74 Years</span>
        </div>
        <p className="italic text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-light mb-8 px-4 border-l-2 border-r-2 border-amber-500/40 py-1">
          &ldquo;{settings.honoreeEpitaph}&rdquo;
        </p>

        {/* Event Meta Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto mb-6 text-left">
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-colors">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Dates of Service</p>
            <p className="text-sm font-bold text-white mt-1">29th &amp; 30th October 2026</p>
            <p className="text-[11px] text-amber-300 mt-0.5">Vigil Mass &amp; Funeral Service</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-colors">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Liturgical Hours</p>
            <p className="text-sm font-bold text-white mt-1">Oct 29: 5:00 PM Vigil Mass</p>
            <p className="text-[11px] text-blue-300 mt-0.5">Oct 30: 11:00 AM Funeral Mass</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-colors">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Church Venue</p>
            <p className="text-sm font-bold text-white mt-1">St Matthew Catholic Church</p>
            <p className="text-[11px] text-emerald-300 mt-0.5">Eidenu Irrua, Edo State</p>
          </div>
        </div>

        {/* Highlighted Liturgical Mass Schedule for Invite Page */}
        <div className="max-w-3xl mx-auto mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-amber-500/10 border border-amber-400/30 text-left shadow-lg">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 border border-amber-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Liturgical Mass Schedule &amp; Venues
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Confirmed Timetable
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs text-slate-200">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Thursday, 29th Oct 2026 • 5:00 PM</span>
                  </div>
                  <p className="text-white font-semibold">Catholic Vigil Mass</p>
                  <p className="text-slate-300 text-[11px]">
                    At <strong className="text-amber-300">St Matthew Catholic Church, Eidenu Irrua</strong>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Friday, 30th Oct 2026 • 11:00 AM</span>
                  </div>
                  <p className="text-white font-semibold">Solemn Funeral Mass</p>
                  <p className="text-slate-300 text-[11px]">
                    At <strong className="text-blue-300">St Matthew Catholic Church, Eidenu Irrua</strong>, followed by Interment &amp; Reception at Akhabue Residence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick CTA Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href="/about"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
          >
            About Pa Festus
          </Link>

          <Link
            href="/programme"
            className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-medium text-sm border border-white/10 transition-colors"
          >
            Burial Programme
          </Link>

          <Link
            href="/order-of-mass"
            className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 font-semibold text-sm border border-amber-500/30 transition-colors"
          >
            Order of Mass
          </Link>

          <button
            onClick={() => scrollTo("section-venues")}
            className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-medium text-sm border border-white/10 transition-colors cursor-pointer"
          >
            Directions &amp; Venues
          </button>

          <Link
            href="/tributes"
            className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-medium text-sm border border-white/10 transition-colors"
          >
            Memorial Tributes
          </Link>

          <Link
            href="/support"
            className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-medium text-sm border border-white/10 transition-colors"
          >
            Support the Family
          </Link>

          {!isInvitedGuest && (
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 font-bold text-sm border border-amber-500/40 transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              Invite Guest
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
