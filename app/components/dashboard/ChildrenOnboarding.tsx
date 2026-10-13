"use client";

import React, { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { FamilyMember, PermissionLevel } from "../../types";
import {
  UserPlus,
  KeyRound,
  ShieldCheck,
  Copy,
  Check,
  RefreshCw,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Share2,
  Search,
  Sparkles,
  AlertCircle,
  X,
  MessageCircle,
  UserCheck,
  Clock,
  Eye,
  Edit3,
  Lock,
  Unlock,
} from "lucide-react";

export const ChildrenOnboarding: React.FC = () => {
  const {
    familyMembers,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    updateMemberPermission,
    generateMemberCode,
    settings,
    userRole,
    isAdmin,
  } = usePlanner();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterPermission, setFilterPermission] = useState<"all" | PermissionLevel>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    relationship: "Son • Sibling",
    branch: "Irrua Home Branch",
    phone: "",
    email: "",
    assignedRole: "General Planning Committee",
    loginCode: "",
    status: "Active" as "Active" | "Pending" | "Invited",
    permission: "view_only" as PermissionLevel,
    notes: "",
  });

  const branches = Array.from(
    new Set(familyMembers.map((m) => m.branch).filter(Boolean))
  ) as string[];

  const filteredMembers = familyMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.relationship.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.loginCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.phone && m.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.assignedRole && m.assignedRole.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBranch = filterBranch === "all" || m.branch === filterBranch;
    const matchesPermission =
      filterPermission === "all" || m.permission === filterPermission;

    return matchesSearch && matchesBranch && matchesPermission;
  });

  const viewOnlyCount = familyMembers.filter((m) => m.permission === "view_only").length;
  const editCount = familyMembers.filter((m) => m.permission === "view_and_edit").length;

  const handleOpenAddModal = () => {
    setEditingMember(null);
    const initialName = "";
    setFormData({
      name: "",
      relationship: "Son • Sibling",
      branch: "Irrua Home Branch",
      phone: "",
      email: "",
      assignedRole: "General Planning Committee",
      loginCode: generateMemberCode(initialName || "CHILD"),
      status: "Active",
      permission: "view_only", // Main Rule: Every child starts with View Only by default!
      notes: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: FamilyMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      relationship: member.relationship,
      branch: member.branch || "Irrua Home Branch",
      phone: member.phone || "",
      email: member.email || "",
      assignedRole: member.assignedRole || "",
      loginCode: member.loginCode,
      status: member.status,
      permission: member.permission || "view_only",
      notes: member.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleGenerateCodeInForm = () => {
    const code = generateMemberCode(formData.name || "CHILD");
    setFormData((prev) => ({ ...prev, loginCode: code }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!formData.name.trim() || !formData.loginCode.trim()) return;

    if (editingMember) {
      updateFamilyMember(editingMember.id, {
        name: formData.name.trim(),
        relationship: formData.relationship,
        branch: formData.branch,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        assignedRole: formData.assignedRole.trim(),
        loginCode: formData.loginCode.trim().toUpperCase(),
        status: formData.status,
        permission: formData.permission,
        notes: formData.notes.trim(),
      });
    } else {
      addFamilyMember({
        name: formData.name.trim(),
        relationship: formData.relationship,
        branch: formData.branch,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        assignedRole: formData.assignedRole.trim(),
        loginCode: formData.loginCode.trim().toUpperCase(),
        status: formData.status,
        permission: formData.permission || "view_only", // Default is View Only
        notes: formData.notes.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyPersonalInvite = (member: FamilyMember) => {
    const permText =
      member.permission === "view_and_edit"
        ? "View & Edit Authorized"
        : "View Only (Read-Only Access)";

    const msg = `Dear ${member.name},\n\nYou have been onboarded to the Private Family Planning Portal for the funeral of our late father, ${settings.honoree}.\n\n📱 Registered Phone: *${member.phone || "Not set"}*\n🔑 Your Personal Access Code: *${member.loginCode}*\n🛡️ Assigned Access: *${permText}*\n📋 Assigned Role: ${member.assignedRole || member.relationship}\n📍 Branch: ${member.branch || "General"}\n\nPlease click on 'Planning Login' on the website and enter your registered phone number and code to access the planning session.\n\n— Akhabue Family Planning Committee`;
    navigator.clipboard.writeText(msg);
    setCopiedInviteId(member.id);
    setTimeout(() => setCopiedInviteId(null), 2500);
  };

  const handleRegenerateCodeDirectly = (member: FamilyMember) => {
    const newCode = generateMemberCode(member.name);
    updateFamilyMember(member.id, { loginCode: newCode });
  };

  const handleTogglePermission = (member: FamilyMember) => {
    const newPermission: PermissionLevel =
      member.permission === "view_and_edit" ? "view_only" : "view_and_edit";
    updateMemberPermission(member.id, newPermission);
  };

  const handleCopyAllBroadcast = () => {
    const listText = familyMembers
      .map(
        (m, idx) =>
          `${idx + 1}. *${m.name}* (${m.relationship})\n   📱 Phone: ${m.phone || "N/A"}\n   🔑 Access Code: *${m.loginCode}*\n   🛡️ Permission: ${m.permission === "view_and_edit" ? "View & Edit" : "View Only (Default)"}\n   📋 Duty: ${m.assignedRole || "Planning Committee"}`
      )
      .join("\n\n");

    const broadcast = `🕊️ *AKHABUE FAMILY BURIAL PLANNING PORTAL — CHILDREN ACCESS DIRECTORY*\n\nEvent: Funeral of ${settings.honoree}\nChurch: ${settings.churchVenue}\n\nBelow are the verified individual login codes for all children to access the confidential planning session:\n\n${listText}\n\n💡 Instructions:\nVisit the funeral portal, click 'Planning Login', and enter your registered phone number and generated code.\n\n— Family Committee Secretariat`;

    navigator.clipboard.writeText(broadcast);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Permissions & Security</span>
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-300 text-xs font-medium">Children Onboarding & Access Control</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Onboard Children & Permission Control
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Register children of {settings.honoree}, generate unique login codes, and manage <strong>View-Only</strong> vs <strong>View & Edit</strong> permissions. Every registered child starts with View-Only access by default.
            </p>
          </div>

          {isAdmin ? (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2 shadow-sm"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Broadcast Summary</span>
              </button>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Onboard New Child</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Sibling Directory (Admin Authorization Required to Modify)</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <p className="text-slate-400 text-[11px]">Total Registered Members</p>
            <p className="text-xl font-black text-white mt-0.5">{familyMembers.length}</p>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <p className="text-slate-400 text-[11px] flex items-center gap-1">
              <Eye className="w-3 h-3 text-amber-400" />
              <span>View-Only (Default)</span>
            </p>
            <p className="text-xl font-black text-amber-300 mt-0.5">{viewOnlyCount} Members</p>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <p className="text-slate-400 text-[11px] flex items-center gap-1">
              <Edit3 className="w-3 h-3 text-emerald-400" />
              <span>Edit Authorized</span>
            </p>
            <p className="text-xl font-black text-emerald-400 mt-0.5">{editCount} Members</p>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <p className="text-slate-400 text-[11px]">Admin Master Bypass</p>
            <p className="text-sm font-bold text-amber-400 mt-1 font-mono">AKHABUE2026</p>
          </div>
        </div>
      </div>

      {/* Permission Enforcement Rule Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-start gap-3.5 text-xs">
        <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-slate-300 space-y-1">
          <p className="font-bold text-white flex items-center gap-1.5">
            <span>Enforced Permission Rules & Access Control</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
              Strict Backend & UI Protection
            </span>
          </p>
          <p className="text-slate-400 leading-relaxed">
            • <strong>View Only (Default):</strong> Children who log in with their phone number and generated code can view all planning documents, budget totals, and task schedules. They are blocked from editing, adding, or deleting anything.
            <br />
            • <strong>View & Edit:</strong> Only the Admin can authorize editing. When granted, the child can update tasks, records, and expenses. If revoked by the Admin, editing capability is terminated immediately.
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-white/5">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, code, duty..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Permission Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Permission:</span>
            <select
              value={filterPermission}
              onChange={(e) => setFilterPermission(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
            >
              <option value="all">All ({familyMembers.length})</option>
              <option value="view_only">View Only ({viewOnlyCount})</option>
              <option value="view_and_edit">View & Edit ({editCount})</option>
            </select>
          </div>

          {/* Branch Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Branch:</span>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Branches</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Onboarded Children with Permission Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const isViewOnly = member.permission === "view_only";

          return (
            <div
              key={member.id}
              className={`bg-slate-900/90 rounded-2xl border p-5 transition-all flex flex-col justify-between group shadow-lg ${
                isViewOnly
                  ? "border-white/10 hover:border-amber-500/30"
                  : "border-emerald-500/30 hover:border-emerald-400 shadow-emerald-500/5"
              }`}
            >
              <div>
                {/* Card Header: Avatar, Name, & Permission Badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-400/30 flex items-center justify-center font-bold text-amber-300 text-sm">
                      {member.name
                        .replace(/^(Dr\.|Barr\.|Engr\.|Sister|Brother|Aunty|Uncle)\s+/i, "")
                        .charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-[11px] text-amber-400/90 font-medium">{member.relationship}</p>
                    </div>
                  </div>

                  {/* Permission Badge */}
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
                      isViewOnly
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {isViewOnly ? (
                      <>
                        <Eye className="w-3 h-3 text-amber-400" />
                        <span>View Only</span>
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-3 h-3 text-emerald-400" />
                        <span>View & Edit</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Workstream & Details */}
                <div className="space-y-1.5 text-xs text-slate-300 my-3">
                  {member.assignedRole && (
                    <div className="flex items-start gap-2 bg-slate-950/60 p-2 rounded-xl border border-white/5">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                          Assigned Duty / Workstream
                        </span>
                        <span className="text-slate-200 text-xs font-medium">{member.assignedRole}</span>
                      </div>
                    </div>
                  )}

                  {member.phone && (
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-mono bg-slate-950/40 px-2 py-1 rounded-lg">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                  )}

                  {member.branch && (
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{member.branch}</span>
                    </div>
                  )}
                </div>

                {/* Login Code Box */}
                <div className="bg-gradient-to-r from-amber-500/10 via-slate-950 to-amber-500/10 p-3 rounded-xl border border-amber-400/20 mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-amber-400" />
                      <span>Login Code & Phone Access</span>
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => handleRegenerateCodeDirectly(member)}
                        className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                        title="Generate new login code"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Regen</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700/80">
                    <span className="font-mono text-sm font-extrabold text-amber-300 tracking-wider">
                      {member.loginCode}
                    </span>
                    <button
                      onClick={() => handleCopyCode(member.id, member.loginCode)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Copy Code"
                    >
                      {copiedId === member.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {member.lastLogin && (
                    <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Last login: {member.lastLogin}</span>
                    </p>
                  )}
                </div>

                {/* Permission Control Button for Admin */}
                <div className="mt-3 bg-slate-950/80 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Planning Permission
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isViewOnly ? "text-amber-300" : "text-emerald-400"
                      }`}
                    >
                      {isViewOnly ? "View Only (Read-Only)" : "View and Edit (Authorized)"}
                    </span>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => handleTogglePermission(member)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm ${
                        isViewOnly
                          ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                      }`}
                      title={
                        isViewOnly
                          ? "Grant this child edit access to planning items"
                          : "Revoke edit access and return child to view-only"
                      }
                    >
                      {isViewOnly ? (
                        <>
                          <Unlock className="w-3 h-3 text-emerald-400" />
                          <span>Grant Edit Access</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>Revoke Edit Access</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyPersonalInvite(member)}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="Copy WhatsApp Invitation text for this child"
                >
                  {copiedInviteId === member.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copy Invite</span>
                    </>
                  )}
                </button>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(member)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit Child Profile & Permissions"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to remove ${member.name} from the registered children list?`
                          )
                        ) {
                          deleteFamilyMember(member.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                      title="Remove Child"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="bg-slate-900/60 p-8 rounded-2xl border border-white/5 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-white text-sm font-bold">No members found</p>
          <p className="text-slate-400 text-xs">
            No children match your search criteria. Click &quot;Onboard New Child&quot; to register a family member.
          </p>
        </div>
      )}

      {/* Modal: Onboard / Edit Child */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl border border-amber-400/30 p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <UserCheck className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-white">
                {editingMember ? "Edit Child & Access Permission" : "Onboard New Child / Family Member"}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Enter member details, configure login code, and set planning section permissions.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Full Name & Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Uwade Akhabue or Otibhor Akhabue"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Relationship / Role *
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="1st Sibling • Eldest Son">1st Sibling • Eldest Son</option>
                    <option value="2nd Sibling • Son">2nd Sibling • Son</option>
                    <option value="3rd Sibling • Daughter">3rd Sibling • Daughter</option>
                    <option value="4th Sibling • Son">4th Sibling • Son</option>
                    <option value="5th Sibling • Daughter">5th Sibling • Daughter</option>
                    <option value="6th Sibling • Son">6th Sibling • Son</option>
                    <option value="Son • Sibling">Son • Sibling</option>
                    <option value="Daughter • Sibling">Daughter • Sibling</option>
                    <option value="Grandchild">Grandchild</option>
                    <option value="In-Law">In-Law</option>
                    <option value="Executive Coordinator">Executive Coordinator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Location Branch
                  </label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="e.g. Diaspora (UK), Lagos, Irrua"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Phone Number (Used for Login) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 803 234 5678"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Assigned Planning Duty / Responsibility
                </label>
                <input
                  type="text"
                  value={formData.assignedRole}
                  onChange={(e) => setFormData({ ...formData, assignedRole: e.target.value })}
                  placeholder="e.g. Liturgy Liaison, Catering Protocol, Drinks Oversight"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Permission Level Selector (Default: View Only) */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-700/80 space-y-2">
                <label className="font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Planning Section Permissions *</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      formData.permission === "view_only"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {formData.permission === "view_only" ? "Default: View Only" : "Authorized: Edit"}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, permission: "view_only" })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      formData.permission === "view_only"
                        ? "bg-amber-500/20 border-amber-400 text-white shadow"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>View Only (Default)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Can browse plan and financial totals, but cannot edit, add, or delete.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, permission: "view_and_edit" })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      formData.permission === "view_and_edit"
                        ? "bg-emerald-500/20 border-emerald-400 text-white shadow"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                      <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View and Edit</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Authorized to modify planning details, add tasks, and record quotes.
                    </p>
                  </button>
                </div>
              </div>

              {/* Login Code Configuration */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-amber-400/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Personal 6-Digit Access PIN *</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateCodeInForm}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.loginCode}
                  onChange={(e) =>
                    setFormData({ ...formData, loginCode: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. 261001"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-400 uppercase tracking-widest"
                />
                <p className="text-[11px] text-slate-400">
                  The member logs in using their registered phone number and this 6-digit access PIN.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional remarks or instructions..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-md"
                >
                  {editingMember ? "Save Changes" : "Save & Onboard Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Summary Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-amber-400/30 p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowBroadcastModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <MessageCircle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Family Broadcast & Access Credentials</h3>
                <p className="text-xs text-slate-400">
                  Summary of registered children, phone numbers, and login permissions.
                </p>
              </div>
            </div>

            <div className="mt-4 bg-slate-950 p-4 rounded-2xl border border-white/10 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-80 overflow-y-auto">
              {familyMembers
                .map(
                  (m, idx) =>
                    `${idx + 1}. ${m.name} (${m.relationship})\n   📱 Phone: ${m.phone || "N/A"}\n   🔑 Access Code: ${m.loginCode}\n   🛡️ Permission: ${m.permission === "view_and_edit" ? "View & Edit" : "View Only (Default)"}\n   📋 Duty: ${m.assignedRole || "Planning Committee"}`
                )
                .join("\n\n")}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {familyMembers.length} members ({viewOnlyCount} View Only, {editCount} Edit Authorized)
              </span>
              <button
                onClick={handleCopyAllBroadcast}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Copied Entire Broadcast!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy WhatsApp Broadcast Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
