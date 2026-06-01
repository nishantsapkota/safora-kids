"use client";

import { useState } from "react";

const days = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" }
];

export function ActiveDaySettings({ initialOffDays }: { initialOffDays: number[] }) {
  const [activeDays, setActiveDays] = useState(days.filter((day) => !initialOffDays.includes(day.value)).map((day) => day.value));
  const [saved, setSaved] = useState(false);

  function toggle(day: number) {
    setSaved(false);
    setActiveDays((current) => (current.includes(day) ? current.filter((item) => item !== day) : [...current, day]));
  }

  async function save() {
    const offDays = days.map((day) => day.value).filter((day) => !activeDays.includes(day));
    await fetch("/api/admin/settings/off-days", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offDays })
    });
    setSaved(true);
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const active = activeDays.includes(day.value);
          return (
            <button
              key={day.value}
              onClick={() => toggle(day.value)}
              className={`focus-ring rounded-md border px-2 py-3 text-sm font-bold ${active ? "border-green-300 bg-green-50 text-green-800" : "border-slate-200 bg-slate-50 text-slate-500"}`}
            >
              {day.label}
            </button>
          );
        })}
      </div>
      <button onClick={save} className="mt-4 rounded-md bg-safety-blue px-4 py-2 font-semibold text-white">
        Save Active Days
      </button>
      {saved ? <p className="mt-2 text-sm font-semibold text-green-700">Active days updated.</p> : null}
    </div>
  );
}
