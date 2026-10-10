"use client";

import React, { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { CheckCircle, Send, Users } from "lucide-react";

export const GuestRSVP: React.FC = () => {
  const { addRSVP } = usePlanner();

  const [guestName, setGuestName] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [attendance, setAttendance] = useState<"Attending In-Person" | "Attending Virtually / In Spirit" | "Regrets">(
    "Attending In-Person"
  );
  const [partySize, setPartySize] = useState(1);
  const [dietaryOrNotes, setDietaryOrNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !phoneOrEmail.trim()) return;

    addRSVP({
      guestName: guestName.trim(),
      phoneOrEmail: phoneOrEmail.trim(),
      attendance,
      partySize: attendance === "Attending In-Person" ? Number(partySize) : 0,
      dietaryOrNotes: dietaryOrNotes.trim() || undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      setGuestName("");
      setPhoneOrEmail("");
      setDietaryOrNotes("");
      setPartySize(1);
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="section-rsvp" className="py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* RSVP Explanatory Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            Guest Attendance Confirmation
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Guest RSVP
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            We will be deeply honored by your presence to celebrate the blessed life and legacy of our dear father, <strong>Pa Festus Okoruwa Akhabue</strong>.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kindly confirm your attendance using the form so our reception team can ensure you and your accompanying guests are warmly welcomed and comfortably accommodated in Eidenu, Irrua.
          </p>
        </div>

        {/* RSVP Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Thank You, RSVP Received!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Your attendance response has been recorded by the Akhabue family coordination team. We look forward to welcoming you in Eidenu, Irrua.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Full Name / Family Delegation *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Chief & Mrs. Anthony Akhigbe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Phone Number or Email *
                    </label>
                    <input
                      type="text"
                      required
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      placeholder="e.g. 0803 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Attendance Status
                    </label>
                    <select
                      value={attendance}
                      onChange={(e) => setAttendance(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                    >
                      <option value="Attending In-Person">Attending In-Person in Irrua</option>
                      <option value="Attending Virtually / In Spirit">Attending Virtually / In Spirit</option>
                      <option value="Regrets">Sending Condolences (Regrets)</option>
                    </select>
                  </div>
                </div>

                {attendance === "Attending In-Person" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Total Party Size (Including Self & Companions)
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5, 8].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setPartySize(num)}
                          className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                            partySize === num
                              ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          {num === 8 ? "8+" : num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Travel Notes / Message to Secretariat (Optional)
                  </label>
                  <input
                    type="text"
                    value={dietaryOrNotes}
                    onChange={(e) => setDietaryOrNotes(e.target.value)}
                    placeholder="e.g. Arriving from Lagos via Benin; requesting VIP parking"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Attendance Confirmation</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
