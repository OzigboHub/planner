"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePlanner } from "../../context/PlannerContext";
import {
  Share2,
  Copy,
  Check,
  X,
  Heart,
  Calendar,
  MapPin,
  MessageCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const ShareInvitationModal: React.FC = () => {
  const {
    isShareModalOpen,
    setIsShareModalOpen,
    getInvitationUrl,
    settings,
  } = usePlanner();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isShareModalOpen) return null;

  const inviteUrl = getInvitationUrl();

  const invitationMessage = `🕊️ *In Loving Memory of ${settings.honoree}* (Aged 74 Years)\n\nThe Akhabue Family cordially invites you to the Funeral Ceremonies & Celebration of Life:\n\n📅 *Schedule of Arrangements:*\n• *Thursday, 29th October 2026 (5:00 PM):* Vigil Mass at St Matthew Catholic Church, Eidenu Irrua\n• *Friday, 30th October 2026 (11:00 AM):* Funeral Mass at St Matthew Catholic Church, Eidenu Irrua, followed by Interment (12:30 PM) & Reception until 6:30 PM at Akhabue Family Compound, Eidenu, Irrua\n\nKindly view the official order of ceremonies, directions, and leave tributes here:\n👉 ${inviteUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = inviteUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(invitationMessage);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement("textarea");
      input.value = invitationMessage;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(invitationMessage);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `In Loving Memory of ${settings.honoree}`,
          text: `You are cordially invited to the Funeral Ceremonies for ${settings.honoree}: Vigil Mass on Oct 29 at St Matthew Catholic Church, Eidenu Irrua, and Funeral Mass on Oct 30.`,
          url: inviteUrl,
        });
      } catch {
        // User dismissed share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl shadow-amber-500/10 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative p-6 pb-4 bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Invite Family & Friends</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Guest Link
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Share the official memorial programme & directions
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Social Invitation Card Preview */}
          <div className="rounded-2xl p-4 bg-slate-950 border border-white/10 shadow-inner">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                Invitation Card Preview
              </span>
            </div>

            <div className="flex gap-4 items-center bg-slate-900/90 p-3.5 rounded-xl border border-amber-500/20">
              <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 border-amber-400/70 shadow-md bg-slate-950 shrink-0">
                <Image
                  src="/pa_festus_portrait.png"
                  alt={settings.honoree}
                  fill
                  unoptimized
                  className="object-cover object-[center_16%]"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-400 mb-0.5">
                  Catholic Funeral & Reception
                </p>
                <h4 className="text-sm sm:text-base font-bold text-white truncate font-serif">
                  {settings.honoree}
                </h4>
                <p className="text-[11px] font-semibold text-amber-300">Aged 74 Years</p>
                <div className="mt-1 space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>29th – 30th October 2026</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">St Matthew Catholic Church, Eidenu Irrua &amp; Akhabue Compound</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invitation URL Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Official Invitation Web Link:
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs font-mono text-amber-300 truncate select-all">
                {inviteUrl}
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0 ${copiedLink
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950"
                  }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Guests opening this link will view the memorial timetable, venue directions, and tribute wall without internal planning tools.
            </p>
          </div>

          {/* Quick Sharing Options */}
          <div className="pt-2 border-t border-slate-800 space-y-2.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
              One-Click Share
            </span>

            {/* WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/30"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share via WhatsApp (with Full Invite Details)</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Copy Full Text */}
              <button
                onClick={handleCopyText}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Text Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy Full Message</span>
                  </>
                )}
              </button>

              {/* Native Mobile Share */}
              <button
                onClick={handleNativeShare}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Device Share Menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-amber-400" />
            <span>Honoring Late MrFestus Okoruwa Akhabue</span>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="text-slate-300 hover:text-white font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
