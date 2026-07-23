"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
  links?: ChatMessageLink[];
};

type ChatMessageLink = {
  label: string;
  href: string;
};

type LeadMode = "consult" | "call";

type Slot = {
  start: string;
  end: string;
};

type Day = {
  date: string;
  slots: Slot[];
};

type ChatCapture = {
  mode: LeadMode;
  step: "name" | "phone" | "slot" | "email" | "submitting";
  name: string;
  phone: string;
  email: string;
  slots: Slot[];
  selectedSlot: Slot | null;
};

type ConfirmationPayload = {
  start?: string | null;
  end?: string | null;
  email?: string | null;
  zoomJoinUrl?: string | null;
  calendarHtmlLink?: string | null;
};

const starterMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I can help with managed IT, networks, smart home automation, or booking a consult.",
};

const quickPrompts = [
  "What does managed IT include?",
  "Do you support home networks?",
  "How do I book a consult?",
];

const nextStepPrompt =
  "Do you want to book a consult or have us give you a call?";

const companyPhoneNumber = "(916) 432-3373";
const companyEmailAddress = "info@gsvisions.com";
const phoneCandidatePattern = /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/;
const smsConsentText =
  "I consent to receive conversational SMS/text messages from Golden State Visions. Messages may relate to inquiries, appointment scheduling, confirmations, service coordination, support requests, and follow-up conversations. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Phone numbers and SMS opt-in information are not shared with third parties for marketing purposes. See our Privacy Policy at https://gsvisions.com/privacy-policy and SMS Terms & Conditions at https://gsvisions.com/sms-terms.";

