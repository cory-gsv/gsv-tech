"use client";

import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";

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

const MINIMUM_BOOKING_NOTICE_MS = 2 * 60 * 60 * 1000;

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

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function getResponseString(data: unknown, key: "error" | "message") {
  if (!data || typeof data !== "object" || !(key in data)) return "";

  const value = (data as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

function isDay(value: unknown): value is Day {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<Day>;
  return typeof candidate.date === "string" && Array.isArray(candidate.slots);
}

function getConfirmationPayload(value: unknown) {
  return value && typeof value === "object"
    ? (value as Partial<ConfirmationPayload>)
    : undefined;
}

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

function formatSelectedTimePT(iso: string) {
  const date = new Date(iso);

  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  return `${day} @ ${time} PT`;
}

function formatWeekLabelFromDate(dateStr: string) {
  const start = new Date(`${dateStr}T00:00:00`);
  const end = addDays(start, 4);

  return `${start.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  })} to ${end.toLocaleDateString("en-US", {
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

function getTodayDatePT() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

function formatCalendarSelectionLabel(dateStr: string, timeLabel: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return `${dateLabel} @ ${timeLabel} PT`;
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
  const [bookingConfirmationOpen, setBookingConfirmationOpen] = useState(false);
  const [bookingConfirmationDetails, setBookingConfirmationDetails] = useState<ConfirmationPayload | null>(null);

  const [days, setDays] = useState<Day[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDirection, setWeekDirection] = useState<"next" | "previous">("next");
  const [weekAnimationKey, setWeekAnimationKey] = useState(0);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedDisplayTime, setSelectedDisplayTime] = useState("");
  const [expandedDays, setExpandedDays] = useState<Set<string>>(() => new Set());
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const submittingRef = useRef(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [questions, setQuestions] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);

  const baseWeekStart = useMemo(() => getStartOfWeek(new Date()), []);
  const todayDate = useMemo(() => getTodayDatePT(), []);

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
      questions.trim().length > 0
    );
  }, [selectedSlot, name, email, emailIsValid, phone, questions]);

  const invokeFunction = useCallback(async (body: unknown) => {
    const res = await fetch("/api/book-consult", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: unknown = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      throw new Error(
        getResponseString(data, "error") ||
          getResponseString(data, "message") ||
          `Request failed with ${res.status}`,
      );
    }

    return data;
  }, []);

  const loadWeek = useCallback(async (offset: number) => {
    const weekStart = addDays(baseWeekStart, offset * 7);
    const weekEnd = addDays(weekStart, 7);

    const data = await invokeFunction({
      action: "availability",
      start: weekStart.toISOString(),
      end: weekEnd.toISOString(),
    });

    const rawDays = data && typeof data === "object"
      ? (data as Record<string, unknown>).days
      : undefined;
    const daysPayload: unknown[] = Array.isArray(rawDays) ? rawDays : [];

    const bookingCutoff = Date.now() + MINIMUM_BOOKING_NOTICE_MS;
    const incomingDays = daysPayload
      .filter((day): day is Day => {
        if (!isDay(day)) return false;

        const weekday = new Date(`${day.date}T00:00:00`).getDay();
        return weekday !== 0 && weekday !== 6;
      })
      .map((day) => ({
        ...day,
        slots: day.slots.filter(
          (slot) => new Date(slot.start).getTime() >= bookingCutoff,
        ),
      }));

    return incomingDays;
  }, [baseWeekStart, invokeFunction]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingInitial(true);
        setError("");
        setDays(await loadWeek(0));
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load availability"));
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, [loadWeek]);

  async function handleWeekChange(direction: "next" | "previous") {
    const nextOffset = weekOffset + (direction === "next" ? 1 : -1);
    if (nextOffset < 0 || nextOffset > 2) return;

    try {
      setLoadingMore(true);
      setError("");
      const nextDays = await loadWeek(nextOffset);
      setDays(nextDays);
      setWeekDirection(direction);
      setWeekOffset(nextOffset);
      setWeekAnimationKey((value) => value + 1);
      setExpandedDays(new Set());
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load availability"));
    } finally {
      setLoadingMore(false);
    }
  }

  function toggleDayExpanded(date: string) {
    setExpandedDays((prev) => {
      const next = new Set(prev);

      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }

      return next;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submittingRef.current) {
      return;
    }

    if (!selectedSlot) {
      setError("Please select a time slot first.");
      return;
    }

    if (
      new Date(selectedSlot.start).getTime() <
      Date.now() + MINIMUM_BOOKING_NOTICE_MS
    ) {
      setSelectedSlot(null);
      setSelectedDisplayTime("");
      setError("Appointments must be booked at least two hours in advance.");
      return;
    }

    if (!name.trim() || !email.trim() || !phone.trim() || !questions.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (!emailIsValid) {
      setError("Please enter a valid email address.");
      return;
    }

    submittingRef.current = true;
    setStatus("Booking your consultation...");
    setError("");

    try {
      const companyForBooking = company.trim() || "Not provided";

      const result = await invokeFunction({
        action: "consult_book",
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: companyForBooking,
        questions: questions.trim(),
        smsConsent,
        smsConsentText:
          "I consent to receive conversational SMS/text messages from Golden State Visions. Messages may relate to inquiries, appointment scheduling, confirmations, service coordination, support requests, and follow-up conversations. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Phone numbers and SMS opt-in information are not shared with third parties for marketing purposes. See our Privacy Policy at https://gsvisions.com/privacy-policy and SMS Terms & Conditions at https://gsvisions.com/sms-terms.",
        start: selectedSlot.start,
        end: selectedSlot.end,
      });

      const resultObject =
        result && typeof result === "object" ? (result as Record<string, unknown>) : {};
      const confirmation = getConfirmationPayload(resultObject.confirmation);
      const confirmedCompany =
        confirmation?.company && confirmation.company !== "Not provided"
          ? confirmation.company
          : company.trim();

      setBookingConfirmationDetails({
        name: confirmation?.name || name.trim(),
        email: confirmation?.email || email.trim(),
        phone: confirmation?.phone || phone.trim(),
        company: confirmedCompany,
        questions: confirmation?.questions || questions.trim(),
        start: confirmation?.start || selectedSlot.start,
        end: confirmation?.end || selectedSlot.end,
        zoomJoinUrl: confirmation?.zoomJoinUrl || "",
        zoomPasscode: confirmation?.zoomPasscode || "",
        calendarHtmlLink: confirmation?.calendarHtmlLink || "",
      });

      setBookingConfirmationOpen(true);
      setStatus("");
    } catch (err: unknown) {
      setStatus("");
      setError(getErrorMessage(err, "Booking failed"));
    } finally {
      submittingRef.current = false;
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

  const formLocked = !selectedSlot;

  return (
    <main id="top" className="gsv-book-page">
      <SiteHeader />

      <div className="gsv-book-shell">
        <section className="gsv-book-section-head">
          <div>
            <div className="gsv-book-eyebrow">BOOK YOUR CONSULTATION</div>
            <h2>Start with a time that works.</h2>
            <p>Select a slot, then add the details we should know before we meet.</p>
          </div>
          <div className="gsv-book-session-meta" aria-label="Meeting details">
            <span>
              <strong>30 min</strong>
              Strategy session
            </span>
            <span>
              <strong>Pacific Time</strong>
              All availability
            </span>
            <span>
              <strong>Video call</strong>
              Zoom link included
            </span>
          </div>
        </section>

        {error ? <div className="gsv-book-alert gsv-book-alert-error">{error}</div> : null}

        <section className="gsv-book-main">
          <div className="gsv-book-left">
            <div className="gsv-book-card">
              <div className="gsv-book-card-head">
                <div>
                  <div className="gsv-book-step-label">
                    <span>01</span>
                    Availability
                  </div>
                  <h2>Choose your time</h2>
                  <p className="gsv-book-card-sub">
                    Select an available time to continue.
                  </p>
                </div>
              </div>

              {loadingInitial ? (
                <div className="gsv-book-loading">Loading availability...</div>
              ) : (
                <>
                  {grouped.map((week) => (
                    <div
                      key={`${week.weekKey}-${weekAnimationKey}`}
                      className={`gsv-book-week-block is-slide-${weekDirection}`}
                    >
                      <div className="gsv-book-week-title">{week.label}</div>

                      <div className="gsv-book-days">
                        {week.days.map((day) => {
                          const displaySlots = buildDailyDisplaySlots(day);
                          const isExpanded = expandedDays.has(day.date);
                          const visibleSlots = isExpanded ? displaySlots : displaySlots.slice(0, 5);
                          const hasMoreSlots = displaySlots.length > 5;
                          const dayHasSelectedSlot = day.slots.some(
                            (slot) => selectedSlot?.start === slot.start,
                          );

                          return (
                            <div
                              key={day.date}
                              className={`gsv-book-day${day.date === todayDate ? " is-today" : ""}`}
                            >
                              <div className="gsv-book-day-head">
                                {day.date === todayDate ? (
                                  <span className="gsv-book-today-label">Today</span>
                                ) : null}
                                <div className="gsv-book-day-row">
                                  <span className="gsv-book-day-name">
                                    {formatDayName(day.date)}
                                  </span>
                                  <span className="gsv-book-day-num">{formatDayNum(day.date)}</span>
                                </div>
                                <div className="gsv-book-day-meta">{day.slots.length} available</div>
                              </div>

                              <div className="gsv-book-slots">
                                {visibleSlots.map((item) => {
                                  const active = Boolean(
                                    item.slot && selectedSlot?.start === item.slot.start,
                                  );
                                  const muted = dayHasSelectedSlot && !active;

                                  if (!item.available) {
                                    return (
                                      <div
                                        key={item.key}
                                        className={`gsv-book-slot gsv-book-slot-disabled${muted ? " is-muted" : ""}`}
                                      >
                                        {item.label}
                                      </div>
                                    );
                                  }

                                  return (
                                    <button
                                      key={item.key}
                                      type="button"
                                      className={`gsv-book-slot${active ? " is-active" : ""}${muted ? " is-muted" : ""}`}
                                      onClick={() => {
                                        if (!item.slot) return;
                                        setSelectedSlot(item.slot);
                                        setSelectedDisplayTime(
                                          formatCalendarSelectionLabel(day.date, item.label),
                                        );
                                        setError("");
                                      }}
                                    >
                                      {item.label}
                                    </button>
                                  );
                                })}

                                {hasMoreSlots ? (
                                  <button
                                    type="button"
                                    className="gsv-book-day-expand"
                                    onClick={() => toggleDayExpanded(day.date)}
                                  >
                                    {isExpanded ? "Show fewer times ↑" : "View all times ↓"}
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="gsv-book-more">
                    {weekOffset > 0 ? (
                      <button
                        type="button"
                        className="gsv-book-more-btn"
                        onClick={() => handleWeekChange("previous")}
                        disabled={loadingMore}
                      >
                        ← Previous Week
                      </button>
                    ) : (
                      <span aria-hidden="true" />
                    )}

                    {weekOffset < 2 ? (
                      <button
                        type="button"
                        className="gsv-book-more-btn"
                        onClick={() => handleWeekChange("next")}
                        disabled={loadingMore}
                      >
                        {loadingMore ? "Loading..." : "Next Week →"}
                      </button>
                    ) : (
                      <span aria-hidden="true" />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="gsv-book-right">
            <div className="gsv-book-sticky-wrap">
              <div className={`gsv-book-card gsv-book-sticky${formLocked ? " is-form-locked" : ""}`}>
                <div className="gsv-book-step-label">
                  <span>02</span>
                  Project details
                </div>
                <h2>Help us prepare</h2>

                <div className={`gsv-book-selected${selectedSlot ? " is-selected" : ""}`}>
                  <div className="gsv-book-selected-label">
                    {selectedSlot ? "CONFIRMED TIME" : "SELECTED TIME"}
                  </div>
                  <div className="gsv-book-selected-value">
                    {selectedSlot
                      ? `📍 ${selectedDisplayTime || formatSelectedTimePT(selectedSlot.start)}`
                      : "Choose a time from the calendar"}
                  </div>
                </div>

                {formLocked ? (
                  <div className="gsv-book-lock-note">
                    Choose any available time. Your project details form will open
                    here next.
                  </div>
                ) : null}

                {!formLocked ? (
                  <>
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
                      disabled={formLocked}
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
                      disabled={formLocked}
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
                      disabled={formLocked}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="gsv-book-field">
                    <label htmlFor="company">
                      Company / household <span className="gsv-optional">(optional)</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      placeholder="Company or household name"
                      disabled={formLocked}
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
                      disabled={formLocked}
                      value={questions}
                      onChange={(e) => setQuestions(e.target.value)}
                    />
                  </div>

                  <label className="gsv-book-consent" htmlFor="smsConsent">
                    <input
                      id="smsConsent"
                      name="smsConsent"
                      type="checkbox"
                      disabled={formLocked}
                      checked={smsConsent}
                      onChange={(e) => setSmsConsent(e.target.checked)}
                    />
                    <span className="gsv-book-consent-copy">
                      <span className="gsv-book-consent-kicker">Optional SMS Consent</span>
                      <p className="gsv-book-consent-lead">
                        I consent to receive conversational SMS/text messages from Golden
                        State Visions.
                      </p>
                      {"\n\n"}
                      <p className="gsv-book-consent-details">
                        Messages may relate to inquiries, appointment scheduling,
                        confirmations, service coordination, support requests, and follow-up
                        conversations. Message frequency varies. Message and data rates may
                        apply. Reply STOP to opt out or HELP for help. Phone numbers and
                        SMS opt-in information are not shared with third parties for
                        marketing purposes. See our{" "}
                        <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
                        <Link href="/sms-terms">SMS Terms &amp; Conditions</Link>.
                      </p>
                    </span>
                  </label>

                  <span className="gsv-book-review-separator" aria-hidden="true">
                    {" "}
                  </span>

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
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      {bookingConfirmationOpen ? (
        <div
          className="gsv-book-confirm-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-confirmation-title"
        >
          <div className="gsv-book-confirm-modal">
            <button
              type="button"
              className="gsv-book-confirm-close"
              aria-label="Close booking confirmation"
              onClick={() => {
                setBookingConfirmationOpen(false);
                window.location.href = "/";
              }}
            >
              ×
            </button>

            <div className="gsv-book-eyebrow">BOOKING CONFIRMED</div>

            <h2 id="booking-confirmation-title">You’re all set.</h2>

            <p>
              Your consultation request has been received. A confirmation email has been sent,
              and we’ll follow up with the next steps.
            </p>

            {bookingConfirmationDetails ? (
              <div className="gsv-book-confirm-details">
                <div>
                  <span>Name</span>
                  <strong>{bookingConfirmationDetails.name}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{bookingConfirmationDetails.email}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{bookingConfirmationDetails.phone}</strong>
                </div>

                {bookingConfirmationDetails.company ? (
                  <div>
                    <span>Company / household</span>
                    <strong>{bookingConfirmationDetails.company}</strong>
                  </div>
                ) : null}

                <div>
                  <span>Start</span>
                  <strong>{formatSelectedTimePT(bookingConfirmationDetails.start)}</strong>
                </div>

                <div>
                  <span>End</span>
                  <strong>{formatSelectedTimePT(bookingConfirmationDetails.end)}</strong>
                </div>

                {bookingConfirmationDetails.zoomPasscode ? (
                  <div>
                    <span>Passcode</span>
                    <strong>{bookingConfirmationDetails.zoomPasscode}</strong>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="gsv-book-confirm-actions">
              {bookingConfirmationDetails?.calendarHtmlLink ? (
                <a
                  href={bookingConfirmationDetails.calendarHtmlLink}
                  target="_blank"
                  rel="noreferrer"
                  className="gsv-btn gsv-btn-primary"
                >
                  Add to Calendar
                </a>
              ) : null}

              {bookingConfirmationDetails?.zoomJoinUrl ? (
                <a
                  href={bookingConfirmationDetails.zoomJoinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="gsv-btn gsv-btn-secondary"
                >
                  Join Zoom
                </a>
              ) : null}

              <button
                type="button"
                className="gsv-btn gsv-btn-primary"
                onClick={() => {
                  setBookingConfirmationOpen(false);
                  window.location.href = "/";
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      ) : null}

      </div>

      <SiteFooter />

      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }

        .gsv-book-page {
          min-height: 100vh;
          background: #f7f5ef;
          color: #161616;
          overflow: clip;
        }

        .gsv-book-page :global(.gsv-footer) {
          margin-top: 80px;
          margin-bottom: 0;
        }

        .gsv-book-shell {
          --gsv-layout-gap: 16px;
          --gsv-left-col: minmax(0, 1.45fr);
          --gsv-right-col: minmax(370px, 0.85fr);
          --gsv-two-col-layout: var(--gsv-left-col) var(--gsv-right-col);
          width: min(calc(100% - 48px), 1280px);
          margin: 0 auto;
        }

        .gsv-book-main {
          display: grid;
          grid-template-columns: var(--gsv-two-col-layout);
          gap: var(--gsv-layout-gap);
          align-items: stretch;
        }

        .gsv-book-section-head {
          padding: clamp(72px, 8vw, 118px) 0 42px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 48px;
          align-items: end;
        }

        .gsv-book-section-head h2 {
          max-width: 720px;
          margin: 0;
          color: #171510;
          font-size: clamp(44px, 5.4vw, 76px);
          font-weight: 400;
          letter-spacing: -0.065em;
          line-height: 0.96;
        }

        .gsv-book-section-head p {
          margin: 22px 0 0;
          color: #6e6a61;
          font-size: 17px;
          line-height: 1.6;
        }

        .gsv-book-session-meta {
          display: grid;
          grid-template-columns: repeat(3, minmax(120px, 1fr));
          border-top: 1px solid rgba(23, 21, 16, 0.14);
          border-bottom: 1px solid rgba(23, 21, 16, 0.14);
        }

        .gsv-book-session-meta span {
          min-width: 140px;
          padding: 18px 20px;
          display: grid;
          gap: 5px;
          color: #777168;
          font-size: 12px;
          line-height: 1.3;
        }

        .gsv-book-session-meta span + span {
          border-left: 1px solid rgba(23, 21, 16, 0.14);
        }

        .gsv-book-session-meta strong {
          color: #171510;
          font-size: 13px;
        }

        .gsv-book-card {
          background: #eeece4;
          border: 1px solid rgba(23, 21, 16, 0.1);
          border-radius: 26px;
          box-shadow: none;
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
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.2em;
          color: #736526;
          text-transform: uppercase;
        }

        .gsv-book-eyebrow::before {
          content: "";
          width: 28px;
          height: 3px;
          flex: 0 0 auto;
          border-radius: 3px;
          background: #f7c744;
        }

        .gsv-book-card h2 {
          margin: 0 0 10px;
          font-size: clamp(29px, 3vw, 42px);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -0.05em;
          color: #171510;
          text-wrap: balance;
        }

        .gsv-book-step-label {
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #736526;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .gsv-book-step-label span {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          color: #171510;
          background: #f7c744;
          border-radius: 50%;
          letter-spacing: 0;
        }

        .gsv-book-alert {
          border-radius: 18px;
          padding: 14px 16px;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 700;
        }

        .gsv-book-alert-error {
          background: #fff1f1;
          border: 1px solid #e9c2c2;
          color: #9e3131;
        }

        .gsv-book-card {
          padding: clamp(26px, 3.4vw, 46px);
          min-width: 0;
          transition:
            transform 220ms ease,
            box-shadow 220ms ease,
            opacity 220ms ease;
        }

        .gsv-book-left > .gsv-book-card {
          overflow: hidden;
        }

        .gsv-book-card-sub {
          margin: 0;
          color: #6e6a61;
          font-size: 15px;
          line-height: 1.55;
        }

        .gsv-book-sticky {
          overflow: visible;
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
          font-weight: 700;
        }

        .gsv-book-week-block + .gsv-book-week-block {
          margin-top: 26px;
          padding-top: 26px;
          border-top: 1px solid rgba(22, 22, 22, 0.08);
        }

        .gsv-book-week-block.is-slide-next {
          animation: gsv-book-week-from-right 520ms cubic-bezier(0.16, 1, 0.3, 1)
            both;
        }

        .gsv-book-week-block.is-slide-previous {
          animation: gsv-book-week-from-left 520ms cubic-bezier(0.16, 1, 0.3, 1)
            both;
        }

        @keyframes gsv-book-week-from-right {
          from {
            transform: translateX(calc(100% + 48px));
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes gsv-book-week-from-left {
          from {
            transform: translateX(calc(-100% - 48px));
          }
          to {
            transform: translateX(0);
          }
        }

        .gsv-book-week-title {
          font-size: 16px;
          font-weight: 800;
          color: #171510;
          margin-bottom: 18px;
        }

        .gsv-book-days {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          align-items: start;
        }

        .gsv-book-day {
          min-height: 0;
          padding: 14px;
          border-radius: 22px;
          background: #f8f6f0;
          border: 1px solid rgba(23, 21, 16, 0.1);
          display: flex;
          flex-direction: column;
          min-width: 0;
          max-height: none;
          overflow: visible;
          overscroll-behavior: auto;
        }

        .gsv-book-day.is-today {
          border-color: #f7c744;
          background: #f8f6f0;
          box-shadow: inset 0 0 0 2px #f7c744;
        }

        .gsv-book-day.is-today .gsv-book-day-head {
          background: #f8f6f0;
        }

        .gsv-book-day.is-today .gsv-book-day-name {
          color: #303030;
        }

        .gsv-book-day.is-today .gsv-book-day-num {
          background: transparent;
          color: #171510;
          border: 2px solid #f7c744;
        }

        .gsv-book-today-label {
          display: block;
          margin-bottom: 8px;
          color: #8a650d;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.16em;
          line-height: 1;
          text-transform: uppercase;
        }

        .gsv-book-day-head {
          position: relative;
          z-index: 2;
          padding-bottom: 12px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(22, 22, 22, 0.08);
          background: #f8f6f0;
          text-align: center;
        }

        .gsv-book-day-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 6px;
          text-align: center;
        }

        .gsv-book-day-name {
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          color: #303030;
        }

        .gsv-book-day-num {
          min-width: 30px;
          height: 30px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(255, 199, 44, 0.24);
          color: #18130a;
          font-weight: 900;
          font-size: 13px;
        }

        .gsv-book-day-meta {
          width: 100%;
          font-size: 12px;
          color: rgba(22, 22, 22, 0.48);
          text-align: center;
        }

        .gsv-book-slots {
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition:
            max-height 240ms ease,
            opacity 180ms ease;
        }

        .gsv-book-slot {
          border: 1px solid rgba(23, 21, 16, 0.12);
          background: transparent;
          color: #171510;
          border-radius: 14px;
          padding: 11px 10px;
          font-weight: 800;
          font-size: 13px;
          text-align: center;
          transition:
            transform 180ms ease,
            background 180ms ease,
            border-color 180ms ease,
            color 180ms ease,
            box-shadow 180ms ease;
        }

        button.gsv-book-slot {
          cursor: pointer;
        }

        button.gsv-book-slot:hover {
          border-color: #171510;
          background: #f7c744;
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(17, 24, 39, 0.08);
        }

        button.gsv-book-slot:focus-visible {
          outline: none;
          border-color: #ffc72c;
          box-shadow:
            0 0 0 3px rgba(255, 199, 44, 0.34),
            0 0 22px rgba(255, 199, 44, 0.42);
        }

        .gsv-book-slot.is-active {
          background: #111111;
          border-color: #ffc72c;
          color: #ffffff;
          box-shadow:
            0 12px 26px rgba(17, 17, 17, 0.22),
            0 0 0 3px rgba(255, 199, 44, 0.18),
            0 0 24px rgba(255, 199, 44, 0.38);
        }

        button.gsv-book-slot.is-active:hover {
          background: #000000;
          border-color: #ffc72c;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow:
            0 16px 32px rgba(17, 17, 17, 0.26),
            0 0 0 4px rgba(255, 199, 44, 0.22),
            0 0 32px rgba(255, 199, 44, 0.52);
        }

        .gsv-book-slot-disabled {
          background: #f3f1eb;
          color: rgba(22, 22, 22, 0.32);
          border-color: rgba(22, 22, 22, 0.08);
          cursor: not-allowed;
          user-select: none;
        }

        .gsv-book-day-expand {
          margin-top: 4px;
          border: 1px solid rgba(17, 24, 39, 0.08);
          background: transparent;
          color: #171510;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          padding: 8px 10px;
          text-align: center;
          transition:
            background 180ms ease,
            border-color 180ms ease,
            color 180ms ease,
            transform 180ms ease;
        }

        .gsv-book-day-expand:hover {
          background: #fff8e8;
          border-color: rgba(255, 199, 44, 0.52);
          color: #7c5a0d;
          transform: translateY(-1px);
        }

        .gsv-book-more {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 20px;
        }

        .gsv-book-more-btn {
          border: 1px solid #171510;
          background: transparent;
          color: #171510;
          border-radius: 999px;
          padding: 12px 18px;
          font-weight: 800;
          cursor: pointer;
          transition:
            background 180ms ease,
            border-color 180ms ease,
            transform 180ms ease;
        }

        .gsv-book-more-btn:hover:not(:disabled) {
          background: #fff8e8;
          border-color: rgba(255, 199, 44, 0.52);
          transform: translateY(-1px);
        }

        .gsv-book-more-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .gsv-book-selected {
          margin: 14px 0 12px;
          padding: 14px 16px;
          border-radius: 18px;
          background: #fbf5e9;
          border: 1px solid rgba(255, 199, 44, 0.28);
          transition:
            background 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .gsv-book-selected.is-selected {
          background: #eefaf2;
          border-color: rgba(18, 135, 70, 0.28);
          box-shadow: 0 10px 24px rgba(18, 135, 70, 0.08);
        }

        .gsv-book-selected-label {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
          color: #8f6a16;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .gsv-book-selected.is-selected .gsv-book-selected-label {
          color: #0f7a3f;
        }

        .gsv-book-selected-value {
          font-size: 15px;
          font-weight: 800;
          color: #1e1e1e;
          line-height: 1.5;
        }

        .gsv-book-lock-note {
          margin: 0;
          padding: 24px;
          border-radius: 18px;
          background: #171510;
          border: 1px solid rgba(247, 199, 68, 0.22);
          color: rgba(248, 245, 236, 0.72);
          font-size: 14px;
          font-weight: 700;
          line-height: 1.55;
        }

        .gsv-book-required-note {
          margin: 0 0 8px;
          font-size: 12px;
          font-weight: 800;
          color: rgba(22, 22, 22, 0.58);
        }

        .gsv-required {
          color: #b42318;
          font-weight: 900;
        }

        .gsv-optional {
          color: rgba(22, 22, 22, 0.48);
          font-weight: 700;
        }

        .gsv-book-form {
          display: grid;
          gap: 10px;
          opacity: 1;
          filter: none;
          transform: translateY(0);
          transition:
            opacity 220ms ease,
            filter 220ms ease,
            transform 220ms ease;
        }

        .gsv-book-sticky.is-form-locked .gsv-book-form {
          opacity: 0.68;
          filter: none;
          user-select: none;
          transform: none;
        }

        .gsv-book-sticky.is-form-locked .gsv-book-required-note,
        .gsv-book-sticky.is-form-locked .gsv-book-note {
          opacity: 0.68;
          filter: none;
        }

        .gsv-book-sticky.is-form-locked .gsv-book-field label {
          color: rgba(39, 39, 39, 0.48);
        }

        .gsv-book-field label {
          display: block;
          margin-bottom: 5px;
          font-size: 12px;
          font-weight: 800;
          color: #272727;
        }

        .gsv-book-field input,
        .gsv-book-field textarea {
          width: 100%;
          border: 1px solid rgba(22, 22, 22, 0.1);
          background: #f8f6f0;
          color: #161616;
          border-radius: 16px;
          padding: 12px 14px;
          outline: none;
          font: inherit;
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease,
            opacity 180ms ease;
        }

        .gsv-book-field input:disabled,
        .gsv-book-field textarea:disabled {
          cursor: not-allowed;
          background: rgba(248, 246, 240, 0.7);
        }

        .gsv-book-field input::placeholder,
        .gsv-book-field textarea::placeholder {
          color: rgba(22, 22, 22, 0.36);
        }

        .gsv-book-field input:focus,
        .gsv-book-field textarea:focus {
          border-color: #ffc72c;
          box-shadow: 0 0 0 3px rgba(255, 199, 44, 0.18);
        }

        .gsv-book-consent {
          display: grid;
          grid-template-columns: 18px minmax(0, 1fr);
          gap: 10px;
          align-items: start;
          margin-top: 2px;
          padding: 12px 14px;
          border: 1px solid rgba(22, 22, 22, 0.1);
          border-radius: 16px;
          background: #fbfaf7;
          color: #272727;
          cursor: pointer;
        }

        .gsv-book-consent input {
          width: 18px;
          height: 18px;
          margin: 2px 0 0;
          accent-color: #111111;
          cursor: pointer;
        }

        .gsv-book-consent input:disabled {
          cursor: not-allowed;
        }

        .gsv-book-consent-copy {
          display: block;
          min-width: 0;
        }

        .gsv-book-consent p {
          margin: 0;
        }

        .gsv-book-consent-kicker {
          display: block;
          margin-bottom: 5px;
          color: rgba(22, 22, 22, 0.54);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .gsv-book-consent-lead {
          color: #272727;
          font-size: 12px;
          line-height: 1.45;
          font-weight: 900;
        }

        .gsv-book-consent-details {
          display: block;
          margin-top: 5px;
          color: rgba(22, 22, 22, 0.66);
          font-size: 12px;
          line-height: 1.55;
        }

        .gsv-book-consent a {
          color: #111111;
          font-weight: 900;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .gsv-book-review-separator {
          display: block;
          width: 0;
          height: 0;
          overflow: hidden;
        }

        .gsv-book-consent:focus-within {
          border-color: #ffc72c;
          box-shadow: 0 0 0 3px rgba(255, 199, 44, 0.18);
        }

        .gsv-book-submit {
          width: 100%;
          margin-top: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          padding: 16px 20px;
          font-size: 15px;
          font-weight: 950;
          letter-spacing: 0.01em;
          color: #ffffff !important;
          background: #0d1b2a !important;
          cursor: pointer;
          box-shadow: 0 16px 32px rgba(13, 27, 42, 0.28);
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            opacity 180ms ease,
            filter 180ms ease,
            background 180ms ease,
            border-color 180ms ease;
        }

        .gsv-book-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #14283d !important;
          border-color: rgba(255, 199, 44, 0.55);
          box-shadow: 0 20px 40px rgba(13, 27, 42, 0.34);
        }

        .gsv-book-submit:focus-visible {
          outline: none;
          border-color: #ffc72c;
          box-shadow:
            0 18px 36px rgba(13, 27, 42, 0.3),
            0 0 0 3px rgba(255, 199, 44, 0.32);
        }

        .gsv-book-submit:disabled {
          opacity: 0.42;
          cursor: not-allowed;
          box-shadow: none;
          filter: saturate(0.7);
        }

        .gsv-book-note {
          margin-top: 14px;
          font-size: 13px;
        }

        .gsv-book-slot.is-muted {
          opacity: 0.6;
        }

        button.gsv-book-slot.is-muted:hover {
          opacity: 0.82;
        }

        .gsv-book-slot-disabled.is-muted,
        .gsv-book-slot-disabled {
          cursor: not-allowed;
        }

        .gsv-book-submit,
        .gsv-book-submit:not(:disabled) {
          color: #ffffff !important;
          background: #111827 !important;
          box-shadow: 0 14px 28px rgba(17, 24, 39, 0.22) !important;
        }

        .gsv-book-submit:hover:not(:disabled) {
          background: #000000 !important;
          color: #ffffff !important;
          box-shadow: 0 16px 34px rgba(17, 24, 39, 0.3) !important;
        }

        .gsv-book-submit,
        .gsv-book-submit:not(:disabled) {
          color: #ffffff !important;
          background: #111111 !important;
          border-color: rgba(255, 199, 44, 0.42) !important;
          box-shadow:
            0 16px 32px rgba(17, 17, 17, 0.24),
            0 0 0 3px rgba(255, 199, 44, 0.12) !important;
        }

        .gsv-book-submit:hover:not(:disabled) {
          color: #ffffff !important;
          background: #000000 !important;
          border-color: #ffc72c !important;
          box-shadow:
            0 20px 40px rgba(17, 17, 17, 0.30),
            0 0 0 4px rgba(255, 199, 44, 0.20),
            0 0 34px rgba(255, 199, 44, 0.50) !important;
        }

        .gsv-book-main {
          align-items: start;
        }

        .gsv-book-right .gsv-book-card {
          padding-top: 20px;
          padding-bottom: 20px;
        }

        .gsv-book-field textarea {
          min-height: 118px;
        }

        .gsv-book-expect-inner {
          justify-content: flex-start;
        }

        .gsv-book-callout strong {
          white-space: normal;
        }

        @media (max-width: 1220px) {
          .gsv-book-main {
            grid-template-columns: 1fr;
          }

          .gsv-book-section-head {
            grid-template-columns: 1fr;
          }

          .gsv-book-session-meta {
            width: 100%;
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

        @media (max-width: 768px) {
          .gsv-book-main {
            grid-template-columns: 1fr;
          }

          .gsv-book-days {
            margin-right: -26px;
            padding-right: 26px;
            display: flex;
            gap: 12px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
          }

          .gsv-book-days::-webkit-scrollbar {
            display: none;
          }

          .gsv-book-day {
            min-width: min(78vw, 270px);
            scroll-snap-align: start;
          }

          .gsv-book-session-meta {
            grid-template-columns: 1fr;
          }

          .gsv-book-session-meta span {
            min-width: 0;
            padding: 14px 0;
          }

          .gsv-book-session-meta span + span {
            border-top: 1px solid rgba(23, 21, 16, 0.14);
            border-left: 0;
          }

          .gsv-book-day {
            max-height: none;
          }

          .gsv-book-sticky-wrap {
            position: static;
          }

          .gsv-book-sticky {
            max-height: none;
            overflow: visible;
          }
        }

        @media (max-width: 640px) {
          .gsv-book-shell {
            width: min(calc(100% - 24px), 1280px);
            margin-top: 24px;
          }

          .gsv-book-page :global(.gsv-footer) {
            margin-top: 48px;
          }

          .gsv-book-card {
            padding: 24px;
            border-radius: 22px;
          }

          .gsv-book-section-head {
            padding: 64px 0 32px;
          }

          .gsv-book-section-head h2 {
            font-size: clamp(42px, 13vw, 60px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gsv-book-week-block.is-slide-next,
          .gsv-book-week-block.is-slide-previous {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
