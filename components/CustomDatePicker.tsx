'use client';

/**
 * components/CustomDatePicker.tsx — Bondor Bati
 *
 * Custom, high-contrast calendar date picker matching the Bondor Bati theme:
 *  - Neo-brutalist styling with 2px solid black border & hard offset shadows
 *  - Interactive month/year navigation with pure SVG vector icons
 *  - Quick date presets ("Tomorrow", "In 2 Days", "Today")
 *  - Day-of-week header with weekend highlighting
 *  - Seamless outside-click dismissal & keyboard Esc handling
 *  - Maintains underlying YYYY-MM-DD format for order submissions
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';

interface CustomDatePickerProps {
  id?: string;
  name?: string;
  value: string; // "YYYY-MM-DD"
  onChange: (dateStr: string) => void;
  required?: boolean;
  minDate?: string; // "YYYY-MM-DD", defaults to today
  maxDate?: string;
  placeholder?: string;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function formatDateToIso(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseIsoDate(isoStr?: string): Date | null {
  if (!isoStr || !/^\d{4}-\d{2}-\d{2}$/.test(isoStr)) return null;
  const [y, m, d] = isoStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplayDate(isoStr?: string): string {
  const d = parseIsoDate(isoStr);
  if (!d) return '';
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CustomDatePicker({
  id = 'customDatePicker',
  name = 'delivery_date',
  value,
  onChange,
  required = false,
  minDate,
  maxDate,
  placeholder = 'Select delivery date',
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Today reference
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const todayIso = useMemo(() => formatDateToIso(today), [today]);
  const minDateEffective = minDate || todayIso;

  // Selected Date
  const selectedDate = useMemo(() => parseIsoDate(value), [value]);

  // View Year & Month state (defaults to selected date or today)
  const [viewYear, setViewYear] = useState(() => (selectedDate ? selectedDate.getFullYear() : today.getFullYear()));
  const [viewMonth, setViewMonth] = useState(() => (selectedDate ? selectedDate.getMonth() : today.getMonth()));

  // Sync view when value changes from outside
  useEffect(() => {
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [value]);

  // Outside click listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Navigate Months
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Generate Calendar Days Grid
  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days: {
      date: Date;
      iso: string;
      dayNum: number;
      isCurrentMonth: boolean;
      isDisabled: boolean;
      isSelected: boolean;
      isToday: boolean;
    }[] = [];

    // Prev month padding
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const d = new Date(viewYear, viewMonth - 1, dayNum);
      const iso = formatDateToIso(d);
      days.push({
        date: d,
        iso,
        dayNum,
        isCurrentMonth: false,
        isDisabled: true, // Pad days disabled for clarity
        isSelected: value === iso,
        isToday: iso === todayIso,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const d = new Date(viewYear, viewMonth, i);
      const iso = formatDateToIso(d);
      const isDisabled = Boolean(
        (minDateEffective && iso < minDateEffective) || (maxDate && iso > maxDate)
      );
      days.push({
        date: d,
        iso,
        dayNum: i,
        isCurrentMonth: true,
        isDisabled,
        isSelected: value === iso,
        isToday: iso === todayIso,
      });
    }

    // Next month padding to fill out 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(viewYear, viewMonth + 1, i);
      const iso = formatDateToIso(d);
      days.push({
        date: d,
        iso,
        dayNum: i,
        isCurrentMonth: false,
        isDisabled: true,
        isSelected: value === iso,
        isToday: iso === todayIso,
      });
    }

    return days;
  }, [viewYear, viewMonth, value, minDateEffective, maxDate, todayIso]);

  const selectIsoDate = (iso: string) => {
    onChange(iso);
    setIsOpen(false);
  };

  // Quick Preset Handlers
  const handleTomorrow = () => {
    const t = new Date(today);
    t.setDate(t.getDate() + 1);
    const iso = formatDateToIso(t);
    selectIsoDate(iso);
  };

  const handleIn2Days = () => {
    const t = new Date(today);
    t.setDate(t.getDate() + 2);
    const iso = formatDateToIso(t);
    selectIsoDate(iso);
  };

  const handleToday = () => {
    selectIsoDate(todayIso);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Hidden input for standard native form serialization */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={value}
        required={required}
      />

      {/* Styled Trigger Button */}
      <button
        type="button"
        id={`${id}-trigger`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between px-4 py-3 bg-[#fdfbf7] border-2 border-black rounded-xl text-left transition-all cursor-pointer font-nunito ${
          isOpen
            ? 'shadow-[2px_2px_0px_#af0202] border-[#af0202]'
            : 'shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Calendar SVG Icon */}
          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-black/40 flex items-center justify-center shrink-0 text-[#af0202]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>

          <div className="truncate">
            {value ? (
              <span className="font-nunito-extrabold text-sm text-gray-900 block truncate">
                {formatDisplayDate(value)}
              </span>
            ) : (
              <span className="font-nunito-bold text-sm text-gray-400 block truncate">
                {placeholder}
              </span>
            )}
          </div>
        </div>

        {/* Chevron Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-gray-500 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#af0202]' : ''
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Popover Calendar Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute left-0 sm:left-auto sm:right-0 top-[calc(100%+8px)] z-50 w-[320px] sm:w-[340px] bg-white border-2 border-black rounded-2xl p-4 shadow-[8px_8px_0px_#000] select-none animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Calendar Header: Month Navigation */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="w-8 h-8 rounded-lg border-2 border-black bg-white flex items-center justify-center hover:bg-amber-100 transition-colors shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="text-center">
              <span className="font-nunito-black text-base text-gray-900 tracking-tight block">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next month"
              className="w-8 h-8 rounded-lg border-2 border-black bg-white flex items-center justify-center hover:bg-amber-100 transition-colors shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 mb-3 pb-3 border-b border-gray-100 overflow-x-auto">
            {(!minDateEffective || todayIso >= minDateEffective) && (
              <button
                type="button"
                onClick={handleToday}
                className="px-2.5 py-1 text-[11px] font-nunito-extrabold rounded-full border border-black/30 hover:border-black bg-gray-50 hover:bg-amber-100 text-gray-800 transition-colors cursor-pointer shrink-0"
              >
                Today
              </button>
            )}
            <button
              type="button"
              onClick={handleTomorrow}
              className="px-2.5 py-1 text-[11px] font-nunito-extrabold rounded-full border border-black/30 hover:border-black bg-gray-50 hover:bg-amber-100 text-gray-800 transition-colors cursor-pointer shrink-0"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={handleIn2Days}
              className="px-2.5 py-1 text-[11px] font-nunito-extrabold rounded-full border border-black/30 hover:border-black bg-gray-50 hover:bg-amber-100 text-gray-800 transition-colors cursor-pointer shrink-0"
            >
              In 2 Days
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAY_NAMES.map((w, idx) => (
              <span
                key={w}
                className={`text-[11px] font-nunito-black uppercase tracking-wider py-1 ${
                  idx === 5 || idx === 6 ? 'text-[#af0202]' : 'text-gray-400'
                }`}
              >
                {w}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarGrid.map((day, idx) => {
              if (!day.isCurrentMonth) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-8 flex items-center justify-center text-xs font-nunito text-gray-300 opacity-40 select-none"
                  >
                    {day.dayNum}
                  </div>
                );
              }

              if (day.isDisabled) {
                return (
                  <button
                    key={day.iso}
                    type="button"
                    disabled
                    className="h-8 w-8 mx-auto rounded-lg flex items-center justify-center text-xs font-nunito-bold text-gray-300 cursor-not-allowed opacity-50"
                  >
                    {day.dayNum}
                  </button>
                );
              }

              if (day.isSelected) {
                return (
                  <button
                    key={day.iso}
                    type="button"
                    onClick={() => selectIsoDate(day.iso)}
                    className="h-8 w-8 mx-auto rounded-lg border-2 border-black bg-[#af0202] text-white flex items-center justify-center text-xs font-nunito-black shadow-[2px_2px_0px_#000] cursor-pointer"
                  >
                    {day.dayNum}
                  </button>
                );
              }

              return (
                <button
                  key={day.iso}
                  type="button"
                  onClick={() => selectIsoDate(day.iso)}
                  className={`h-8 w-8 mx-auto rounded-lg border border-transparent hover:border-black hover:bg-amber-100 text-gray-900 flex items-center justify-center text-xs font-nunito-extrabold transition-all cursor-pointer ${
                    day.isToday ? 'bg-amber-100/70 border-amber-300 text-[#af0202]' : ''
                  }`}
                >
                  {day.dayNum}
                </button>
              );
            })}
          </div>

          {/* Bottom Footer Info */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] font-nunito-bold text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#af0202] inline-block" />
              <span>Chittagong Delivery</span>
            </span>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#af0202] hover:underline font-nunito-extrabold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
