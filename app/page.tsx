"use client";

import React from "react";
import { PlannerProvider, usePlanner } from "./context/PlannerContext";
import { Navbar } from "./components/Navbar";
import { GuestView } from "./components/guest/GuestView";
import { FamilyDashboard } from "./components/dashboard/FamilyDashboard";
import { FamilyLoginModal } from "./components/auth/FamilyLoginModal";
import { ShareInvitationModal } from "./components/share/ShareInvitationModal";

function PlannerApp() {
  const { currentView, isFamilyAuthenticated } = usePlanner();

  return (
    <div className="min-h-screen flex flex-col bg-[#080c15] text-slate-100">
      {/* Top Navigation Bar with Planning button, view switcher & countdown */}
      <Navbar />

      {/* Main View: Shows FamilyDashboard (SimplePlannerView) when authenticated & in planning view. Otherwise GuestView */}
      {isFamilyAuthenticated && currentView === "family" ? (
        <FamilyDashboard />
      ) : (
        <GuestView />
      )}

      {/* Planning Login Modal (opens when user clicks Planning button) */}
      <FamilyLoginModal />

      {/* Guest Invitation & Sharing Modal */}
      <ShareInvitationModal />
    </div>
  );
}

export default function Home() {
  return <PlannerApp />;
}
