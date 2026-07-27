"use client";

import JsonLd from "@/app/components/JsonLd";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { contactPageStructuredData } from "@/app/data/structuredData";
import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          company: formData.get("company"),
          inquiryType: formData.get("inquiryType"),
          message: formData.get("message"),
          website: formData.get("website"),
          formStartedAt,
          source: "Contact page",
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "We could not send your message.");
      }

      form.reset();
      setFormStartedAt(Date.now());
      setStatus("sent");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not send your message. Please call (916) 909-0500.",
      );
      setStatus("error");
    }
  }

  return (
    <main id="top" className="gsv-page gsv-contact-page">
      <JsonLd data={contactPageStructuredData()} />
      <div className="gsv-shell">
        <SiteHeader />

        <section className="gsv-section gsv-page-hero-section">
          <div className="gsv-section-head">
            <p className="gsv-eyebrow">Contact Golden State Visions</p>
            <h1>Tell us what you need help with.</h1>
            <p>
              Ask a question, request a callback, or tell us about your business,
              home, current systems, or upcoming technology project.
            </p>
          </div>
        </section>

        <section className="gsv-section">
          <div className="gsv-contact gsv-contact-page-card">
            <div className="gsv-contact-copy">
              <p className="gsv-eyebrow">Contact Details</p>
              <h2>A direct path to the right next step.</h2>
              <p>
                We respond to general inquiries within one business day. If you
                are ready to choose a meeting time, use the consultation
                calendar instead.
              </p>

              <dl className="gsv-contact-details">
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href="tel:+19169090500">(916) 909-0500</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href="mailto:info@gsvisions.com">info@gsvisions.com</a>
                  </dd>
                </div>
                <div>
                  <dt>Hours</dt>
                  <dd>Monday–Friday, 8:00 AM–6:00 PM PT</dd>
                </div>
                <div>
                  <dt>Service area</dt>
                  <dd>
                    Placer County, Greater Sacramento, Tahoe communities, the Bay
                    Area, and surrounding Northern California markets.
                  </dd>
                </div>
              </dl>

            </div>

            <form className="gsv-contact-form" onSubmit={handleSubmit}>
              <div className="gsv-visually-hidden" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <label className="gsv-contact-field">
                <span className="gsv-contact-field-label">Name</span>
                <input
                  name="name"
                  autoComplete="name"
                  maxLength={120}
                  required
                />
              </label>

              <label className="gsv-contact-field">
                <span className="gsv-contact-field-label">Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </label>

              <label className="gsv-contact-field">
                <span className="gsv-contact-field-label">
                  Phone <small>optional</small>
                </span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                />
              </label>

              <label className="gsv-contact-field">
                <span className="gsv-contact-field-label">
                  Company or household <small>optional</small>
                </span>
                <input
                  name="company"
                  autoComplete="organization"
                  maxLength={160}
                />
              </label>

              <label className="gsv-contact-field is-full">
                <span className="gsv-contact-field-label">
                  What can we help with?
                </span>
                <select name="inquiryType" defaultValue="General inquiry">
                  <option>General inquiry</option>
                  <option>Managed IT services</option>
                  <option>Networks and security systems</option>
                  <option>Smart home automation</option>
                  <option>Audio, video, or surveillance</option>
                  <option>Existing client question</option>
                </select>
              </label>

              <label className="gsv-contact-field is-full">
                <span className="gsv-contact-field-label">Message</span>
                <textarea
                  name="message"
                  rows={7}
                  maxLength={12000}
                  placeholder="Tell us about your needs, current setup, or project."
                  required
                />
              </label>

              <button
                type="submit"
                className="gsv-button gsv-button-primary gsv-contact-submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>

              <div
                className="gsv-contact-form-status"
                aria-live="polite"
              >
                {status === "sent"
                  ? "Thank you. Your message was sent, and we will follow up within one business day."
                  : error}
              </div>
            </form>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
