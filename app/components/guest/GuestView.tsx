"use client";

import React from "react";
import { GuestMemorialHero } from "./GuestMemorialHero";
import { GuestVenues } from "./GuestVenues";
import { GuestFooter } from "./GuestFooter";

export const GuestView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Memorial Hero */}
      <GuestMemorialHero />

      {/* Venues, Directions & Logistics */}
      <GuestVenues />

      {/* Dignified Footer */}
      <GuestFooter />
    </div>
  );
};

