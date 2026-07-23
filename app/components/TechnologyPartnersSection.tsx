"use client";

import { type PointerEvent, useEffect, useRef } from "react";

type TechnologyPartner = {
  name: string;
  description: string;
  logo: string;
  wideLogo?: boolean;
};

const businessTechnologyPartners: TechnologyPartner[] = [
  {
    name: "Microsoft 365",
    description: "Cloud email, identity, licensing, and administration",
    logo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=96",
  },
  {
    name: "Google Workspace",
    description: "Business email, collaboration, identity, and administration",
    logo: "/assets/images/vendor-logos/google-workspace.svg",
    wideLogo: true,
  },
  {
    name: "Microsoft Teams",
    description: "Teams phones, meeting rooms, calling, and collaboration",
    logo: "https://www.google.com/s2/favicons?domain=teams.microsoft.com&sz=96",
  },
  {
    name: "Zoom",
    description: "Zoom meetings, phone, rooms, webinars, and administration",
    logo: "https://cdn.simpleicons.org/zoom/0B5CFF",
  },
  {
    name: "Yealink",
    description: "Desk phones, conference phones, and room devices",
    logo: "/assets/images/vendor-logos/yealink.png",
    wideLogo: true,
  },
  {
    name: "Logitech",
    description: "Meeting room cameras, speaker bars, and collaboration hardware",
    logo: "https://www.google.com/s2/favicons?domain=logitech.com&sz=96",
  },
  {
    name: "NinjaOne",
    description: "Monitoring, patching, maintenance, and automation",
    logo: "https://www.google.com/s2/favicons?domain=ninjaone.com&sz=96",
  },
  {
    name: "Bitdefender",
    description: "Endpoint protection and security controls",
    logo: "https://www.google.com/s2/favicons?domain=bitdefender.com&sz=96",
  },
  {
    name: "SentinelOne",
    description: "EDR and advanced threat detection",
    logo: "https://www.google.com/s2/favicons?domain=sentinelone.com&sz=96",
  },
  {
    name: "UniFi",
    description: "Business networking, Wi-Fi, cameras, access, and site visibility",
    logo: "https://www.google.com/s2/favicons?domain=ui.com&sz=96",
  },
  {
    name: "Cisco",
    description: "Switching, routing, wireless, and enterprise network infrastructure",
    logo: "/assets/images/vendor-logos/cisco.svg",
  },
  {
    name: "Juniper",
    description: "Business switching, routing, security, and network operations",
    logo: "https://www.google.com/s2/favicons?domain=juniper.net&sz=96",
  },
  {
    name: "Palo Alto Networks",
    description: "Firewall, security policy, and advanced threat prevention",
    logo: "https://www.google.com/s2/favicons?domain=www.paloaltonetworks.com&sz=96",
  },
  {
    name: "Fortinet",
    description: "Firewalls, secure networking, VPN, and threat protection",
    logo: "https://www.google.com/s2/favicons?domain=fortinet.com&sz=96",
  },
];

const homeTechnologyPartners: TechnologyPartner[] = [
  {
    name: "UniFi",
    description: "Home networking, Wi-Fi, cameras, access, and remote visibility",
    logo: "https://www.google.com/s2/favicons?domain=ui.com&sz=96",
  },
  {
    name: "Lutron HomeWorks",
    description: "Lighting control and premium residential automation",
    logo: "https://www.google.com/s2/favicons?domain=lutron.com&sz=96",
  },
  {
    name: "Control4",
    description: "Whole-home control, scenes, and user interfaces",
    logo: "https://www.google.com/s2/favicons?domain=control4.com&sz=96",
  },
  {
    name: "Crestron",
    description: "AV control, conference rooms, automation, and user interfaces",
    logo: "/assets/images/vendor-logos/crestron.png",
  },
  {
    name: "Savant",
    description: "Premium smart home control, lighting, audio, and scenes",
    logo: "https://www.google.com/s2/favicons?domain=savant.com&sz=96",
  },
  {
    name: "ELAN",
    description: "Residential control, media, security, and automation systems",
    logo: "https://www.google.com/s2/favicons?domain=elancontrolsystems.com&sz=96",
  },
  {
    name: "Sonos",
    description: "Distributed audio and everyday music control",
    logo: "https://www.google.com/s2/favicons?domain=sonos.com&sz=96",
  },
  {
    name: "Russound",
    description: "Multi-room audio distribution and residential sound systems",
    logo: "https://www.google.com/s2/favicons?domain=russound.com&sz=96",
  },
  {
    name: "Sonance",
    description: "Architectural speakers and premium installed audio",
    logo: "https://www.google.com/s2/favicons?domain=sonance.com&sz=96",
  },
  {
    name: "AudioControl",
    description: "Amplification, signal processing, and high-performance audio",
    logo: "https://www.google.com/s2/favicons?domain=audiocontrol.com&sz=96",
  },
  {
    name: "Marantz",
    description: "AV receivers, theater audio, and premium media systems",
    logo: "https://www.google.com/s2/favicons?domain=marantz.com&sz=96",
  },
];

