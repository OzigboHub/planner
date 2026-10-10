"use client";

import React, { useState } from "react";
import { usePlanner } from "../../context/PlannerContext";
import { TaskItem } from "../../types";
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Filter,
  Briefcase,
  ChevronRight,
} from "lucide-react";

export const WorkstreamsTasks: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = usePlanner();

  const [selectedWorkstream, setSelectedWorkstream] = useState<string>("All");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [workstream, setWorkstream] = useState("Overall Event Coordination");
  const [assignee, setAssignee] = useState("");
  const [deadline, setDeadline] = useState("2026-10-25");
  const [priority, setPriority] = useState<TaskItem["priority"]>("High");
  const [notes, setNotes] = useState("");

  const workstreams = [
    "All",
    "Overall Event Coordination",
    "Church and Priest",
    "Mortuary / Transport / Procession",
    "Food and Kitchen",
    "Drinks",
    "Rentals / DJ / Utilities",
    "Renovation",
    "Treasurer / Records",
    "Guest Information",
    "Reception / Cleanup",
  ];

  const filteredTasks = tasks.filter((t) => {
    return selectedWorkstream === "All" || t.workstream === selectedWorkstream;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assignee.trim()) return;

    addTask({
      title: title.trim(),
      workstream,
      assignedPerson: assignee.trim(),
      deadline,
      status: "To Do",
      priority,
      notes: notes.trim() || undefined,
    });

    setIsAddOpen(false);
    setTitle("");
    setAssignee("");
    setNotes("");
  };

  const toggleTaskStatus = (t: TaskItem) => {
    const nextStatus: TaskItem["status"] =
      t.status === "To Do"
        ? "In Progress"
        : t.status === "In Progress"
        ? "Completed"
        : "To Do";
    updateTask(t.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Section 8 • Committee Responsibilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Workstreams & Task Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            10 suggested workstreams, assigned committee leads, deadlines and action tracking
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Task</span>
        </button>
      </div>

      {/* Workstream Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
        {workstreams.map((ws) => (
          <button
            key={ws}
            onClick={() => setSelectedWorkstream(ws)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedWorkstream === ws
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            }`}
          >
            {ws}
          </button>
        ))}
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((t) => {
          const isDone = t.status === "Completed";
          const isInProgress = t.status === "In Progress";

          return (
            <div
              key={t.id}
              className={`p-5 rounded-2xl border transition-all ${
                isDone
                  ? "bg-slate-900/40 border-emerald-500/20 opacity-80"
                  : "bg-slate-900/90 border-white/10 hover:border-amber-400/30"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 border border-slate-700">
                    {t.workstream}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      t.priority === "High"
                        ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                        : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>

                <button
                  onClick={() => toggleTaskStatus(t)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                    isDone
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : isInProgress
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {t.status}
                </button>
              </div>

              <h3
                className={`text-sm font-bold mb-2 ${
                  isDone ? "text-slate-400 line-through" : "text-white"
                }`}
              >
                {t.title}
              </h3>

              {t.notes && (
                <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 mb-3 italic">
                  {t.notes}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-medium">{t.assignedPerson}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Target: {t.deadline}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Assign Responsibility</span>
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Confirm generator fuel delivery time on Oct 29"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Workstream *
                  </label>
                  <select
                    value={workstream}
                    onChange={(e) => setWorkstream(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    {workstreams.filter((w) => w !== "All").map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Assigned Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="e.g. Cousin Collins"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Deadline Date
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes / Instructions
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specific requirements, contact numbers or checklists..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