export default function SiteChatWidget() {
  const pathname = usePathname();
  const currentPathname = pathname || "";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [capture, setCapture] = useState<ChatCapture | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const visibleMessages = useMemo(
    () => messages.filter((message) => message.content.trim()),
    [messages],
  );

  const lastAssistantMessage = [...visibleMessages]
    .reverse()
    .find((message) => message.role === "assistant");

  const showNextStepActions =
    !capture &&
    !isLoading &&
    Boolean(lastAssistantMessage && hasNextStepPrompt(lastAssistantMessage.content));

  const showConsultSlotActions =
    Boolean(capture?.mode === "consult" && capture.step === "slot" && capture.slots.length > 0) &&
    !isLoading;

  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleMessages.length, isLoading, showNextStepActions, showConsultSlotActions]);

  if (currentPathname.startsWith("/billing")) return null;

  const beginCaptureFlow = (mode: LeadMode, userMessage: string) => {
    setHasInteracted(true);
    setCapture({
      mode,
      step: "name",
      name: "",
      phone: "",
      email: "",
      slots: [],
      selectedSlot: null,
    });
    setMessages((current) => [
      ...current,
      { role: "user", content: userMessage },
      {
        role: "assistant",
        content:
          mode === "call"
            ? "Absolutely. What is your name?"
            : "Absolutely. I can help book that. What is your name?",
      },
    ]);
    setInput("");
  };

  const handleNextStepChoice = (mode: LeadMode) => {
    beginCaptureFlow(
      mode,
      mode === "call" ? "Have Golden State Visions call me" : "Book a consult",
    );
  };

  const invokeBookingFunction = async (body: Record<string, unknown>) => {
    const response = await fetch("/api/book-consult", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data: unknown = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      throw new Error(
        getResponseString(data, "error") ||
          getResponseString(data, "message") ||
          `Booking request failed with ${response.status}`,
      );
    }

    return data;
  };

  const loadConsultSlots = async () => {
    const baseWeekStart = getStartOfWeek(new Date());
    const upcomingSlots: Slot[] = [];

    for (let weekOffset = 0; weekOffset < 4 && upcomingSlots.length < 6; weekOffset += 1) {
      const weekStart = addDays(baseWeekStart, weekOffset * 7);
      const weekEnd = addDays(weekStart, 7);
      const data = await invokeBookingFunction({
        action: "availability",
        start: weekStart.toISOString(),
        end: weekEnd.toISOString(),
      });

      for (const day of getAvailabilityDays(data)) {
        const weekday = new Date(`${day.date}T00:00:00`).getDay();

        if (weekday === 0 || weekday === 6) continue;

        for (const slot of day.slots) {
          if (new Date(slot.start).getTime() > Date.now()) {
            upcomingSlots.push(slot);
          }
        }
      }
    }

    return upcomingSlots
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 6);
  };

  const submitCallbackRequest = async (
    nextCapture: ChatCapture,
    userMessage: ChatMessage,
  ) => {
    const transcript = buildTranscript([...messages, userMessage]);

    setCapture({ ...nextCapture, step: "submitting" });
    setMessages((current) => [
      ...current,
      userMessage,
      {
        role: "assistant",
        content: "Thanks. I am sending that callback request now.",
      },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nextCapture.name,
          phone: nextCapture.phone,
          company: "AI chat visitor",
          inquiryType: "AI chat callback request",
          source: `AI chat on ${currentPathname || "/"}`,
          message: [
            "The visitor asked Golden State Visions to call them.",
            `Phone: ${nextCapture.phone}`,
            `Latest project context: ${getLatestProjectContext(messages) || "Not provided."}`,
            `Chat transcript:\n${transcript}`,
          ].join("\n\n"),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "The callback request could not be sent.");
      }

      setCapture(null);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `Thanks, ${getFirstName(nextCapture.name)}. I sent your callback request to Golden State Visions. We will call ${nextCapture.phone}.`,
        },
      ]);
    } catch (error) {
      setCapture({ ...nextCapture, step: "phone" });
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `I could not send that callback request: ${getErrorMessage(error, "Unknown error")}. You can also call Golden State Visions at ${companyPhoneNumber}.`,
        },
      ]);
    } finally {
      setIsLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const offerConsultSlots = async (
    nextCapture: ChatCapture,
    userMessage: ChatMessage,
  ) => {
    setCapture({ ...nextCapture, step: "submitting" });
    setMessages((current) => [
      ...current,
      userMessage,
      {
        role: "assistant",
        content: "Thanks. I am checking the consultation calendar now.",
      },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const slots = await loadConsultSlots();

      if (!slots.length) {
        throw new Error("No open consultation times were returned.");
      }

      setCapture({ ...nextCapture, step: "slot", slots });
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Here are the soonest available 30-minute consultation times. Pick one below, or type the number you want.",
        },
      ]);
    } catch (error) {
      setCapture(null);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `I could not load calendar times right now: ${getErrorMessage(error, "Unknown error")}. I can still have Golden State Visions call you at ${nextCapture.phone}, or you can call ${companyPhoneNumber}.`,
        },
      ]);
    } finally {
      setIsLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const selectConsultSlot = (slot: Slot, userText = formatChatSlotLabel(slot.start)) => {
    if (!capture || capture.mode !== "consult" || isLoading) return;

    setCapture({
      ...capture,
      step: "email",
      selectedSlot: slot,
    });
    setMessages((current) => [
      ...current,
      { role: "user", content: userText },
      {
        role: "assistant",
        content: "Great. What email should we send the calendar invite to?",
      },
    ]);
    setInput("");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const bookConsultFromChat = async (
    nextCapture: ChatCapture,
    userMessage: ChatMessage,
  ) => {
    if (!nextCapture.selectedSlot) return;

    const transcript = buildTranscript([...messages, userMessage]);

    setCapture({ ...nextCapture, step: "submitting" });
    setMessages((current) => [
      ...current,
      userMessage,
      {
        role: "assistant",
        content: "Thanks. I am booking that consultation now.",
      },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await invokeBookingFunction({
        action: "consult_book",
        name: nextCapture.name,
        email: nextCapture.email,
        phone: nextCapture.phone,
        company: "AI chat visitor",
        questions: [
          getLatestProjectContext(messages) || "Consult booked through the AI assistant.",
          `Chat transcript:\n${transcript}`,
        ].join("\n\n"),
        smsConsent: false,
        smsConsentText,
        start: nextCapture.selectedSlot.start,
        end: nextCapture.selectedSlot.end,
      });

      const confirmation = getConfirmationPayload(
        result && typeof result === "object"
          ? (result as Record<string, unknown>).confirmation
          : undefined,
      );
      const start = confirmation?.start || nextCapture.selectedSlot.start;
      const calendarLine = confirmation?.calendarHtmlLink
        ? `\nCalendar link: ${confirmation.calendarHtmlLink}`
        : "";
      const zoomLine = confirmation?.zoomJoinUrl
        ? `\nZoom link: ${confirmation.zoomJoinUrl}`
        : "";
      const confirmationLinks = getConfirmationLinks(confirmation);

      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nextCapture.name,
            email: nextCapture.email,
            phone: nextCapture.phone,
            company: "AI chat visitor",
            preferredTime: formatChatSlotLabel(start),
            inquiryType: "AI chat booked consult",
            source: `AI chat on ${currentPathname || "/"}`,
            message: [
              "The visitor booked a consultation through the AI assistant.",
              `Selected time: ${formatChatSlotLabel(start)}`,
              calendarLine.trim(),
              zoomLine.trim(),
              `Latest project context: ${getLatestProjectContext(messages) || "Not provided."}`,
              `Chat transcript:\n${transcript}`,
            ]
              .filter(Boolean)
              .join("\n\n"),
          }),
        });
      } catch {
        // The calendar booking succeeded, so do not show a visitor-facing error for notification email failure.
      }

      setCapture(null);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `You are booked for ${formatChatSlotLabel(start)}. I sent the calendar invite to ${nextCapture.email}. The invite works with Gmail, Outlook, Apple Calendar, and other calendar apps.`,
          links: confirmationLinks,
        },
      ]);
    } catch (error) {
      setCapture({ ...nextCapture, step: "email" });
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `I could not finish the booking: ${getErrorMessage(error, "Unknown error")}. Please try another email, or call Golden State Visions at ${companyPhoneNumber}.`,
        },
      ]);
    } finally {
      setIsLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleCaptureMessage = async (cleanText: string) => {
    if (!capture || capture.step === "submitting") return false;

    const userMessage: ChatMessage = { role: "user", content: cleanText };

    if (capture.step === "name") {
      const phone = extractPhoneNumber(cleanText);
      const name = cleanNameFromReply(cleanText);

      if (!name) {
        setMessages((current) => [
          ...current,
          userMessage,
          {
            role: "assistant",
            content: "What name should Golden State Visions use for the request?",
          },
        ]);
        setInput("");
        return true;
      }

      const nextCapture: ChatCapture = {
        ...capture,
        name,
        phone: phone || capture.phone,
        step: phone ? "submitting" : "phone",
      };

      if (phone && capture.mode === "call") {
        await submitCallbackRequest(nextCapture, userMessage);
        return true;
      }

      if (phone && capture.mode === "consult") {
        await offerConsultSlots(nextCapture, userMessage);
        return true;
      }

      setCapture({ ...nextCapture, step: "phone" });
      setMessages((current) => [
        ...current,
        userMessage,
        {
          role: "assistant",
          content: `Thanks, ${getFirstName(name)}. What phone number should Golden State Visions call?`,
        },
      ]);
      setInput("");
      return true;
    }

    if (capture.step === "phone") {
      const phone = extractPhoneNumber(cleanText) || cleanText;

      if (!isValidPhone(phone)) {
        setMessages((current) => [
          ...current,
          userMessage,
          {
            role: "assistant",
            content: "Please send a 10-digit phone number with area code.",
          },
        ]);
        setInput("");
        return true;
      }

      const nextCapture: ChatCapture = {
        ...capture,
        phone: phone.trim(),
      };

      if (capture.mode === "call") {
        await submitCallbackRequest(nextCapture, userMessage);
        return true;
      }

      await offerConsultSlots(nextCapture, userMessage);
      return true;
    }

    if (capture.step === "slot") {
      const slot = parseSlotChoice(cleanText, capture.slots);

      if (!slot) {
        setMessages((current) => [
          ...current,
          userMessage,
          {
            role: "assistant",
            content:
              "Please choose one of the available time buttons, or type a number like 1, 2, or 3.",
          },
        ]);
        setInput("");
        return true;
      }

      selectConsultSlot(slot, cleanText);
      return true;
    }

    if (capture.step === "email") {
      const email = extractEmail(cleanText);

      if (!email) {
        setMessages((current) => [
          ...current,
          userMessage,
          {
            role: "assistant",
            content: "What email should Golden State Visions use for the calendar invite?",
          },
        ]);
        setInput("");
        return true;
      }

      await bookConsultFromChat({ ...capture, email }, userMessage);
      return true;
    }

    return false;
  };

  const sendMessage = async (messageText: string) => {
    const cleanText = messageText.trim();
    if (!cleanText || isLoading) return;

    setHasInteracted(true);

    if (capture) {
      await handleCaptureMessage(cleanText);
      return;
    }

    if (isCompanyPhoneQuestion(cleanText)) {
      setMessages((current) => [
        ...current,
        { role: "user", content: cleanText },
        {
          role: "assistant",
          content: `You can call Golden State Visions at ${companyPhoneNumber}.`,
        },
      ]);
      setInput("");
      return;
    }

    if (isCompanyEmailQuestion(cleanText)) {
      setMessages((current) => [
        ...current,
        { role: "user", content: cleanText },
        {
          role: "assistant",
          content: `You can email Golden State Visions at ${companyEmailAddress}.`,
        },
      ]);
      setInput("");
      return;
    }

    const decision = getNextStepDecision(cleanText);

    if (decision === "call" || decision === "consult") {
      beginCaptureFlow(decision, cleanText);
      return;
    }

    if (
      lastAssistantMessage &&
      hasNextStepPrompt(lastAssistantMessage.content) &&
      decision === "choose"
    ) {
      setMessages((current) => [
        ...current,
        { role: "user", content: cleanText },
        {
          role: "assistant",
          content: "Great. Choose the next step that works best for you.",
        },
      ]);
      setInput("");
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: cleanText },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/site-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: currentPathname,
          messages: nextMessages.slice(1),
        }),
      });

      const data = await response.json().catch(() => ({}));

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data?.reply ||
            data?.error ||
            "I could not reach the AI chat right now. You can still book a consult and Golden State Visions can review the details directly.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I could not reach the AI chat right now. You can still book a consult and Golden State Visions can review the details directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className={`gsv-chat${isOpen ? " is-open" : ""}`}>
      {isOpen ? (
        <section
          id="gsv-chat-panel"
          className="gsv-chat-panel"
          aria-label="Golden State Visions AI chat"
        >
          <div className="gsv-chat-head">
            <div>
              <span>GOLDEN STATE VISIONS AI</span>
              <strong>Ask us anything</strong>
            </div>
            <button
              type="button"
              className="gsv-chat-close"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
            >
              x
            </button>
          </div>

          <div ref={logRef} className="gsv-chat-log" aria-live="polite">
            {visibleMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`gsv-chat-message is-${message.role}`}
              >
                <span>{message.content}</span>
                {message.links?.length ? (
                  <div className="gsv-chat-message-links">
                    {message.links.map((link) => (
                      <a
                        key={`${link.label}-${link.href}`}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {isLoading ? (
              <div className="gsv-chat-message is-assistant">Thinking...</div>
            ) : null}
            {showNextStepActions ? (
              <div className="gsv-chat-actions" aria-label="Choose next step">
                <button type="button" onClick={() => handleNextStepChoice("consult")}>
                  Book a consult
                </button>
                <button type="button" onClick={() => handleNextStepChoice("call")}>
                  Have us call you
                </button>
              </div>
            ) : null}
            {showConsultSlotActions && capture?.mode === "consult" ? (
              <div className="gsv-chat-slot-actions" aria-label="Choose consultation time">
                {capture.slots.map((slot, index) => (
                  <button
                    key={slot.start}
                    type="button"
                    onClick={() => selectConsultSlot(slot)}
                  >
                    <span>{index + 1}. {formatChatSlotButtonLabel(slot.start)}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div
            className={`gsv-chat-prompts${hasInteracted ? " is-hidden" : ""}`}
            aria-label="Suggested questions"
            aria-hidden={hasInteracted}
          >
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendMessage(prompt)}
                disabled={isLoading || hasInteracted}
                tabIndex={hasInteracted ? -1 : 0}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form className="gsv-chat-form" onSubmit={handleChatSubmit}>
            <label htmlFor="gsv-chat-input">ASK A QUESTION</label>
            <textarea
              ref={inputRef}
              id="gsv-chat-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about services, coverage areas, or getting started..."
              rows={2}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              Send
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="gsv-chat-launcher"
        aria-label="Open Golden State Visions AI assistant"
        aria-expanded={isOpen}
        aria-controls="gsv-chat-panel"
        onClick={() => {
          setIsOpen((open) => !open);
          window.setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        <span className="gsv-chat-launcher-icon" aria-hidden="true">
          ?
        </span>
        <strong>
          <small>AI Assistant</small>
          <div className="gsv-chat-launcher-label">
            Ask Golden State <mark>Visions</mark>
          </div>
        </strong>
      </button>
    </div>
  );
}

function hasNextStepPrompt(content: string) {
  return (
    content.includes(nextStepPrompt) ||
    content.includes("Choose the next step that works best for you.")
  );
}

function getNextStepDecision(value: string): LeadMode | "choose" | null {
  const text = value.toLowerCase().trim();

  if (
    /\b(callback|call me|call back|contact me|give me a call|have.*call (me|you))\b/.test(text)
  ) {
    return "call";
  }

  if (/\b(book|consult|consultation|consulation|schedule|appointment)\b/.test(text)) {
    return "consult";
  }

  if (/^(yes|yeah|yep|yup|sure|ok|okay|please|sounds good|lets do it|let's do it)$/.test(text)) {
    return "choose";
  }

  return null;
}

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

function getAvailabilityDays(data: unknown) {
  if (!data || typeof data !== "object") return [];

  const rawDays = (data as Record<string, unknown>).days;
  return Array.isArray(rawDays) ? rawDays.filter(isDay) : [];
}

function getConfirmationPayload(value: unknown) {
  return value && typeof value === "object"
    ? (value as ConfirmationPayload)
    : undefined;
}

function getConfirmationLinks(confirmation: ConfirmationPayload | undefined) {
  const links: ChatMessageLink[] = [];

  if (confirmation?.calendarHtmlLink && isSafeExternalLink(confirmation.calendarHtmlLink)) {
    links.push({
      label: "Calendar Event",
      href: confirmation.calendarHtmlLink,
    });
  }

  if (confirmation?.zoomJoinUrl && isSafeExternalLink(confirmation.zoomJoinUrl)) {
    links.push({
      label: "Zoom Link",
      href: confirmation.zoomJoinUrl,
    });
  }

  return links;
}

function isSafeExternalLink(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
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

function formatChatSlotLabel(iso: string) {
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

  return `${day} at ${time} PT`;
}

function formatChatSlotButtonLabel(iso: string) {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  return `${day}, ${time} PT`;
}

function extractPhoneNumber(value: string) {
  const match = value.match(phoneCandidatePattern);
  return match ? normalizePhoneNumber(match[0]) : "";
}

function isValidPhone(value: string) {
  return Boolean(normalizePhoneNumber(value));
}

function normalizePhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  const number = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (number.length !== 10) return "";

  const areaCode = number.slice(0, 3);
  const exchange = number.slice(3, 6);
  const line = number.slice(6);

  if (!/^[2-9]\d{2}$/.test(areaCode)) return "";
  if (!/^[2-9]\d{2}$/.test(exchange)) return "";
  if (/^(\d)\1{9}$/.test(number)) return "";
  if (areaCode === "555" || exchange === "555") return "";

  return `(${areaCode}) ${exchange}-${line}`;
}

function extractEmail(value: string) {
  const match = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match?.[0]?.trim() || "";
}

function cleanNameFromReply(value: string) {
  const phone = value.match(phoneCandidatePattern)?.[0] || "";
  const email = extractEmail(value);
  let name = value
    .replace(phone, "")
    .replace(email, "")
    .replace(/\b(my name is|name is|this is|i am|i'm|im)\b/gi, "")
    .replace(/\b(and\s+)?(my\s+)?(phone|number|cell|mobile|callback number|call me at)\b.*$/gi, "")
    .replace(/\b(call me|book a consult|book a consultation|consultation|consult|please|yes|yeah|yep|sure|ok|okay)\b/gi, "")
    .replace(/[.,:;!?()[\]{}"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (name.split(" ").length > 4) {
    name = "";
  }

  return name;
}

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || "there";
}

function parseSlotChoice(value: string, slots: Slot[]) {
  const text = value.toLowerCase().trim();
  const numericChoice = Number.parseInt(text, 10);

  if (Number.isInteger(numericChoice) && slots[numericChoice - 1]) {
    return slots[numericChoice - 1];
  }

  return slots.find((slot) => {
    const label = formatChatSlotLabel(slot.start).toLowerCase();
    const buttonLabel = formatChatSlotButtonLabel(slot.start).toLowerCase();
    return label.includes(text) || buttonLabel.includes(text);
  });
}

function buildTranscript(messages: ChatMessage[]) {
  return messages
    .slice(-10)
    .map((message) => `${message.role === "assistant" ? "Assistant" : "Visitor"}: ${message.content}`)
    .join("\n");
}

function isCompanyPhoneQuestion(value: string) {
  const text = value.toLowerCase().trim();

  return (
    /\b(what'?s|what is|whats|give me|share|tell me)\b.*\b(phone|number|telephone)\b/.test(text) ||
    /\b(phone|telephone|contact)\s+number\b/.test(text) ||
    /\bhow (can|do) i (call|reach|contact) (you|golden state visions)\b/.test(text) ||
    /\bwhat number (can|do) i call\b/.test(text)
  );
}

function isCompanyEmailQuestion(value: string) {
  const text = value.toLowerCase().trim();

  return (
    /\b(what'?s|what is|whats|give me|share|tell me)\b.*\b(email|email address|e-mail)\b/.test(text) ||
    /\b(email|e-mail)\s+address\b/.test(text) ||
    /\bhow (can|do) i (email|message|contact) (you|golden state visions)\b/.test(text) ||
    /\bwhere (can|do) i (email|send an email)\b/.test(text)
  );
}

function getLatestProjectContext(messages: ChatMessage[]) {
  return (
    [...messages]
      .reverse()
      .find(
        (message) =>
          message.role === "user" && !getNextStepDecision(message.content),
      )?.content || ""
  );
}
