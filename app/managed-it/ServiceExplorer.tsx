"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./managed-it.module.css";

const SERVICE_ROTATION_INTERVAL_MS = 10_000;
const CARD_EXPANSION_SCROLL_DELAY_MS = 240;
const MOBILE_CARD_SCROLL_MEDIA_QUERY = "(max-width: 680px)";

export type ServiceExplorerItem = {
  number: string;
  category: string;
  title: string;
  description: string;
  items: readonly string[];
  bestFor: string;
  platforms: readonly string[];
  outcome: string;
};

type ServiceExplorerLabels = {
  bestFor: string;
  included: string;
  platforms: string;
  outcome: string;
  cta: string;
};

const defaultLabels: ServiceExplorerLabels = {
  bestFor: "Best fit",
  included: "What's included",
  platforms: "Platforms & tools",
  outcome: "Expected outcome",
  cta: "Discuss this service",
};

function ServicePanel({
  service,
  isActive,
  labels,
  ctaHref,
}: {
  service: ServiceExplorerItem;
  isActive: boolean;
  labels: ServiceExplorerLabels;
  ctaHref: string;
}) {
  return (
    <div
      className={`${styles.servicePanel} ${
        isActive ? styles.servicePanelActive : ""
      }`}
      id={`service-panel-${service.number}`}
      aria-hidden={!isActive}
    >
      <div className={styles.servicePanelClip}>
        <div className={styles.servicePanelContent}>
          <div className={styles.serviceOverview}>
            <p>{service.description}</p>
            <h4>{labels.bestFor}</h4>
            <p>{service.bestFor}</p>
          </div>

          <div className={styles.detailIncluded}>
            <h4>{labels.included}</h4>
            <ul>
              {service.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.servicePanelAside}>
            <h4>{labels.platforms}</h4>
            <div className={styles.platformList}>
              {service.platforms.map((platform) => (
                <span key={platform}>{platform}</span>
              ))}
            </div>

            <h4>{labels.outcome}</h4>
            <p>{service.outcome}</p>

            <Link href={ctaHref} tabIndex={isActive ? undefined : -1}>
              {labels.cta} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceExplorer({
  services,
  labels = defaultLabels,
  ctaHref = "/book-consult",
}: {
  services: readonly ServiceExplorerItem[];
  labels?: ServiceExplorerLabels;
  ctaHref?: string;
}) {
  const [activeNumber, setActiveNumber] = useState<string | null>(
    services[0]?.number ?? null,
  );
  const [autoRotate, setAutoRotate] = useState(true);
  const rotationTimerRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoRotate || services.length < 2) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (reducedMotion.matches) return;

    rotationTimerRef.current = window.setTimeout(() => {
      setActiveNumber((currentNumber) => {
        const currentIndex = Math.max(
          0,
          services.findIndex((service) => service.number === currentNumber),
        );

        return services[(currentIndex + 1) % services.length].number;
      });
    }, SERVICE_ROTATION_INTERVAL_MS);

    return () => {
      if (rotationTimerRef.current !== null) {
        window.clearTimeout(rotationTimerRef.current);
        rotationTimerRef.current = null;
      }
    };
  }, [activeNumber, autoRotate, services]);

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

  function selectService(
    number: string,
    card: HTMLElement | null,
  ) {
    pauseAutoRotation();
    const isOpening = activeNumber !== number;

    setActiveNumber(isOpening ? number : null);

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
      className={styles.serviceExplorer}
      data-auto-rotate={autoRotate}
      onPointerDownCapture={pauseAutoRotation}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          pauseAutoRotation();
          setActiveNumber(null);
        }
      }}
    >
      <div className={styles.serviceList}>
        {services.map((service) => {
          const isActive = service.number === activeNumber;

          return (
            <article
              className={`${styles.serviceItem} ${
                isActive ? styles.serviceItemActive : ""
              }`}
              key={service.title}
            >
              <div className={styles.serviceRow}>
                <button
                  type="button"
                  className={styles.serviceRowButton}
                  aria-expanded={isActive}
                  aria-controls={`service-panel-${service.number}`}
                  aria-label={`${
                    isActive ? "Hide" : "View"
                  } details for ${service.title}`}
                  onClick={(event) =>
                    selectService(
                      service.number,
                      event.currentTarget.closest("article"),
                    )
                  }
                />

                <span className={styles.cardNumber}>{service.number}</span>
                <span className={styles.cardCategory}>{service.category}</span>
                <h3>{service.title}</h3>
                <span className={styles.serviceRowIcon} aria-hidden="true">
                  <span />
                  <span />
                </span>
              </div>

              <ServicePanel
                service={service}
                isActive={isActive}
                labels={labels}
                ctaHref={ctaHref}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}
