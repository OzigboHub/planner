"use client";

import React from "react";
import { PlannerProvider, usePlanner } from "./context/PlannerContext";
import { Navbar } from "./components/Navbar";
import { GuestView } from "./components/guest/GuestView";
import { FamilyDashboard } from "./components/dashboard/FamilyDashboard";
import { FamilyLoginModal } from "./components/auth/FamilyLoginModal";
import { Lock } from "lucide-react";

function PlannerApp() {
  const { currentView, isFamilyAuthenticated } = usePlanner();

  return (
    <div className="min-h-screen flex flex-col bg-[#080c15] text-slate-100">
      {/* Top Navigation Bar with View Switcher, Role, & Countdown */}
      <Navbar />

      {/* Conditional View: Planning is strictly gated behind isFamilyAuthenticated */}
      {!isFamilyAuthenticated || currentView === "guest" ? (
        <GuestView />
      ) : (
        <FamilyDashboard />
      )}

      {/* Children & Planning Committee Login Modal */}
      <FamilyLoginModal />
    </div>
  );
}

export default function Home() {
  return (
    <PlannerProvider>
      <PlannerApp />
    </PlannerProvider>
  );
}
