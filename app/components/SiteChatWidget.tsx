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

type TranscriptVisitorInfo = {
  name: string;
  phone: string;
  email: string;
};

const starterMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hi! Ask me anything. I can answer technology questions, help troubleshoot an issue, explain our services, plan a project, or book a consult.",
};

const quickPrompts = [
  "What does managed IT include?",
  "Do you support home networks?",
  "How do I book a consult?",
];

const nextStepPrompt =
  "Do you want to book a consult or have us give you a call?";
const generalChatLimitMessage =
  "You’ve used the six general-answer allowance. I can still answer questions about Golden State Visions, help you book a consult, or have someone call you.";
const maxGeneralAiResponses = 6;
const transcriptInactivityMs = 5 * 60 * 1_000;
const chatAutoOpenDelayMs = 15_000;
const chatAutoOpenSessionKey = "gsv-chat-auto-opened";
const outsideServiceAreaMessage =
  "It looks like you’re outside our U.S. service area. Golden State Visions currently serves customers in the United States, so chat and appointment requests are unavailable from your location.";

const companyPhoneNumber = "(916) 909-0500";
const companyEmailAddress = "info@gsvisions.com";
const phoneCandidatePattern = /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/;
const smsConsentText =
  "I consent to receive conversational SMS/text messages from Golden State Visions. Messages may relate to inquiries, appointment scheduling, confirmations, service coordination, support requests, and follow-up conversations. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Phone numbers and SMS opt-in information are not shared with third parties for marketing purposes. See our Privacy Policy at https://gsvisions.com/privacy-policy and SMS Terms & Conditions at https://gsvisions.com/sms-terms.";

