"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import detailStyles from "../managed-it/managed-it.module.css";
import styles from "./resources.module.css";

const FAQ_ROTATION_INTERVAL_MS = 10_000;
const CARD_EXPANSION_SCROLL_DELAY_MS = 240;
const MOBILE_CARD_SCROLL_MEDIA_QUERY = "(max-width: 680px)";

type ResourceFaqItem = {
  question: string;
  answer: string;
};

export default function ResourceFaqExplorer({
  items,
}: {
  items: readonly ResourceFaqItem[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    items.length ? 0 : null,
  );
  const [autoRotate, setAutoRotate] = useState(true);
  const rotationTimerRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoRotate || items.length < 2) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (reducedMotion.matches) return;

    rotationTimerRef.current = window.setTimeout(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === null ? 0 : (currentIndex + 1) % items.length,
      );
    }, FAQ_ROTATION_INTERVAL_MS);

    return () => {
      if (rotationTimerRef.current !== null) {
        window.clearTimeout(rotationTimerRef.current);
        rotationTimerRef.current = null;
      }
    };
  }, [activeIndex, autoRotate, items.length]);

  useEffect(
    () => () => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    },
    [],
  );

  function pauseAutoRotation() {
    setAutoRotate(false);

    if (rotationTimerRef.current !== null) {
      window.clearTimeout(rotationTimerRef.current);
      rotationTimerRef.current = null;
    }
  }

  function selectItem(index: number, card: HTMLElement | null) {
    pauseAutoRotation();
    const isOpening = activeIndex !== index;

    setActiveIndex(isOpening ? index : null);

    if (
      !isOpening ||
      !card ||
      !window.matchMedia(MOBILE_CARD_SCROLL_MEDIA_QUERY).matches
    ) {
      return;
    }

    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(() => {
      const behavior = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
        ? "auto"
        : "smooth";

      card.scrollIntoView({ behavior, block: "start" });
      scrollTimerRef.current = null;
    }, CARD_EXPANSION_SCROLL_DELAY_MS);
  }

  return (
    <div
      className={detailStyles.serviceExplorer}
      data-auto-rotate={autoRotate}
      onPointerDownCapture={pauseAutoRotation}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          pauseAutoRotation();
          setActiveIndex(null);
        }
      }}
    >
      <div className={detailStyles.serviceList}>
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const number = String(index + 1).padStart(2, "0");
          const panelId = `resource-faq-panel-${number}`;

          return (
            <article
              className={`${detailStyles.serviceItem} ${
                isActive ? detailStyles.serviceItemActive : ""
              }`}
              key={item.question}
            >
              <div className={detailStyles.serviceRow}>
                <button
                  type="button"
                  className={detailStyles.serviceRowButton}
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  aria-label={`${
                    isActive ? "Hide" : "View"
                  } answer for ${item.question}`}
                  onClick={(event) =>
                    selectItem(
                      index,
                      event.currentTarget.closest("article"),
                    )
                  }
                />

                <span className={detailStyles.cardNumber}>{number}</span>
                <span className={detailStyles.cardCategory}>FAQ</span>
                <h3>{item.question}</h3>
                <span
                  className={detailStyles.serviceRowIcon}
                  aria-hidden="true"
                >
                  <span />
                  <span />
                </span>
              </div>

              <div
                className={`${detailStyles.servicePanel} ${
                  isActive ? detailStyles.servicePanelActive : ""
                }`}
                id={panelId}
                aria-hidden={!isActive}
              >
                <div className={detailStyles.servicePanelClip}>
                  <div
                    className={`${detailStyles.servicePanelContent} ${styles.faqPanelContent}`}
                  >
                    <div className={styles.faqAnswer}>
                      <h4>Answer</h4>
                      <p>{item.answer}</p>
                    </div>

                    <div
                      className={`${detailStyles.servicePanelAside} ${styles.faqAside}`}
                    >
                      <h4>Need help applying this?</h4>
                      <p>
                        We can review your environment and recommend the
                        practical next step.
                      </p>
                      <Link
                        href="/book-consult"
                        tabIndex={isActive ? undefined : -1}
                      >
                        Ask about this topic{" "}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
