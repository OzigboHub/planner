"use client";

import React, { useState, useEffect } from "react";
import { usePlanner } from "../../context/PlannerContext";
import {
  Heart,
  Flame,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Quote,
  ShieldCheck,
  BookOpen,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Tribute {
  id: string;
  author_name: string;
  relationship: string;
  location: string;
  message: string;
  candle_lit: number;
  is_pinned?: number;
  created_at: string;
}

export const GuestCondolences: React.FC = () => {
  const { settings, isFamilyAuthenticated } = usePlanner();

  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Form inputs
  const [authorName, setAuthorName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [candleLit, setCandleLit] = useState(true);

  // Fetch real tributes from server SQLite/JSON database on mount
  const fetchTributes = async () => {
    try {
      const res = await fetch("/api/tributes");
      if (res.ok) {
        const data = await res.json();
        if (data.tributes && Array.isArray(data.tributes)) {
          setTributes(data.tributes);
        }
      }
    } catch (err) {
      console.error("Error loading tributes from database:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTributes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/tributes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author_name: authorName.trim(),
          relationship: relationship.trim() || "Family & Well-wisher",
          location: location.trim() || "Nigeria",
          message: message.trim(),
          candle_lit: candleLit,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.tribute) {
        setSuccessMessage(
          "Your tribute has been recorded and saved permanently to the memorial database."
        );
        // Prepend new tribute to local list
        setTributes((prev) => [data.tribute, ...prev]);
        setAuthorName("");
        setRelationship("");
        setLocation("");
        setMessage("");
        setTimeout(() => setSuccessMessage(""), 6000);
      } else {
        setErrorMessage(data.error || "Failed to save tribute. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting tribute:", err);
      setErrorMessage("Could not connect to database. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, author: string) => {
    if (!confirm(`Are you sure you want to permanently delete the tribute by "${author}" from the database?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/tributes?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTributes((prev) => prev.filter((t) => t.id !== id));
        setSuccessMessage(`Tribute by "${author}" has been deleted.`);
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(data.error || "Failed to delete tribute.");
      }
    } catch (err) {
      console.error("Error deleting tribute:", err);
      setErrorMessage("Could not connect to database to delete tribute.");
    }
  };

  const candleCount = tributes.filter((t) => t.candle_lit === 1).length;
  const INITIAL_VISIBLE_COUNT = 3;
  const visibleTributes = showAll ? tributes : tributes.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <section id="section-condolences" className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
      {/* Header with Live Stats from Database */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-white/10 gap-4">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>Living Memorial & Guestbook</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            Tributes & Condolences
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Real, permanent tributes and prayers celebrating the blessed life of <strong>{settings.honoree}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-medium">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span><strong>{candleCount}</strong> Memorial Candles</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span><strong>{tributes.length}</strong> Tributes Logged</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Real Submission Form (Saved to Database) */}
        <div className="lg:col-span-5 bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl sticky top-24">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Write & Publish Your Tribute
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            Every tribute submitted here is saved directly to the permanent memorial database for the family and all relations to read.
          </p>

          {successMessage && (
            <div className="p-3.5 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <span className="font-semibold text-rose-400">Error:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Full Name / Family Delegation *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Dr. Osas Akhabue or Chief Anthony Igbinedion"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Relationship / Role
                </label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="e.g. Son, In-law, Parishioner"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your City / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Eidenu, Benin, London"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Tribute Message & Prayers *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your prayers, memories, and words of honor celebrating the exemplary life of Pa Festus Okoruwa Akhabue..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="checkbox"
                id="candle-checkbox"
                checked={candleLit}
                onChange={(e) => setCandleLit(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-400 h-4 w-4 bg-slate-950"
              />
              <label htmlFor="candle-checkbox" className="text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer select-none">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Light a perpetual memorial candle with this tribute</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish Tribute to Memorial Book</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-500 text-center mt-3">
            Tributes are saved to the persistent database and also reconciled for the printed brochure.
          </p>
        </div>

        {/* Right Column: Database-Backed Tribute Cards Wall with See More & Delete controls */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs">Loading tributes from memorial database...</p>
            </div>
          ) : tributes.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-300 shadow-xl space-y-3">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-white">The Memorial Book is Open</h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Be the first family member or well-wisher to write and publish a tribute celebrating the blessed memory of Pa Festus Okoruwa Akhabue.
              </p>
            </div>
          ) : (
            <>
              {visibleTributes.map((t) => (
                <div
                  key={t.id}
                  className={`bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border transition-all ${
                    t.is_pinned
                      ? "border-amber-400/40 shadow-lg shadow-amber-500/5 bg-slate-900/95"
                      : "border-white/10 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-slate-800 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
                        {t.author_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                            {t.author_name}
                          </h4>
                          {t.is_pinned === 1 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-amber-400" />
                              Official
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-amber-300/90 font-medium mt-0.5">
                          {t.relationship}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            {t.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {t.created_at}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {t.candle_lit === 1 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-semibold flex-shrink-0">
                          <Flame className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                          <span className="hidden sm:inline">Candle Lit</span>
                        </div>
                      )}

                      {/* Admin Delete Action (Available to Authenticated Family) */}
                      {isFamilyAuthenticated && (
                        <button
                          onClick={() => handleDelete(t.id, t.author_name)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-medium transition-colors"
                          title="Delete tribute from database"
                        >
                          <Trash2 className="w-3 h-3 text-rose-400" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed pl-3 border-l-2 border-amber-400/40">
                      &ldquo;{t.message}&rdquo;
                    </p>
                  </div>
                </div>
              ))}

              {/* See More / Show Less Toggle Button */}
              {tributes.length > INITIAL_VISIBLE_COUNT && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs sm:text-sm font-semibold text-amber-300 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    {showAll ? (
                      <>
                        <ChevronUp className="w-4 h-4 text-amber-400" />
                        <span>Show Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 text-amber-400" />
                        <span>See More Tributes ({tributes.length - INITIAL_VISIBLE_COUNT} more)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
