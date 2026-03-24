"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

function clean(v?: string | null) {
  return String(v ?? "").trim();
}

function formatDateTimePT(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

export default function BookConsultConfirmedPage() {
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
    <main className="gsv-confirm-page">
      <div className="gsv-confirm-shell">
        <section className="gsv-confirm-hero">
          <div className="gsv-confirm-eyebrow">BOOKING CONFIRMED</div>
          <h1>You’re all set.</h1>
          <p>
            Your GSV Tech consultation has been booked successfully.
            A confirmation email with a calendar attachment has been sent to{" "}
            <strong>{email || "your email address"}</strong>.
          </p>
        </section>

        <section className="gsv-confirm-grid">
          <div className="gsv-confirm-card">
            <div className="gsv-confirm-eyebrow">APPOINTMENT DETAILS</div>
            <h2>Consultation summary</h2>

            <div className="gsv-confirm-detail-list">
              <div className="gsv-confirm-row">
                <span>Name</span>
                <strong>{name || "—"}</strong>
              </div>
              <div className="gsv-confirm-row">
                <span>Email</span>
                <strong>{email || "—"}</strong>
              </div>
              <div className="gsv-confirm-row">
                <span>Phone</span>
                <strong>{phone || "—"}</strong>
              </div>
              <div className="gsv-confirm-row">
                <span>Company</span>
                <strong>{company || "—"}</strong>
              </div>
              <div className="gsv-confirm-row">
                <span>Starts</span>
                <strong>{startDisplay || "—"}</strong>
              </div>
              <div className="gsv-confirm-row">
                <span>Ends</span>
                <strong>{endDisplay || "—"}</strong>
              </div>
            </div>

            {questions ? (
              <div className="gsv-confirm-notes">
                <div className="gsv-confirm-notes-label">What can we help with?</div>
                <p>{questions}</p>
              </div>
            ) : null}
          </div>

          <div className="gsv-confirm-card">
            <div className="gsv-confirm-eyebrow">NEXT STEPS</div>
            <h2>Join information</h2>

            <div className="gsv-confirm-actions">
              {zoomJoinUrl ? (
                <a
                  className="gsv-confirm-btn gsv-confirm-btn-primary"
                  href={zoomJoinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Join Zoom Meeting
                </a>
              ) : null}
            </div>

            {zoomPasscode ? (
              <div className="gsv-confirm-passcode">
                <span>Zoom Passcode</span>
                <strong>{zoomPasscode}</strong>
              </div>
            ) : null}

            <div className="gsv-confirm-footnote">
              If you do not see the confirmation email, check your spam or promotions folder.
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .gsv-confirm-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(214, 168, 79, 0.12), transparent 28%),
            linear-gradient(180deg, #f7f3ea 0%, #f8f5ee 48%, #f3efe6 100%);
          color: #161616;
          padding: 34px 20px 70px;
        }

        .gsv-confirm-shell {
          max-width: 1180px;
          margin: 0 auto;
        }

        .gsv-confirm-hero,
        .gsv-confirm-card {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(25, 25, 25, 0.08);
          border-radius: 28px;
          box-shadow: 0 10px 40px rgba(22, 22, 22, 0.06), 0 2px 10px rgba(22, 22, 22, 0.03);
        }

        .gsv-confirm-hero {
          padding: 32px;
          margin-bottom: 22px;
        }

        .gsv-confirm-eyebrow {
          display: inline-block;
          margin-bottom: 12px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: #a77d1f;
          text-transform: uppercase;
        }

        .gsv-confirm-hero h1 {
          margin: 0 0 14px;
          font-size: clamp(42px, 6vw, 72px);
          line-height: 0.96;
          letter-spacing: -0.05em;
        }

        .gsv-confirm-hero p,
        .gsv-confirm-notes p,
        .gsv-confirm-footnote {
          color: rgba(22, 22, 22, 0.72);
          line-height: 1.65;
        }

        .gsv-confirm-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
          gap: 22px;
          align-items: start;
        }

        .gsv-confirm-card {
          padding: 24px;
        }

        .gsv-confirm-card h2 {
          margin: 0 0 16px;
          font-size: 28px;
          line-height: 1.05;
          letter-spacing: -0.03em;
        }

        .gsv-confirm-detail-list {
          display: grid;
          gap: 12px;
        }

        .gsv-confirm-row {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 14px 16px;
          border-radius: 16px;
          background: #fbfaf7;
          border: 1px solid rgba(22, 22, 22, 0.08);
        }

        .gsv-confirm-row span {
          color: rgba(22, 22, 22, 0.58);
          font-weight: 700;
        }

        .gsv-confirm-row strong {
          text-align: right;
        }

        .gsv-confirm-notes {
          margin-top: 18px;
          padding: 16px;
          border-radius: 18px;
          background: #fbf5e9;
          border: 1px solid rgba(167, 125, 31, 0.16);
        }

        .gsv-confirm-notes-label {
          margin-bottom: 8px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          color: #a77d1f;
          text-transform: uppercase;
        }

        .gsv-confirm-notes p {
          margin: 0;
          white-space: pre-wrap;
        }

        .gsv-confirm-actions {
          display: grid;
          gap: 12px;
        }

        .gsv-confirm-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 0 18px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 800;
          transition: 180ms ease;
        }

        .gsv-confirm-btn-primary {
          color: #231906;
          background: linear-gradient(180deg, #f0d28d 0%, #e0b655 100%);
          box-shadow: 0 10px 24px rgba(214, 168, 79, 0.18);
        }

        .gsv-confirm-btn:hover {
          transform: translateY(-1px);
        }

        .gsv-confirm-passcode {
          margin-top: 18px;
          padding: 14px 16px;
          border-radius: 18px;
          background: #fbf5e9;
          border: 1px solid rgba(167, 125, 31, 0.16);
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
        }

        .gsv-confirm-passcode span {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #a77d1f;
          text-transform: uppercase;
        }

        .gsv-confirm-passcode strong {
          font-size: 18px;
        }

        .gsv-confirm-footnote {
          margin-top: 16px;
          font-size: 13px;
        }

        @media (max-width: 980px) {
          .gsv-confirm-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .gsv-confirm-page {
            padding: 20px 14px 40px;
          }

          .gsv-confirm-hero,
          .gsv-confirm-card {
            padding: 18px;
            border-radius: 22px;
          }

          .gsv-confirm-row {
            flex-direction: column;
          }

          .gsv-confirm-row strong {
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}