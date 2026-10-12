"use client";

import React from "react";
import Image from "next/image";
import { usePlanner } from "../../context/PlannerContext";

export const GuestAbout: React.FC = () => {
  const { settings } = usePlanner();

  const legacyPillars = [
    {
      number: "01",
      title: "Devout Catholic Faith",
      description:
        "A devout parishioner and dedicated elder at St. Matthew Catholic Church, Eidenu, Irrua. Known for his steadfast piety, active participation in parish life, and unfailing generosity to the church and clergy under Rev. Fr. Nicholas Oboh.",
    },
    {
      number: "02",
      title: "Exemplary Patriarch",
      description:
        "A loving, disciplined, and nurturing father who raised accomplished children with deep Christian moral values, mutual unity, and commitment to education and hard work.",
    },
    {
      number: "03",
      title: "Community Pillar & Peacemaker",
      description:
        "Revered across Eidenu and the wider Esan community for his wisdom, impartiality, and gentle counsel. A respected arbiter whose integrity earned him the goodwill of elders, youth, and traditional leaders.",
    },
  ];

  return (
    <section id="section-about" className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <span>Life, Faith & Legacy</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
          About {settings.honoree}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
          Celebrating a long, fruitful, and blessed earthly journey dedicated to the service of God, love of family, and upliftment of his beloved Eidenu community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
        {/* Left: Framed Memorial Photo with Decorative Accents */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden p-2 bg-gradient-to-b from-amber-400/40 via-slate-800 to-slate-900 border border-amber-400/30 shadow-2xl">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-950">
              <Image
                src="/pa_festus_portrait.png"
                alt={settings.honoree}
                fill
                priority
                unoptimized
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-center">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                 Festus Okoruwa Akhabue
                </p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Beloved Father, Grandfather & Catholic Patriarch
                </p>
                <p className="text-[10px] text-emerald-400 font-mono mt-1">
                  Eidenu, Irrua • Edo State, Nigeria
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Narrative Biography & Catholic Epitaph */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900/80 rounded-2xl p-6 sm:p-7 border border-white/10 space-y-4 shadow-xl">
            <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
              A Life of Grace & Purpose
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              <strong> Festus Okoruwa Akhabue</strong> was an embodiment of grace, quiet strength, and devout Christian discipleship. Born in the vibrant community of <strong>Eidenu, Irrua</strong>, he lived an honorable life rooted in humility, unwavering hard work, and deep reverence for the Almighty.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Throughout his life in Edo State, Festus stood as an unshakeable moral compass. At <strong>St. Matthew Catholic Church</strong>, he was a regular communicant, a quiet benefactor of parish projects, and a trusted supporter of the clergy. In his family, he led not with words alone, but with the shining example of personal righteousness, self-sacrifice, and warm hospitality.
            </p>
            
            <div className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 text-slate-200 italic text-xs sm:text-sm">
              &ldquo;I have fought the good fight, I have finished the race, I have kept the faith. Now there is in store for me the crown of righteousness.&rdquo;
              <span className="block not-italic font-bold text-amber-300 text-xs mt-1.5">
                — 2 Timothy 4:7-8
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars of Legacy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {legacyPillars.map((pillar, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-amber-400/30 transition-all space-y-2.5"
          >
            <span className="text-xs font-mono font-bold text-amber-400/80">
              {pillar.number}
            </span>
            <h3 className="text-base font-bold text-white">
              {pillar.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
