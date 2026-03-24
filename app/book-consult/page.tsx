"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const FUNCTION_NAME = "gcal-sync";

type Slot = {
  start: string;
  end: string;
};

type Day = {
  date: string;
  slots: Slot[];
};

type DisplaySlot = {
  key: string;
  label: string;
  slot: Slot | null;
  available: boolean;
};

type ConfirmationPayload = {
  name: string;
  email: string;
  phone: string;
  company: string;
  questions: string;
  start: string;
  end: string;
  zoomJoinUrl: string | null;
  zoomPasscode: string | null;
  calendarHtmlLink: string | null;
};

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatTimePT(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatDateTimePT(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatWeekLabelFromDate(dateStr: string) {
  const start = new Date(`${dateStr}T00:00:00`);
  const end = addDays(start, 4);

  return `${start.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  })} – ${end.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;
}

function formatDayName(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
  }).toUpperCase();
}

function formatDayNum(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).getDate();
}

function getWeekKey(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  const start = getStartOfWeek(d);
  return start.toISOString().slice(0, 10);
}

function buildDailyDisplaySlots(day: Day): DisplaySlot[] {
  const byLabel = new Map<string, Slot>();

  for (const slot of day.slots) {
    byLabel.set(formatTimePT(slot.start), slot);
  }

  const labels: string[] = [];

  for (let hour = 8; hour <= 17; hour++) {
    const minutes = hour === 17 ? [0] : [0, 30];

    for (const minute of minutes) {
      const dt = new Date(Date.UTC(2026, 0, 5, hour + 8, minute, 0));
      labels.push(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "numeric",
          minute: "2-digit",
        }).format(dt),
      );
    }
  }

  return labels.map((label) => {
    const slot = byLabel.get(label) || null;
    return {
      key: `${day.date}-${label}`,
      label,
      slot,
      available: Boolean(slot),
    };
  });
}

export default function BookConsultPage() {
  const router = useRouter();

  const [days, setDays] = useState<Day[]>([]);
  const [loadedWeeks, setLoadedWeeks] = useState(1);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [questions, setQuestions] = useState("");

  const baseWeekStart = useMemo(() => getStartOfWeek(new Date()), []);

  const emailIsValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const isFormComplete = useMemo(() => {
    return (
      Boolean(selectedSlot) &&
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      emailIsValid &&
      phone.trim().length > 0 &&
      company.trim().length > 0 &&
      questions.trim().length > 0
    );
  }, [selectedSlot, name, email, emailIsValid, phone, company, questions]);

  async function invokeFunction(body: unknown) {
    if (!SUPABASE_URL) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
    }

    if (!SUPABASE_ANON_KEY) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
    }

    const res = await fetch(`${SUPABASE_URL}/functions/v1/${FUNCTION_NAME}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: any = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      throw new Error(data?.error || data?.message || `Request failed with ${res.status}`);
    }

    return data;
  }

  async function loadWeek(weekOffset: number, append = false) {
    const weekStart = addDays(baseWeekStart, weekOffset * 7);
    const weekEnd = addDays(weekStart, 7);

    const data = await invokeFunction({
      action: "availability",
      start: weekStart.toISOString(),
      end: weekEnd.toISOString(),
    });

    const incomingDays = (Array.isArray(data.days) ? data.days : []).filter((day: Day) => {
      const weekday = new Date(`${day.date}T00:00:00`).getDay();
      return weekday !== 0 && weekday !== 6;
    });

    setDays((prev) => {
      if (!append) return incomingDays;

      const merged = [...prev];
      for (const day of incomingDays) {
        if (!merged.some((d) => d.date === day.date)) {
          merged.push(day);
        }
      }
      return merged;
    });
  }

  useEffect(() => {
    (async () => {
      try {
        setLoadingInitial(true);
        setError("");
        await loadWeek(0, false);
      } catch (err: any) {
        setError(err?.message || "Failed to load availability");
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, [baseWeekStart]);

  async function handleShowMore() {
    if (loadedWeeks >= 3) return;

    try {
      setLoadingMore(true);
      setError("");
      await loadWeek(loadedWeeks, true);
      setLoadedWeeks((v) => v + 1);
    } catch (err: any) {
      setError(err?.message || "Failed to load more availability");
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedSlot) {
      setError("Please select a time slot first.");
      return;
    }

    if (!name.trim() || !email.trim() || !phone.trim() || !company.trim() || !questions.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (!emailIsValid) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("Booking your consultation...");
    setError("");

    try {
      const result = await invokeFunction({
        action: "consult_book",
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim(),
        questions: questions.trim(),
        start: selectedSlot.start,
        end: selectedSlot.end,
      });

      const confirmation: ConfirmationPayload | undefined = result?.confirmation;

      const params = new URLSearchParams({
        name: confirmation?.name || name.trim(),
        email: confirmation?.email || email.trim(),
        phone: confirmation?.phone || phone.trim(),
        company: confirmation?.company || company.trim(),
        questions: confirmation?.questions || questions.trim(),
        start: confirmation?.start || selectedSlot.start,
        end: confirmation?.end || selectedSlot.end,
        zoomJoinUrl: confirmation?.zoomJoinUrl || "",
        zoomPasscode: confirmation?.zoomPasscode || "",
        calendarHtmlLink: confirmation?.calendarHtmlLink || "",
      });

      router.push(`/book-consult/confirmed?${params.toString()}`);
    } catch (err: any) {
      setStatus("");
      setError(err?.message || "Booking failed");
    }
  }

  const grouped = useMemo(() => {
    const map = new Map<string, Day[]>();

    for (const day of days) {
      const key = getWeekKey(day.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(day);
    }

    return Array.from(map.entries()).map(([weekKey, weekDays]) => ({
      weekKey,
      label: formatWeekLabelFromDate(weekKey),
      days: weekDays,
    }));
  }, [days]);

  return (
    <main className="gsv-book-page">
      <div className="gsv-book-shell">
        <section className="gsv-book-top">
          <div className="gsv-book-hero">
            <div className="gsv-book-hero-inner">
              <div className="gsv-book-eyebrow">GSV TECH CONSULTATION</div>
              <h1>Book time with us.</h1>
              <p>
                Choose an available 30-minute slot, tell us a little about your project,
                and we’ll handle the calendar invite, Zoom meeting, and confirmation email automatically.
              </p>
            </div>
          </div>

          <div className="gsv-book-expect">
            <div className="gsv-book-expect-inner">
              <div className="gsv-book-eyebrow">WHAT TO EXPECT</div>
              <h2>Fast, focused consultation</h2>
              <ul>
                <li>Review your current setup and goals</li>
                <li>Identify immediate opportunities and next steps</li>
                <li>Discuss support, infrastructure, or project scope</li>
              </ul>
            </div>
          </div>
        </section>

        {error ? <div className="gsv-book-alert gsv-book-alert-error">{error}</div> : null}

        <section className="gsv-book-main">
          <div className="gsv-book-left">
            <div className="gsv-book-card">
              <div className="gsv-book-card-head">
                <div>
                  <div className="gsv-book-eyebrow">AVAILABILITY</div>
                  <h2>Select a time</h2>
                </div>
              </div>

              {loadingInitial ? (
                <div className="gsv-book-loading">Loading availability...</div>
              ) : (
                <>
                  {grouped.map((week) => (
                    <div key={week.weekKey} className="gsv-book-week-block">
                      <div className="gsv-book-week-title">{week.label}</div>

                      <div className="gsv-book-days">
                        {week.days.map((day) => {
                          const displaySlots = buildDailyDisplaySlots(day);

                          return (
                            <div key={day.date} className="gsv-book-day">
                              <div className="gsv-book-day-head">
                                <div className="gsv-book-day-row">
                                  <span className="gsv-book-day-name">{formatDayName(day.date)}</span>
                                  <span className="gsv-book-day-num">{formatDayNum(day.date)}</span>
                                </div>
                                <div className="gsv-book-day-meta">{day.slots.length} available</div>
                              </div>

                              <div className="gsv-book-slots">
                                {displaySlots.map((item) => {
                                  const active =
                                    item.slot && selectedSlot?.start === item.slot.start;

                                  if (!item.available) {
                                    return (
                                      <div
                                        key={item.key}
                                        className="gsv-book-slot gsv-book-slot-disabled"
                                      >
                                        {item.label}
                                      </div>
                                    );
                                  }

                                  return (
                                    <button
                                      key={item.key}
                                      type="button"
                                      className={`gsv-book-slot${active ? " is-active" : ""}`}
                                      onClick={() => {
                                        if (!item.slot) return;
                                        setSelectedSlot(item.slot);
                                        setError("");
                                      }}
                                    >
                                      {item.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="gsv-book-more">
                    <button
                      type="button"
                      className="gsv-book-more-btn"
                      onClick={handleShowMore}
                      disabled={loadedWeeks >= 3 || loadingMore}
                    >
                      {loadedWeeks >= 3
                        ? "Maximum range reached"
                        : loadingMore
                          ? "Loading..."
                          : "Show More"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="gsv-book-right">
            <div className="gsv-book-sticky-wrap">
              <div className="gsv-book-card gsv-book-sticky">
                <div className="gsv-book-eyebrow">BOOKING DETAILS</div>
                <h2>Tell us about your project</h2>

                <div className="gsv-book-selected">
                  <div className="gsv-book-selected-label">SELECTED TIME</div>
                  <div className="gsv-book-selected-value">
                    {selectedSlot
                      ? formatDateTimePT(selectedSlot.start)
                      : "Choose a time from the calendar"}
                  </div>
                </div>

                <div className="gsv-book-required-note">
                  <span className="gsv-required">*</span> Required fields
                </div>

                <form className="gsv-book-form" onSubmit={handleSubmit}>
                  <div className="gsv-book-field">
                    <label htmlFor="name">
                      Full Name <span className="gsv-required">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="gsv-book-field">
                    <label htmlFor="email">
                      Email <span className="gsv-required">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="gsv-book-field">
                    <label htmlFor="phone">
                      Phone <span className="gsv-required">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      placeholder="(555) 555-5555"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="gsv-book-field">
                    <label htmlFor="company">
                      Company <span className="gsv-required">*</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      placeholder="Company name"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  <div className="gsv-book-field">
                    <label htmlFor="questions">
                      What can we help with? <span className="gsv-required">*</span>
                    </label>
                    <textarea
                      id="questions"
                      name="questions"
                      rows={6}
                      placeholder="Briefly describe your needs, current setup, or project goals."
                      required
                      value={questions}
                      onChange={(e) => setQuestions(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="gsv-book-submit"
                    disabled={!isFormComplete || !!status}
                    aria-disabled={!isFormComplete || !!status}
                  >
                    {status || "Confirm Booking"}
                  </button>
                </form>

                <div className="gsv-book-note">
                  Once submitted, we’ll create your calendar event, Zoom meeting, and email confirmation.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }

        .gsv-book-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(214, 168, 79, 0.12), transparent 28%),
            linear-gradient(180deg, #f7f3ea 0%, #f8f5ee 48%, #f3efe6 100%);
          color: #161616;
          padding: 34px 20px 70px;
        }

        .gsv-book-shell {
          --gsv-layout-gap: 22px;
          --gsv-left-col: minmax(0, 1.45fr);
          --gsv-right-col: minmax(370px, 0.85fr);
          --gsv-two-col-layout: var(--gsv-left-col) var(--gsv-right-col);
          max-width: 1380px;
          margin: 0 auto;
        }

        .gsv-book-top,
        .gsv-book-main {
          display: grid;
          grid-template-columns: var(--gsv-two-col-layout);
          gap: var(--gsv-layout-gap);
          align-items: stretch;
        }

        .gsv-book-top {
          margin-bottom: 22px;
        }

        .gsv-book-hero,
        .gsv-book-expect,
        .gsv-book-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(25, 25, 25, 0.08);
          border-radius: 28px;
          box-shadow: 0 10px 40px rgba(22, 22, 22, 0.06), 0 2px 10px rgba(22, 22, 22, 0.03);
        }

        .gsv-book-hero,
        .gsv-book-expect {
          min-width: 0;
          height: 100%;
          padding: 28px 30px;
          display: flex;
          align-items: stretch;
        }

        .gsv-book-hero-inner,
        .gsv-book-expect-inner {
          width: 100%;
          min-height: 100%;
          display: flex;
          flex-direction: column;
        }

        .gsv-book-expect-inner {
          justify-content: center;
        }

        .gsv-book-left,
        .gsv-book-right {
          min-width: 0;
        }

        .gsv-book-right {
          position: relative;
        }

        .gsv-book-sticky-wrap {
          position: sticky;
          top: 18px;
          align-self: start;
          will-change: transform;
        }

        .gsv-book-eyebrow {
          display: inline-block;
          margin-bottom: 12px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: #a77d1f;
          text-transform: uppercase;
        }

        .gsv-book-hero h1 {
          margin: 0 0 14px;
          font-size: clamp(44px, 5vw, 72px);
          line-height: 0.96;
          letter-spacing: -0.05em;
          color: #161616;
        }

        .gsv-book-hero p,
        .gsv-book-expect ul,
        .gsv-book-note {
          color: rgba(22, 22, 22, 0.72);
          line-height: 1.65;
        }

        .gsv-book-expect h2,
        .gsv-book-card h2 {
          margin: 0 0 12px;
          font-size: 28px;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #161616;
        }

        .gsv-book-expect ul {
          margin: 0;
          padding-left: 18px;
        }

        .gsv-book-alert {
          border-radius: 18px;
          padding: 14px 16px;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 600;
        }

        .gsv-book-alert-error {
          background: #fff1f1;
          border: 1px solid #e9c2c2;
          color: #9e3131;
        }

        .gsv-book-card {
          padding: 24px;
          min-width: 0;
          transition:
            transform 220ms ease,
            box-shadow 220ms ease;
        }

        .gsv-book-sticky {
          max-height: calc(100vh - 36px);
          overflow: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        .gsv-book-sticky::-webkit-scrollbar {
          width: 10px;
        }

        .gsv-book-sticky::-webkit-scrollbar-thumb {
          background: rgba(167, 125, 31, 0.18);
          border-radius: 999px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .gsv-book-card-head {
          margin-bottom: 18px;
        }

        .gsv-book-loading {
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(22, 22, 22, 0.55);
          font-weight: 600;
        }

        .gsv-book-week-block + .gsv-book-week-block {
          margin-top: 26px;
          padding-top: 26px;
          border-top: 1px solid rgba(22, 22, 22, 0.08);
        }

        .gsv-book-week-title {
          font-size: 15px;
          font-weight: 700;
          color: #2b2b2b;
          margin-bottom: 14px;
        }

        .gsv-book-days {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          align-items: start;
        }

        .gsv-book-day {
          min-height: 518px;
          padding: 14px;
          border-radius: 22px;
          background: #fbfaf7;
          border: 1px solid rgba(22, 22, 22, 0.08);
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .gsv-book-day-head {
          padding-bottom: 12px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(22, 22, 22, 0.08);
        }

        .gsv-book-day-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .gsv-book-day-name {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #303030;
        }

        .gsv-book-day-num {
          min-width: 30px;
          height: 30px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(214, 168, 79, 0.18);
          color: #7b5b14;
          font-weight: 800;
          font-size: 13px;
        }

        .gsv-book-day-meta {
          font-size: 12px;
          color: rgba(22, 22, 22, 0.48);
        }

        .gsv-book-slots {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .gsv-book-slot {
          border: 1px solid rgba(167, 125, 31, 0.18);
          background: #fff;
          color: #2b2b2b;
          border-radius: 14px;
          padding: 11px 10px;
          font-weight: 700;
          font-size: 13px;
          text-align: center;
          transition: 0.18s ease;
        }

        button.gsv-book-slot {
          cursor: pointer;
        }

        button.gsv-book-slot:hover {
          border-color: rgba(167, 125, 31, 0.38);
          background: #fff8eb;
          transform: translateY(-1px);
        }

        .gsv-book-slot.is-active {
          background: linear-gradient(180deg, #f0d28d 0%, #e2bb64 100%);
          border-color: #c4952b;
          color: #241a07;
          box-shadow: 0 8px 18px rgba(214, 168, 79, 0.22);
        }

        .gsv-book-slot-disabled {
          background: #f3f1eb;
          color: rgba(22, 22, 22, 0.32);
          border-color: rgba(22, 22, 22, 0.08);
          cursor: not-allowed;
        }

        .gsv-book-more {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .gsv-book-more-btn {
          border: 1px solid rgba(22, 22, 22, 0.1);
          background: #fff;
          color: #222;
          border-radius: 999px;
          padding: 12px 18px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background 180ms ease,
            border-color 180ms ease,
            transform 180ms ease;
        }

        .gsv-book-more-btn:hover:not(:disabled) {
          background: #fff8eb;
          border-color: rgba(167, 125, 31, 0.3);
          transform: translateY(-1px);
        }

        .gsv-book-more-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .gsv-book-selected {
          margin: 18px 0 20px;
          padding: 14px 16px;
          border-radius: 18px;
          background: #fbf5e9;
          border: 1px solid rgba(167, 125, 31, 0.16);
        }

        .gsv-book-selected-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          color: #a77d1f;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .gsv-book-selected-value {
          font-size: 15px;
          font-weight: 700;
          color: #1e1e1e;
          line-height: 1.5;
        }

        .gsv-book-required-note {
          margin: 2px 0 10px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(22, 22, 22, 0.58);
        }

        .gsv-required {
          color: #b42318;
          font-weight: 800;
        }

        .gsv-book-form {
          display: grid;
          gap: 14px;
        }

        .gsv-book-field label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #272727;
        }

        .gsv-book-field input,
        .gsv-book-field textarea {
          width: 100%;
          border: 1px solid rgba(22, 22, 22, 0.1);
          background: #fff;
          color: #161616;
          border-radius: 16px;
          padding: 14px 14px;
          outline: none;
          font: inherit;
        }

        .gsv-book-field input::placeholder,
        .gsv-book-field textarea::placeholder {
          color: rgba(22, 22, 22, 0.36);
        }

        .gsv-book-field input:focus,
        .gsv-book-field textarea:focus {
          border-color: rgba(167, 125, 31, 0.35);
          box-shadow: 0 0 0 3px rgba(214, 168, 79, 0.12);
        }

        .gsv-book-submit {
          margin-top: 4px;
          border: none;
          border-radius: 999px;
          padding: 15px 18px;
          font-size: 15px;
          font-weight: 800;
          color: #231906;
          background: linear-gradient(180deg, #f0d28d 0%, #e0b655 100%);
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(214, 168, 79, 0.18);
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            opacity 180ms ease,
            filter 180ms ease;
        }

        .gsv-book-submit:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .gsv-book-submit:disabled {
          opacity: 0.48;
          cursor: not-allowed;
          box-shadow: none;
          filter: saturate(0.7);
        }

        .gsv-book-note {
          margin-top: 14px;
          font-size: 13px;
        }

        @media (max-width: 1220px) {
          .gsv-book-top,
          .gsv-book-main {
            grid-template-columns: 1fr;
          }

          .gsv-book-hero,
          .gsv-book-expect {
            height: auto;
          }

          .gsv-book-sticky-wrap {
            position: static;
          }

          .gsv-book-sticky {
            max-height: none;
            overflow: visible;
          }
        }

        @media (max-width: 900px) {
          .gsv-book-days {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .gsv-book-page {
            padding: 20px 14px 40px;
          }

          .gsv-book-hero,
          .gsv-book-expect,
          .gsv-book-card {
            padding: 18px;
            border-radius: 22px;
          }

          .gsv-book-days {
            grid-template-columns: 1fr;
          }

          .gsv-book-hero h1 {
            font-size: clamp(38px, 12vw, 56px);
          }
        }
      `}</style>
    </main>
  );
}