"use client";

import React from "react";
import { SimplePlannerView } from "./SimplePlannerView";

export const FamilyDashboard: React.FC = () => {
  return (
    <div className="flex-1 bg-[#080c15] text-slate-100 min-h-screen">
      <main className="w-full">
        <SimplePlannerView />
      </main>
    </div>
  );
};
