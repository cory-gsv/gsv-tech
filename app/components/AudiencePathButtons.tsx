"use client";

import { useState } from "react";
import styles from "@/app/concept/concept.module.css";

export type ServiceAudience = "business" | "home";

type AudiencePathButtonsProps = {
  audience?: ServiceAudience;
  defaultAudience?: ServiceAudience;
  onChoose?: (audience: ServiceAudience) => void;
  targetId?: string;
};

function BusinessIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 21h18" />
      <path d="M5 21V8l7-4 7 4v13" />
      <path d="M9 21v-5h6v5" />
      <path d="M8 10h2M14 10h2M8 13h2M14 13h2" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v10h13V10" />
      <path d="M9 20v-6h6v6" />
      <path d="m17 4 3 3" />
    </svg>
  );
}

export default function AudiencePathButtons({
  audience,
  defaultAudience = "business",
  onChoose,
  targetId = "service-paths",
}: AudiencePathButtonsProps) {
  const [internalAudience, setInternalAudience] =
    useState<ServiceAudience>(defaultAudience);
  const selectedAudience = audience ?? internalAudience;

  function choose(nextAudience: ServiceAudience) {
    if (audience === undefined) {
      setInternalAudience(nextAudience);
    }

    if (onChoose) {
      onChoose(nextAudience);
      return;
    }

    window.dispatchEvent(
      new CustomEvent("gsv:choose-audience", {
        detail: { audience: nextAudience },
      }),
    );

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const section = document.getElementById(targetId);
        if (!section) return;

        window.scrollTo({
          top: section.getBoundingClientRect().top + window.scrollY,
          behavior: "auto",
        });
      });
    });
  }

  return (
    <div className={styles.heroActions}>
      <button
        type="button"
        className={`${styles.primaryButton} ${
          selectedAudience === "business" ? styles.activeButton : ""
        }`}
        onClick={() => choose("business")}
      >
        <span className={styles.buttonIcon}>
          <BusinessIcon />
        </span>
        I need business help
      </button>
      <button
        type="button"
        className={`${styles.secondaryButton} ${
          selectedAudience === "home" ? styles.activeButton : ""
        }`}
        onClick={() => choose("home")}
      >
        <span className={styles.buttonIcon}>
          <HomeIcon />
        </span>
        I’m planning a home project
      </button>
    </div>
  );
}