export default function SiteChatWidget() {
  const pathname = usePathname();
  const currentPathname = pathname || "";
  const isBillingRoute =
    currentPathname.startsWith("/billing") ||
    currentPathname.startsWith("/portal");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [capture, setCapture] = useState<ChatCapture | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [generalAiResponseCount, setGeneralAiResponseCount] = useState(0);
  const [isOutsideUsServiceArea, setIsOutsideUsServiceArea] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const transcriptSessionIdRef = useRef("");
  const messagesRef = useRef(messages);
  const lastTranscriptSentCountRef = useRef(0);
  const hasVisitorControlledChatRef = useRef(false);
  const transcriptVisitorInfoRef = useRef<TranscriptVisitorInfo>({
    name: "",
    phone: "",
    email: "",
  });

  const visibleMessages = useMemo(
    () => messages.filter((message) => message.content.trim()),
    [messages],
  );

  const lastAssistantMessage = [...visibleMessages]
    .reverse()
    .find((message) => message.role === "assistant");
  const hasReachedGeneralChatLimit =
    generalAiResponseCount >= maxGeneralAiResponses;

  const showNextStepActions =
    !isOutsideUsServiceArea &&
    !capture &&
    !isLoading &&
    (hasReachedGeneralChatLimit ||
      Boolean(lastAssistantMessage && hasNextStepPrompt(lastAssistantMessage.content)));

  const showConsultSlotActions =
    !isOutsideUsServiceArea &&
    Boolean(capture?.mode === "consult" && capture.step === "slot" && capture.slots.length > 0) &&
    !isLoading;

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    transcriptSessionIdRef.current =
      window.crypto?.randomUUID?.() ||
      `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }, []);

  useEffect(() => {
    if (isBillingRoute) return;

    let hasAutoOpened = false;

    try {
      hasAutoOpened =
        window.sessionStorage.getItem(chatAutoOpenSessionKey) === "true";
    } catch {
      // The timer can still work when browser storage is unavailable.
    }

    if (hasAutoOpened) return;

    const autoOpenTimer = window.setTimeout(() => {
      if (hasVisitorControlledChatRef.current) return;

      try {
        window.sessionStorage.setItem(chatAutoOpenSessionKey, "true");
      } catch {
        // Opening the chat does not depend on browser storage.
      }

      setIsOpen(true);
    }, chatAutoOpenDelayMs);

    return () => window.clearTimeout(autoOpenTimer);
  }, [isBillingRoute]);

  const sendTranscript = (reason: string) => {
    const transcriptMessages = messagesRef.current.filter((message) =>
      message.content.trim(),
    );
    const hasVisitorMessage = transcriptMessages.some(
      (message) => message.role === "user",
    );

    if (
      !hasVisitorMessage ||
      transcriptMessages.length <= lastTranscriptSentCountRef.current ||
      !transcriptSessionIdRef.current
    ) {
      return;
    }

    lastTranscriptSentCountRef.current = transcriptMessages.length;
    void fetch("/api/chat-transcript", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: transcriptSessionIdRef.current,
        page: currentPathname || "/",
        reason,
        messages: transcriptMessages,
        visitorInfo: transcriptVisitorInfoRef.current,
        clientInfo: {
          referrer: document.referrer || "Direct visit",
          language: navigator.language || "",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
          screen:
            typeof window.screen?.width === "number"
              ? `${window.screen.width} × ${window.screen.height}`
              : "",
        },
      }),
      keepalive: true,
    }).catch(() => {
      lastTranscriptSentCountRef.current = 0;
    });
  };

  useEffect(() => {
    const hasVisitorMessage = messages.some(
      (message) => message.role === "user",
    );
    if (!hasVisitorMessage || isLoading) return;

    const inactivityTimer = window.setTimeout(() => {
      sendTranscript("Five minutes of inactivity");
    }, transcriptInactivityMs);

    return () => window.clearTimeout(inactivityTimer);
  }, [messages, isLoading]);

  useEffect(() => {
    const handlePageHide = () => sendTranscript("Visitor left the page");
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  });

  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleMessages.length, isLoading, showNextStepActions, showConsultSlotActions]);

  useEffect(() => {
    let isActive = true;

    fetch("/api/site-chat", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (isActive && typeof data?.responseCount === "number") {
          setGeneralAiResponseCount(
            Math.min(data.responseCount, maxGeneralAiResponses),
          );
        }
        if (isActive && data?.serviceAreaBlocked === true) {
          setIsOutsideUsServiceArea(true);
          setHasInteracted(true);
          setCapture(null);
          setInput("");
          setMessages([
            {
              role: "assistant",
              content: outsideServiceAreaMessage,
            },
          ]);
        }
      })
      .catch(() => {
        // The chat can still operate if the allowance status check fails.
      });

    return () => {
      isActive = false;
    };
  }, []);

  if (isBillingRoute) return null;

  const markChatAsVisitorControlled = () => {
    hasVisitorControlledChatRef.current = true;

    try {
      window.sessionStorage.setItem(chatAutoOpenSessionKey, "true");
    } catch {
      // Manual chat controls remain available without browser storage.
    }
  };

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
      window.setTimeout(() => sendTranscript("Callback requested"), 0);
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
      window.setTimeout(() => sendTranscript("Consultation booked"), 0);
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
      transcriptVisitorInfoRef.current = {
        ...transcriptVisitorInfoRef.current,
        name,
        phone: phone || transcriptVisitorInfoRef.current.phone,
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
      transcriptVisitorInfoRef.current = {
        ...transcriptVisitorInfoRef.current,
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

      transcriptVisitorInfoRef.current = {
        ...transcriptVisitorInfoRef.current,
        email,
      };
      await bookConsultFromChat({ ...capture, email }, userMessage);
      return true;
    }

    return false;
  };

  const sendMessage = async (messageText: string) => {
    const cleanText = messageText.trim();
    if (!cleanText || isLoading || isOutsideUsServiceArea) return;

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

    if (hasReachedGeneralChatLimit) {
      const companyReply = getLimitedCompanyReply(cleanText);
      setMessages((current) => [
        ...current,
        { role: "user", content: cleanText },
        {
          role: "assistant",
          content:
            companyReply ||
            `${generalChatLimitMessage} Please ask about our services, coverage area, company, or contact options. ${nextStepPrompt}`,
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
          responseCount: generalAiResponseCount,
        }),
      });

      const data = await response.json().catch(() => ({}));
      const nextResponseCount =
        data?.limitReached === true
          ? maxGeneralAiResponses
          : typeof data?.responseCount === "number"
          ? Math.min(data.responseCount, maxGeneralAiResponses)
          : Math.min(generalAiResponseCount + (data?.reply ? 1 : 0), maxGeneralAiResponses);

      setGeneralAiResponseCount(nextResponseCount);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data?.reply ||
            data?.error ||
            "I could not reach the AI chat right now. You can still book a consult and Golden State Visions can review the details directly.",
        },
        ...(nextResponseCount >= maxGeneralAiResponses
          ? [
              {
                role: "assistant" as const,
                content: `${generalChatLimitMessage} ${nextStepPrompt}`,
              },
            ]
          : []),
      ]);
      if (nextResponseCount >= maxGeneralAiResponses) {
        window.setTimeout(() => sendTranscript("Six-answer limit reached"), 0);
      }
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
              onClick={() => {
                markChatAsVisitorControlled();
                sendTranscript("Visitor closed the chat");
                setIsOpen(false);
              }}
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
            <label htmlFor="gsv-chat-input">
              {isOutsideUsServiceArea
                ? "OUTSIDE SERVICE AREA"
                : hasReachedGeneralChatLimit && !capture
                ? "ASK ABOUT GOLDEN STATE VISIONS"
                : "ASK A QUESTION"}
            </label>
            <textarea
              ref={inputRef}
              id="gsv-chat-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                isOutsideUsServiceArea
                  ? "Chat is unavailable outside the United States."
                  : hasReachedGeneralChatLimit && !capture
                  ? "Ask about our services, coverage area, company, or contact options..."
                  : "Type any question—technology, services, projects, or anything else..."
              }
              rows={2}
              disabled={isLoading || isOutsideUsServiceArea}
            />
            <button
              type="submit"
              disabled={
                isLoading ||
                !input.trim() ||
                isOutsideUsServiceArea
              }
            >
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
          markChatAsVisitorControlled();
          setIsOpen((open) => {
            if (open) sendTranscript("Visitor closed the chat");
            return !open;
          });
          window.setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        <span className="gsv-chat-launcher-icon" aria-hidden="true">
          ?
        </span>
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

function getLimitedCompanyReply(value: string) {
  const text = value.toLowerCase();

  if (/\b(hours|open|closing|weekend)\b/.test(text)) {
    return "Golden State Visions is available Monday through Friday, 8:00 AM to 6:00 PM Pacific.";
  }

  if (/\b(where|location|located|service area|coverage|serve|travel)\b/.test(text)) {
    return "Golden State Visions is based in Lincoln and serves Placer County, Greater Sacramento, Tahoe communities, selected Bay Area cities, and surrounding Northern California markets.";
  }

  if (/\b(price|pricing|cost|quote|estimate|rate)\b/.test(text)) {
    return `Pricing depends on the environment, equipment, and project scope. ${nextStepPrompt}`;
  }

  if (/\b(managed it|it support|computer support|help desk|microsoft 365|google workspace)\b/.test(text)) {
    return "Managed IT services include monitoring, patching, endpoint protection, user and device support, Microsoft 365 or Google Workspace administration, backup planning, documentation, procurement, and ongoing technology planning.";
  }

  if (/\b(network|wi-?fi|firewall|cybersecurity|security|switch|vlan|cabling)\b/.test(text)) {
    return "Golden State Visions designs and supports business and residential networks, Wi-Fi, switching, firewalls, segmentation, structured-cabling coordination, and security-system planning.";
  }

  if (/\b(smart home|automation|lighting|shade|thermostat|control system)\b/.test(text)) {
    return "Smart home services include reliable home networking, lighting and climate control, touchscreens, cameras, shades, and integrated systems designed for long-term serviceability.";
  }

  if (/\b(audio|video|speaker|television|tv|projector|surveillance|camera)\b/.test(text)) {
    return "Golden State Visions provides audio, video, and surveillance planning for homes and businesses, including displays, speakers, projectors, distributed audio, cameras, and integrated control.";
  }

  if (/\b(experience|background|why (you|golden state visions)|company|about)\b/.test(text)) {
    return "Golden State Visions is built on more than 18 years of hands-on IT and infrastructure experience, including over a decade supporting one of the world’s top 10 technology companies and opening hundreds of operational locations.";
  }

  if (/\b(portal|invoice|billing|account)\b/.test(text)) {
    return "Existing clients can use the Portal button for billing and account access. For account-specific help, contact Golden State Visions directly.";
  }

  if (/\b(service|offer|do you do|help with|support)\b/.test(text)) {
    return "Golden State Visions provides managed IT, networks and security systems, smart home automation, audio/video and surveillance, cloud-platform administration, technology procurement, and project planning.";
  }

  return "";
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