const partnerLoopCopies = [0, 1, 2];

function TechnologyPartnerCard({ partner }: { partner: TechnologyPartner }) {
  return (
    <div className="gsv-redesign-partner-card">
      <strong>{partner.name}</strong>
      <span>{partner.description}</span>
      <img
        src={partner.logo}
        alt=""
        aria-hidden="true"
        className={`gsv-redesign-partner-logo${partner.wideLogo ? " is-wide" : ""}`}
      />
    </div>
  );
}

function TechnologyPartnerRow({
  label,
  partners,
  reverse = false,
}: {
  label: string;
  partners: TechnologyPartner[];
  reverse?: boolean;
}) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);
  const dragStateRef = useRef({
    pointerId: -1,
    lastX: 0,
    isDragging: false,
  });

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const measureAndCenter = () => {
      const firstTrack = marquee.querySelector<HTMLElement>(".gsv-redesign-partner-track");
      if (!firstTrack) return;

      const gap = parseFloat(window.getComputedStyle(marquee).columnGap || "0");
      const nextLoopWidth = firstTrack.scrollWidth + gap;
      loopWidthRef.current = nextLoopWidth;

      if (nextLoopWidth > 0 && marquee.scrollLeft < 1) {
        marquee.scrollLeft = nextLoopWidth;
      }
    };

    const wrapScroll = () => {
      const loopWidth = loopWidthRef.current;
      if (!loopWidth) return;

      if (marquee.scrollLeft < loopWidth * 0.5) {
        marquee.scrollLeft += loopWidth;
      } else if (marquee.scrollLeft > loopWidth * 1.5) {
        marquee.scrollLeft -= loopWidth;
      }
    };

    measureAndCenter();

    const resizeObserver = new ResizeObserver(measureAndCenter);
    resizeObserver.observe(marquee);
    marquee.addEventListener("scroll", wrapScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      marquee.removeEventListener("scroll", wrapScroll);
    };
  }, [partners.length]);

  const wrapDraggedScroll = (marquee: HTMLDivElement) => {
    const loopWidth = loopWidthRef.current;
    if (!loopWidth) return;

    if (marquee.scrollLeft < loopWidth * 0.5) {
      marquee.scrollLeft += loopWidth;
    } else if (marquee.scrollLeft > loopWidth * 1.5) {
      marquee.scrollLeft -= loopWidth;
    }
  };

  const stopDragging = () => {
    const marquee = marqueeRef.current;
    if (marquee) {
      marquee.classList.remove("is-dragging");
    }
    dragStateRef.current.isDragging = false;
    dragStateRef.current.pointerId = -1;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const marquee = event.currentTarget;
    dragStateRef.current = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      isDragging: true,
    };
    marquee.classList.add("is-dragging");
    marquee.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging || dragState.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.currentTarget.scrollLeft -= event.clientX - dragState.lastX;
    dragState.lastX = event.clientX;
    wrapDraggedScroll(event.currentTarget);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.pointerId === event.pointerId) {
      stopDragging();
    }
  };

  return (
    <div className={`gsv-redesign-partner-row${reverse ? " is-reverse" : ""}`}>
      <div className="gsv-redesign-partner-row-label">{label}</div>
      <div
        ref={marqueeRef}
        className="gsv-redesign-partner-marquee"
        aria-label={`${label} platforms`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={stopDragging}
        onPointerLeave={stopDragging}
      >
        {partnerLoopCopies.map((copyIndex) => (
          <div
            key={copyIndex}
            className="gsv-redesign-partner-track"
            aria-hidden={copyIndex === 0 ? undefined : "true"}
          >
            {partners.map((partner) => (
              <TechnologyPartnerCard
                key={`${partner.name}-${copyIndex}`}
                partner={partner}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechnologyPartnersSection() {
  return (
    <section className="gsv-service-partners gsv-redesign-partners gsv-section gsv-section-alt" aria-labelledby="technology-partners-heading">
      <div className="gsv-section-head gsv-redesign-partners-head">
        <div className="gsv-eyebrow">Technology Partners</div>
        <h2 id="technology-partners-heading">
          Platforms we design, deploy, and support.
        </h2>
        <p>
          Golden State Visions works across business IT, cybersecurity,
          networking, automation, lighting, control, and audio platforms so
          clients have one team coordinating the full environment.
        </p>
      </div>

      <div className="gsv-redesign-partner-rows">
        <TechnologyPartnerRow
          label="Business IT & Security"
          partners={businessTechnologyPartners}
        />
        <TechnologyPartnerRow
          label="Home Automation & AV"
          partners={homeTechnologyPartners}
          reverse
        />
      </div>
    </section>
  );
}
