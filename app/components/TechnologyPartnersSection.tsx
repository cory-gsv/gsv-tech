"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

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
    logo: "/assets/images/vendor-logos/yealink-192.webp",
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
    logo: "/assets/images/vendor-logos/crestron-96.webp",
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

const partnerLoopCopies = [0, 1];

function TechnologyPartnerCard({
  partner,
  ariaHidden,
}: {
  partner: TechnologyPartner;
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="gsv-redesign-partner-card"
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      <strong>{partner.name}</strong>
      <span>{partner.description}</span>
      <img
        src={partner.logo}
        alt=""
        aria-hidden="true"
        draggable={false}
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
  const beltRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startTime: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const animationDuration = partners.length * 4.4;

  const getBeltAnimation = () => beltRef.current?.getAnimations()[0];

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const animation = getBeltAnimation();
    if (!animation) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    animation.pause();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startTime: Number(animation.currentTime ?? 0),
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const belt = beltRef.current;
    const animation = getBeltAnimation();

    if (!drag || drag.pointerId !== event.pointerId || !belt || !animation) return;

    const loopDistance = belt.scrollWidth / 2;
    if (loopDistance <= 0) return;

    const durationMs = animationDuration * 1000;
    const millisecondsPerPixel = durationMs / loopDistance;
    const dragDirection = reverse ? 1 : -1;
    const nextTime =
      drag.startTime +
      (event.clientX - drag.startX) * millisecondsPerPixel * dragDirection;

    animation.currentTime = ((nextTime % durationMs) + durationMs) % durationMs;
  };

  const finishDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragRef.current = null;
    setIsDragging(false);
    getBeltAnimation()?.play();
  };

  return (
    <div className={`gsv-redesign-partner-row${reverse ? " is-reverse" : ""}`}>
      <div className="gsv-redesign-partner-row-label">{label}</div>
      <div
        className={`gsv-redesign-partner-marquee${isDragging ? " is-dragging" : ""}`}
        aria-label={`${label} platforms`}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDragging}
        onPointerCancel={finishDragging}
      >
        <div
          ref={beltRef}
          className="gsv-redesign-partner-belt"
          style={{ animationDuration: `${animationDuration}s` }}
        >
          {partnerLoopCopies.map((copyIndex) =>
            partners.map((partner) => (
              <TechnologyPartnerCard
                key={`${partner.name}-${copyIndex}`}
                partner={partner}
                ariaHidden={copyIndex !== 0}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}

function TechnologyPartnerRows() {
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsRunning(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`gsv-redesign-partner-rows${isRunning ? " is-running" : ""}`}
    >
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

      <TechnologyPartnerRows />
    </section>
  );
}
