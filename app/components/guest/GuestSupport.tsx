"use client";

import React, { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { Heart, Building2, Copy, Check, ShieldCheck, HelpCircle } from "lucide-react";

export const GuestSupport: React.FC = () => {
  const { settings } = usePlanner();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  if (!settings.publicDonationsEnabled) {
    return null;
  }

  return (
    <section id="section-support" className="py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
          Voluntary Family Support & Condolences
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
          Support the Bereaved Family
        </h2>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          For friends, associates, and extended relations wishing to send voluntary condolence support directly to the burial planning committee, authorized Nigerian bank account details are provided below.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Designated Bank Account</p>
              <h3 className="text-base font-bold text-white">
                {settings.bankDetails.bankName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Family Verified</span>
          </div>
        </div>

        <div className="space-y-4 text-left">
          {/* Account Number */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Account Number
              </p>
              <p className="text-2xl font-mono font-extrabold text-amber-400 tracking-wider">
                {settings.bankDetails.accountNumber}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard("acc", settings.bankDetails.accountNumber)}
              className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              {copiedField === "acc" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedField === "acc" ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          {/* Account Name */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Account Name
              </p>
              <p className="text-sm font-bold text-white">
                {settings.bankDetails.accountName}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard("name", settings.bankDetails.accountName)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs"
              title="Copy Account Name"
            >
              {copiedField === "name" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Transfer Reference */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">Narration / Reference: </span>
              <span className="font-mono text-amber-300 font-semibold">{settings.bankDetails.referenceCode}</span>
            </div>
            <button
              onClick={() => copyToClipboard("ref", settings.bankDetails.referenceCode)}
              className="text-xs text-slate-400 hover:text-white"
            >
              {copiedField === "ref" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Committee Transparency Note */}
        <div className="mt-6 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p>
            All voluntary transfers are logged and reconciled by the committee treasurer (Barr. Jude Akhabue) for family accountability. In accordance with family privacy guidelines, individual guest donation amounts are held in strict confidence.
          </p>
        </div>
      </div>
    </section>
  );
};
