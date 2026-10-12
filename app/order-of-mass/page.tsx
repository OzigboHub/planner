"use client";

import React from "react";
import { PlannerProvider } from "../context/PlannerContext";
import { Navbar } from "../components/Navbar";
import { GuestOrderOfMass } from "../components/guest/GuestOrderOfMass";
import { GuestFooter } from "../components/guest/GuestFooter";
import { FamilyLoginModal } from "../components/auth/FamilyLoginModal";
import { ShareInvitationModal } from "../components/share/ShareInvitationModal";

function OrderOfMassContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080c15] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <GuestOrderOfMass />
      </main>
      <GuestFooter />
      <FamilyLoginModal />
      <ShareInvitationModal />
    </div>
  );
}

export default function OrderOfMassPage() {
  return (
    <PlannerProvider>
      <OrderOfMassContent />
    </PlannerProvider>
  );
}
