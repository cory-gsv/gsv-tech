"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import "./confirmed.css";

function clean(v?: string | null) {
  return String(v ?? "").trim();
}

function formatDateTimePT(iso?: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function Content() {
  const searchParams = useSearchParams();

  const name = clean(searchParams.get("name"));
  const email = clean(searchParams.get("email"));
  const phone = clean(searchParams.get("phone"));
  const company = clean(searchParams.get("company"));
  const questions = clean(searchParams.get("questions"));
  const start = clean(searchParams.get("start"));
  const end = clean(searchParams.get("end"));
  const zoomJoinUrl = clean(searchParams.get("zoomJoinUrl"));
  const zoomPasscode = clean(searchParams.get("zoomPasscode"));

  const startDisplay = useMemo(() => formatDateTimePT(start), [start]);
  const endDisplay = useMemo(() => formatDateTimePT(end), [end]);

  return (
    <>
      <section className="gsv-confirm-hero">
        <div className="gsv-confirm-eyebrow">BOOKING CONFIRMED</div>
        <h1>You’re all set.</h1>
        <p>
          Confirmation sent to <strong>{email}</strong>
        </p>
      </section>

      <section className="gsv-confirm-grid">
        <div className="gsv-confirm-card">
          <div className="gsv-confirm-eyebrow">DETAILS</div>

          <div className="gsv-confirm-row"><span>Name</span><strong>{name}</strong></div>
          <div className="gsv-confirm-row"><span>Email</span><strong>{email}</strong></div>
          <div className="gsv-confirm-row"><span>Phone</span><strong>{phone}</strong></div>
          <div className="gsv-confirm-row"><span>Company</span><strong>{company}</strong></div>
          <div className="gsv-confirm-row"><span>Start</span><strong>{startDisplay}</strong></div>
          <div className="gsv-confirm-row"><span>End</span><strong>{endDisplay}</strong></div>

          {questions && <p>{questions}</p>}
        </div>

        <div className="gsv-confirm-card">
          <div className="gsv-confirm-eyebrow">JOIN</div>

          {zoomJoinUrl && (
            <a className="gsv-confirm-btn" href={zoomJoinUrl} target="_blank">
              Join Zoom
            </a>
          )}

          {zoomPasscode && (
            <div className="gsv-confirm-passcode">
              <span>Passcode</span>
              <strong>{zoomPasscode}</strong>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function Page() {
  return (
    <main className="gsv-confirm-page">
      <div className="gsv-confirm-shell">
        <Suspense fallback={<div>Loading...</div>}>
          <Content />
        </Suspense>
      </div>
    </main>
  );
}