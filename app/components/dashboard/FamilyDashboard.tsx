"use client";

import React from "react";
import { usePlanner } from "../../context/PlannerContext";
import { DashboardNav } from "./DashboardNav";
import { DashboardOverview } from "./DashboardOverview";
import { BudgetManager } from "./BudgetManager";
import { ContributionsTracker } from "./ContributionsTracker";
import { WorkstreamsTasks } from "./WorkstreamsTasks";
import { PurchasingList } from "./PurchasingList";
import { RenovationTracker } from "./RenovationTracker";
import { VendorsTracker } from "./VendorsTracker";
import { ProgrammeEditor } from "./ProgrammeEditor";
import { DocumentsVault } from "./DocumentsVault";
import { ApprovalsCenter } from "./ApprovalsCenter";
import { PrintableReport } from "./PrintableReport";

export const FamilyDashboard: React.FC = () => {
  const { dashboardSection } = usePlanner();

  const renderSection = () => {
    switch (dashboardSection) {
      case "overview":
        return <DashboardOverview />;
      case "budget":
        return <BudgetManager />;
      case "contributions":
        return <ContributionsTracker />;
      case "tasks":
        return <WorkstreamsTasks />;
      case "purchases":
        return <PurchasingList />;
      case "renovation":
        return <RenovationTracker />;
      case "vendors":
        return <VendorsTracker />;
      case "programme":
        return <ProgrammeEditor />;
      case "documents":
        return <DocumentsVault />;
      case "approvals":
        return <ApprovalsCenter />;
      case "reports":
        return <PrintableReport />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#080c15]">
      {/* Sidebar Navigation */}
      <DashboardNav />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {renderSection()}
      </main>
    </div>
  );
};
