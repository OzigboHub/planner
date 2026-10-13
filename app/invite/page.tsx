"use client";

import React, { useEffect } from "react";
import { PlannerProvider, usePlanner } from "../context/PlannerContext";
import { Navbar } from "../components/Navbar";
import { GuestView } from "../components/guest/GuestView";
import { ShareInvitationModal } from "../components/share/ShareInvitationModal";

function InviteContent() {
  const { setIsInvitedGuest, setCurrentView } = usePlanner();

  useEffect(() => {
    setIsInvitedGuest(true);
    setCurrentView("guest");
  }, [setIsInvitedGuest, setCurrentView]);

  return (
    <div className="min-h-screen flex flex-col bg-[#080c15] text-slate-100">
      <Navbar />
      <GuestView />
      <ShareInvitationModal />
    </div>
  );
}

export default function InvitePage() {
  return <InviteContent />;
}
