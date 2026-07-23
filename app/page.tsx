"use client";

import JsonLd from "@/app/components/JsonLd";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { homePageStructuredData } from "@/app/data/structuredData";
import Image from "next/image";
import Link from "next/link";
import { type PointerEvent, useEffect, useMemo, useRef, useState } from "react";

type ServiceKey = "managed" | "network" | "smartHome" | "audioVideo";

type ServicePanel = {
  label: string;
  eyebrow: string;
  heroTitle: string;
  heroBody: string;
  panelTitle: string;
  panelBody: string;
  features: string[];
  stats: { value: string; label: string }[];
  foot: string;
  href: string;
  detailsLabel: string;
  image: string;
  imageAlt: string;
};

type SubIcon =
  | "office"
  | "restaurant"
  | "retail"
  | "home"
  | "switch"
  | "wifi"
  | "camera"
  | "shield"
  | "lighting"
  | "touchscreen"
  | "speaker"
  | "display"
  | "warehouse"
  | "medical";

type SubPanel = {
  key: string;
  label: string;
  title: string;
  body: string;
  features: string[];
  stats: { value: string; label: string }[];
  foot: string;
  href: string;
  detailsLabel: string;
  icon: SubIcon;
};

const FLAP_CHARS = "0123456789/%Kmin.d";

const serviceMenuGroups: {
  heading: string;
  items: { key: ServiceKey }[];
}[] = [
  {
    heading: "Business Solutions",
    items: [
      { key: "managed" },
      { key: "network" },
    ],
  },
  {
    heading: "Residential Solutions",
    items: [
      { key: "smartHome" },
      { key: "audioVideo" },
    ],
  },
];

const servicePanels: Record<ServiceKey, ServicePanel> = {
  managed: {
    label: "Managed IT Services",
    eyebrow: "Managed IT + Cybersecurity",
    heroTitle: "Local IT support that actually knows your business",
    heroBody:
      "Golden State Visions is a local team that takes the time to understand how your business really runs, not just your network. We provide managed IT, cybersecurity, cloud administration, and onsite support for offices, warehouses, medical practices, restaurants, and storefronts, with one point of contact, clear ownership, and predictable plans. No vendor runaround, no surprise fees, no support delays.",
    panelTitle: "One IT partner for support, security, and compliance.",
    panelBody:
      "Helpdesk, device management, Microsoft 365 or Google Workspace administration, endpoint protection, procurement, and vendor coordination handled as one accountable service relationship.",
    features: [
      "Remote and onsite support from people who know your environment",
      "Microsoft 365 and Google Workspace setup, administration, and security",
      "Endpoint protection, network health, documentation, and reporting",
      "Predictable plans with clear scope, ownership, and lifecycle planning",
    ],
    stats: [
      { value: "32", label: "Workstations managed" },
      { value: "5", label: "Tickets resolved today" },
      { value: "34", label: "Endpoints protected" },
      { value: "12 min", label: "Avg. first response" },
    ],
    foot:
      "Example snapshot for a professional office, shown for planning context.",
    href: "/services/managed-it",
    detailsLabel: "See full IT services details",
    image: "/assets/images/service-icons/managed-it-services.png",
    imageAlt: "Workstation headset beside a stack of managed business servers",
  },
  network: {
    label: "Networks & Security Systems",
    eyebrow: "NETWORKS + SECURITY SYSTEMS",
    heroTitle: "Network infrastructure that actually holds up.",
    heroBody:
      "Golden State Visions is a local team that builds networks for real physical locations, not just server racks. From business Wi-Fi and firewalls to camera systems, VLANs, structured cabling, and failover internet, we design infrastructure for offices, warehouses, medical practices, restaurants, and storefronts, so an outage never turns into an emergency.",
    panelTitle: "Every register, camera, workstation, and guest device on the right network.",
    panelBody:
      "We design secure network foundations for offices, storefronts, restaurants, and homes, with segmentation and monitoring built in from the start.",
    features: [
      "Firewall, switching, Wi-Fi, and VLAN design",
      "Camera systems and loss-prevention network planning",
      "Guest, staff, POS, and IoT traffic properly separated",
      "Failover internet and documentation for long term support",
    ],
    stats: [
      { value: "8/8", label: "Core switches online" },
      { value: "214", label: "Client devices segmented" },
      { value: "16", label: "Cameras recording" },
      { value: "10 min", label: "Avg. first response" },
    ],
    foot:
      "Example snapshot for a multi-zone storefront network, shown for planning context.",
    href: "/services/networks-security-systems",
    detailsLabel: "See network and security details",
    image: "/assets/images/service-icons/networks-security-systems.png",
    imageAlt: "Network switches with a security shield",
  },
  smartHome: {
    label: "Smart Home Automation",
    eyebrow: "Residential Automation + Control",
    heroTitle: "Smart home systems designed to feel simple after the install is done.",
    heroBody:
      "Golden State Visions is a local team that designs connected homes for how you'll actually live in them, not just for install day. Lighting control, home networking, Wi-Fi, cameras, audio, and control interfaces work together around long term usability, serviceability, and clean everyday control.",
    panelTitle: "A home network as reliable as the lighting.",
    panelBody:
      "Whole-home connectivity, Lutron lighting control, and integrated video designed once, then supported as the home and family routines evolve.",
    features: [
      "Lutron HomeWorks lighting design and programming",
      "Whole-home network planning for every device",
      "Touchscreen, mobile, and scene-based control",
      "Ongoing support as the system grows",
    ],
    stats: [
      { value: "22", label: "Lighting zones programmed" },
      { value: "58", label: "Devices on the home network" },
      { value: "14", label: "Scenes configured" },
      { value: "13 min", label: "Avg. first response" },
    ],
    foot:
      "Example snapshot for a smart-home deployment, shown for planning context.",
    href: "/services/smart-home-automation",
    detailsLabel: "See smart home details",
    image: "/assets/images/service-icons/smart-home-automation.png",
    imageAlt: "Wall touchscreen controlling smart home lighting and climate",
  },
  audioVideo: {
    label: "Audio and Video",
    eyebrow: "Audio + Video + Surveillance",
    heroTitle: "Integrated media and camera systems without the pile of remotes.",
    heroBody:
      "Golden State Visions is a local team that builds audio and video systems for how spaces actually get used, not just what looks impressive on install day. From conference rooms and storefront displays to home theaters, distributed audio, cameras, and outdoor viewing areas, we design systems that stay simple to run long after the remotes get handed over.",
    panelTitle: "Audio, video, and surveillance connected to the network behind them.",
    panelBody:
      "Displays, speakers, cameras, control systems, and network storage are planned together so the experience feels polished and the support path stays clear.",
    features: [
      "TV, projector, speaker, and control system installation",
      "Camera coverage planning with remote access",
      "Network-aware AV design for homes and businesses",
      "Clean handoff, documentation, and ongoing support",
    ],
    stats: [
      { value: "12", label: "Audio zones online" },
      { value: "8", label: "Displays controlled" },
      { value: "10", label: "Cameras monitoring" },
      { value: "9 min", label: "Avg. first response" },
    ],
    foot:
      "Example snapshot for a mixed AV and camera deployment, shown for planning context.",
    href: "/services/audio-video-surveillance",
    detailsLabel: "See audio and video details",
    image: "/assets/images/service-icons/audio-and-video.png",
    imageAlt: "Display, speakers, projector, and wireless audio video equipment",
  },
};

const serviceSubPanels: Record<ServiceKey, SubPanel[]> = {
  managed: [
    {
      key: "offices",
      label: "Professional Offices",
      title: "IT that runs quietly in the background.",
      body:
        "Managed support, secure networking, and Microsoft 365 or Google Workspace administration handled end to end, so your team calls one number instead of three vendors.",
      features: [
        "Unlimited remote helpdesk for the whole team",
        "Microsoft 365 and Google Workspace setup and administration",
        "Secure office networking and firewall management",
        "Hardware procurement, deployment, and lifecycle planning",
      ],
      stats: [
        { value: "32", label: "Workstations managed" },
        { value: "5", label: "Tickets resolved today" },
        { value: "34", label: "Endpoints protected" },
        { value: "12 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a professional office, shown for planning context.",
      href: "/services/managed-it",
      detailsLabel: "See Managed IT Services Details",
      icon: "office",
    },
    {
      key: "warehouses",
      label: "Warehouses & Fulfillment",
      title: "Coverage for scanners, docks, cameras, and inventory stations.",
      body:
        "Warehouse networks need to handle long aisles, handheld scanners, loading docks, cameras, shipping stations, and office workstations without leaving dead zones or mystery devices behind.",
      features: [
        "Warehouse Wi-Fi planning for aisles, racks, and dock doors",
        "Scanner, printer, workstation, and camera network segmentation",
        "Shipping station support for label printers and inventory systems",
        "Coverage planning for cameras, yard areas, and access points",
      ],
      stats: [
        { value: "14", label: "Access points online" },
        { value: "42", label: "Scanners and printers" },
        { value: "12", label: "Dock cameras watched" },
        { value: "15 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a warehouse and fulfillment environment, shown for planning context.",
      href: "/services/managed-it",
      detailsLabel: "See Managed IT Services Details",
      icon: "warehouse",
    },
    {
      key: "medical",
      label: "Medical Offices",
      title: "Stable office technology for patient-facing teams.",
      body:
        "Medical offices need reliable workstations, secure Wi-Fi, phones, printers, cameras, and cloud administration without disrupting the front desk or exam-room workflow.",
      features: [
        "Workstation, printer, and phone support for front desk and exam rooms",
        "Secure Wi-Fi and network segmentation to support HIPAA compliance",
        "Microsoft 365 or Google Workspace administration",
        "Vendor coordination for line-of-business medical platforms",
      ],
      stats: [
        { value: "18", label: "Exam-room devices" },
        { value: "9", label: "Tickets closed today" },
        { value: "22", label: "Mailboxes administered" },
        { value: "9 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a medical office, shown for planning context. Compliance requirements vary by practice and system ownership.",
      href: "/services/managed-it",
      detailsLabel: "See Managed IT Services Details",
      icon: "medical",
    },
    {
      key: "restaurants",
      label: "Restaurants & Cafes",
      title: "Keep the line moving and the register open.",
      body:
        "From the POS at the counter to the printer in the kitchen, Golden State Visions keeps every device on the line talking to each other and keeps card payments running even when the internet hiccups.",
      features: [
        "Failover internet so payments do not stop at the register",
        "Guest Wi-Fi walled off from POS and cameras to support PCI compliance",
        "Kitchen display and printer network tuned for zero dropped tickets",
        "Camera coverage for the line, register, and back door",
      ],
      stats: [
        { value: "99.98%", label: "Checkout network uptime" },
        { value: "41", label: "Guest devices online today" },
        { value: "6", label: "Cameras monitoring the floor" },
        { value: "8 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a restaurant or cafe environment, shown for planning context.",
      href: "/services/networks-security-systems",
      detailsLabel: "See Managed IT Services Details",
      icon: "restaurant",
    },
    {
      key: "retail",
      label: "Retail & Storefronts",
      title: "Every register, every scanner, one network.",
      body:
        "Golden State Visions keeps point-of-sale, inventory scanners, and guest Wi-Fi separated and stable, so a busy Saturday does not mean a frozen register.",
      features: [
        "POS and inventory systems isolated from guest traffic to support PCI compliance",
        "Loss-prevention camera systems with off-site backup",
        "Guest Wi-Fi with basic foot-traffic insight",
        "Seasonal capacity planning ahead of the holiday rush",
      ],
      stats: [
        { value: "8", label: "Registers online" },
        { value: "214", label: "Guest Wi-Fi sessions today" },
        { value: "10", label: "Loss-prevention cameras" },
        { value: "10 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a retail or storefront environment, shown for planning context.",
      href: "/services/audio-video-surveillance",
      detailsLabel: "See Managed IT Services Details",
      icon: "retail",
    },
  ],
  network: [
    {
      key: "switching",
      label: "Switching",
      title: "The wired foundation every system depends on.",
      body:
        "Switching, VLANs, PoE budgets, and rack documentation are planned together so cameras, access points, registers, and workstations have the right path back to the network.",
      features: [
        "Managed switch deployment and port mapping",
        "PoE planning for cameras, phones, and access points",
        "VLAN design for business, guest, POS, and IoT systems",
        "Clean rack labeling and support documentation",
      ],
      stats: [
        { value: "48", label: "Managed switch ports" },
        { value: "6", label: "Network segments" },
        { value: "18", label: "PoE devices powered" },
        { value: "14 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a multi-switch network deployment, shown for planning context.",
      href: "/services/networks-security-systems",
      detailsLabel: "See switching details",
      icon: "switch",
    },
    {
      key: "wifi",
      label: "Wi-Fi",
      title: "Business Wi-Fi that is planned, placed, and measured.",
      body:
        "Access points are placed around real walls, shelves, patios, and work areas, with guest access separated from internal devices.",
      features: [
        "Access point placement and coverage planning",
        "Separate staff, guest, POS, and IoT wireless networks",
        "Roaming and capacity tuning for busy areas",
        "Remote monitoring and support-ready documentation",
      ],
      stats: [
        { value: "9", label: "Access points online" },
        { value: "186", label: "Wi-Fi clients today" },
        { value: "4", label: "Wireless networks" },
        { value: "10 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a high-traffic business Wi-Fi deployment, shown for planning context.",
      href: "/services/networks-security-systems",
      detailsLabel: "See Wi-Fi details",
      icon: "wifi",
    },
    {
      key: "security",
      label: "Security Systems",
      title: "Cameras and security devices that live on a stable network.",
      body:
        "Security cameras, recorders, and access devices are designed as part of the network, not bolted on afterward.",
      features: [
        "Camera placement and recording coverage planning",
        "Secure camera network segmentation",
        "Remote access setup with clear ownership",
        "Retention, storage, and off-site access planning",
      ],
      stats: [
        { value: "16", label: "Cameras recording" },
        { value: "30d", label: "Retention target" },
        { value: "3", label: "Protected entrances" },
        { value: "13 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a commercial camera and network security deployment, shown for planning context.",
      href: "/services/networks-security-systems",
      detailsLabel: "See security details",
      icon: "camera",
    },
    {
      key: "failover",
      label: "Failover",
      title: "Keep payments, cameras, and critical devices online.",
      body:
        "Internet failover, firewall policy, and network health monitoring help critical systems stay available when the primary connection drops.",
      features: [
        "Primary and backup internet planning",
        "Firewall policy for critical traffic",
        "POS, camera, and cloud service prioritization",
        "Monitoring and support alerts for outages",
      ],
      stats: [
        { value: "2", label: "Internet paths" },
        { value: "99.98%", label: "Critical system uptime" },
        { value: "5", label: "Critical services watched" },
        { value: "7 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a failover-enabled network, shown for planning context.",
      href: "/services/networks-security-systems",
      detailsLabel: "See failover details",
      icon: "shield",
    },
  ],
  smartHome: [
    {
      key: "home-network",
      label: "Home Network",
      title: "A quiet network backbone for every connected room.",
      body:
        "Wi-Fi, switching, cameras, streaming, lighting, and control devices all depend on a network that is planned before the walls and cabinets get in the way.",
      features: [
        "Whole-home Wi-Fi and wired network design",
        "Equipment rack planning and labeling",
        "IoT and guest device segmentation",
        "Remote support readiness from day one",
      ],
      stats: [
        { value: "58", label: "Networked devices" },
        { value: "7", label: "Access points" },
        { value: "5", label: "Network segments" },
        { value: "13 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a connected home network, shown for planning context.",
      href: "/services/smart-home-automation",
      detailsLabel: "See home network details",
      icon: "wifi",
    },
    {
      key: "lighting",
      label: "Lighting Control",
      title: "Lighting scenes that make the home feel calm and intentional.",
      body:
        "Lutron lighting control is designed around rooms, routines, and real daily use, with scenes that are easy to understand after the install is complete.",
      features: [
        "Lutron HomeWorks lighting design and programming",
        "Scene planning for everyday routines and entertaining",
        "Keypad labeling and homeowner handoff",
        "Support for changes as the home evolves",
      ],
      stats: [
        { value: "22", label: "Lighting zones" },
        { value: "14", label: "Scenes configured" },
        { value: "9", label: "Keypads labeled" },
        { value: "15 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a whole-home lighting deployment, shown for planning context.",
      href: "/services/smart-home-automation",
      detailsLabel: "See lighting details",
      icon: "lighting",
    },
    {
      key: "touchscreens",
      label: "Touchscreens",
      title: "Simple control where people actually use it.",
      body:
        "Wall touchscreens, mobile controls, and keypads are placed and programmed around everyday habits, not around a confusing pile of app icons.",
      features: [
        "Wall-mounted control interface planning",
        "Room-by-room scene and device organization",
        "Mobile access setup and homeowner training",
        "Clean handoff documentation for support",
      ],
      stats: [
        { value: "6", label: "Control points" },
        { value: "11", label: "Rooms organized" },
        { value: "24", label: "Favorite actions" },
        { value: "10 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a touchscreen and control interface deployment, shown for planning context.",
      href: "/services/smart-home-automation",
      detailsLabel: "See control details",
      icon: "touchscreen",
    },
    {
      key: "residential-security",
      label: "Home Cameras",
      title: "Camera coverage that is useful without being complicated.",
      body:
        "Residential camera systems are planned around entrances, driveways, yards, and privacy needs, with remote access that stays supportable.",
      features: [
        "Coverage planning for entrances and exterior zones",
        "Secure recorder and camera network setup",
        "Remote viewing configured for household users",
        "Storage and retention planning",
      ],
      stats: [
        { value: "8", label: "Cameras monitoring" },
        { value: "4", label: "Exterior zones" },
        { value: "30d", label: "Retention target" },
        { value: "8 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a residential camera system, shown for planning context.",
      href: "/services/smart-home-automation",
      detailsLabel: "See camera details",
      icon: "camera",
    },
  ],
  audioVideo: [
    {
      key: "home-theater",
      label: "Home Theater",
      title: "Theater rooms that are easy to start and hard to outgrow.",
      body:
        "Displays, projection, surround audio, control, networking, and sources are designed as one experience instead of a pile of separate devices.",
      features: [
        "Projector, display, and speaker planning",
        "Source, control, and network integration",
        "Clean rack and cable management",
        "Simple startup scenes for everyday use",
      ],
      stats: [
        { value: "7.2", label: "Audio layout" },
        { value: "4K", label: "Display signal" },
        { value: "5", label: "Sources controlled" },
        { value: "14 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a theater room and control system deployment, shown for planning context.",
      href: "/services/audio-video-surveillance",
      detailsLabel: "See theater details",
      icon: "display",
    },
    {
      key: "distributed-audio",
      label: "Distributed Audio",
      title: "Music where you want it, controlled without confusion.",
      body:
        "Indoor, outdoor, and shared-space audio zones are planned for coverage, reliability, and easy control from the devices people already use.",
      features: [
        "Speaker placement and zone planning",
        "Amplifier, source, and rack design",
        "Outdoor audio coverage and weather-aware equipment",
        "Simple zone controls for daily use",
      ],
      stats: [
        { value: "12", label: "Audio zones" },
        { value: "38", label: "Speakers installed" },
        { value: "4", label: "Outdoor areas" },
        { value: "15 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a distributed audio deployment, shown for planning context.",
      href: "/services/audio-video-surveillance",
      detailsLabel: "See audio details",
      icon: "speaker",
    },
    {
      key: "commercial-av",
      label: "Commercial AV",
      title: "Conference and display systems people can actually use.",
      body:
        "Meeting displays, soundbars, cameras, signage, and control interfaces are installed with the same support mindset as the network behind them.",
      features: [
        "Conference room display and audio planning",
        "Camera, microphone, and meeting platform setup",
        "Digital signage and storefront display deployment",
        "Documentation for support and future upgrades",
      ],
      stats: [
        { value: "8", label: "Displays controlled" },
        { value: "5", label: "Meeting rooms" },
        { value: "3", label: "Signage zones" },
        { value: "9 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for a commercial AV deployment across shared spaces, shown for planning context.",
      href: "/services/audio-video-surveillance",
      detailsLabel: "See commercial AV details",
      icon: "display",
    },
    {
      key: "surveillance",
      label: "Surveillance",
      title: "Video coverage connected to the systems around it.",
      body:
        "Camera systems are strongest when they are designed with the network, storage, remote access, and support path in mind from the start.",
      features: [
        "Camera placement and field-of-view planning",
        "Recorder, storage, and retention setup",
        "Network segmentation for camera traffic",
        "Remote viewing and support-ready documentation",
      ],
      stats: [
        { value: "10", label: "Cameras monitoring" },
        { value: "30d", label: "Retention target" },
        { value: "6", label: "Coverage zones" },
        { value: "8 min", label: "Avg. first response" },
      ],
      foot:
        "Example snapshot for an AV and surveillance deployment, shown for planning context.",
      href: "/services/audio-video-surveillance",
      detailsLabel: "See surveillance details",
      icon: "camera",
    },
  ],
};

function TickerStatValue({ value }: { value: string }) {
  const [chars, setChars] = useState(() => value.split(""));

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      return;
    }

    const targetChars = value.split("");
    const resetTimer = window.setTimeout(() => {
      setChars(targetChars.map((char) => (char === " " ? " " : "")));
    }, 0);

    const timers = targetChars.map((targetChar, index) => {
      if (targetChar === " ") return undefined;

      const ticks = 5 + Math.floor(Math.random() * 4) + index;
      let count = 0;

      return window.setInterval(() => {
        count += 1;

        setChars((currentChars) => {
          const nextChars = [...currentChars];
          nextChars[index] =
            count >= ticks
              ? targetChar
              : FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)];
          return nextChars;
        });

        if (count >= ticks) {
          const timer = timers[index];
          if (timer) window.clearInterval(timer);
        }
      }, 45);
    });

    return () => {
      window.clearTimeout(resetTimer);
      timers.forEach((timer) => {
        if (timer) window.clearInterval(timer);
      });
    };
  }, [value]);

  return (
    <span className="gsv-redesign-stat-ticker" aria-label={value}>
      {chars.map((char, index) => (
        <span
          key={`${value}-${index}`}
          className={`flap${char === " " ? " is-space" : ""}`}
          aria-hidden="true"
        >
          {char === "" ? "\u00a0" : char}
        </span>
      ))}
    </span>
  );
}

function SubPanelIcon({ icon }: { icon: SubIcon }) {
  if (icon === "restaurant") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 2v8a2 2 0 0 0 2 2v10" />
        <path d="M7 2v6" />
        <path d="M4 2v6" />
        <path d="M4 8h3" />
        <path d="M17 2c-1.5 2-2 4-2 6.5S16 13 17 13v9" />
      </svg>
    );
  }

  if (icon === "retail") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 8h12l1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    );
  }

  if (icon === "home") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 11.5 12 4l8 7.5" />
        <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />
      </svg>
    );
  }

  if (icon === "warehouse") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 10 12 5l9 5v10H3Z" />
        <path d="M7 20v-7h10v7" />
        <path d="M9 15h6M9 18h6" />
      </svg>
    );
  }

  if (icon === "medical") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M9 5V3h6v2" />
        <path d="M12 9v7M8.5 12.5h7" />
      </svg>
    );
  }

  if (icon === "switch") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="7" width="18" height="5" rx="1" />
        <rect x="3" y="14" width="18" height="5" rx="1" />
        <path d="M6 9.5h.01M9 9.5h.01M12 9.5h.01M15 9.5h.01M6 16.5h.01M9 16.5h.01M12 16.5h.01M15 16.5h.01" />
      </svg>
    );
  }

  if (icon === "wifi") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 9a13 13 0 0 1 16 0" />
        <path d="M7 12a8 8 0 0 1 10 0" />
        <path d="M10 15a4 4 0 0 1 4 0" />
        <path d="M12 18h.01" />
      </svg>
    );
  }

  if (icon === "camera") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 8h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4Z" />
        <path d="m16 11 4-2v8l-4-2" />
        <circle cx="9" cy="13" r="2" />
      </svg>
    );
  }

  if (icon === "shield") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
        <path d="M9.5 12.5 11 14l3.5-4" />
      </svg>
    );
  }

  if (icon === "lighting") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M8.5 14a6 6 0 1 1 7 0c-.8.7-1 1.4-1 2H9.5c0-.6-.2-1.3-1-2Z" />
      </svg>
    );
  }

  if (icon === "touchscreen") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="5" width="16" height="13" rx="2" />
        <path d="M8 9h3M13 9h3M8 13h2M12 13h4" />
        <path d="M12 20h.01" />
      </svg>
    );
  }

  if (icon === "speaker") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 10h4l5-4v12l-5-4H4Z" />
        <path d="M16 9c1 1 1 5 0 6" />
        <path d="M19 7c2 3 2 7 0 10" />
      </svg>
    );
  }

  if (icon === "display") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="12" rx="2" />
        <path d="M9 21h6M12 17v4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="9" width="18" height="12" rx="1" />
      <path d="M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
      <path d="M3 14h18" />
    </svg>
  );
}

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

export default function HomePage() {
  const [activeServiceKey, setActiveServiceKey] = useState<ServiceKey>("managed");
  const [activeSubKey, setActiveSubKey] = useState(serviceSubPanels.managed[0].key);
  const [isSubTabRowHovered, setIsSubTabRowHovered] = useState(false);
  const [isSubTabRowFocused, setIsSubTabRowFocused] = useState(false);
  const [isSubAutoPaused, setIsSubAutoPaused] = useState(false);
  const activePanel = servicePanels[activeServiceKey];
  const activeSubPanels = serviceSubPanels[activeServiceKey];
  const shouldPauseSubAutoAdvance = isSubTabRowHovered || isSubTabRowFocused || isSubAutoPaused;
  const activeSubIndex = useMemo(
    () => Math.max(0, activeSubPanels.findIndex((panel) => panel.key === activeSubKey)),
    [activeSubKey, activeSubPanels],
  );
  const activeSubPanel = activeSubPanels[activeSubIndex] ?? activeSubPanels[0];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || shouldPauseSubAutoAdvance) return;

    const timer = window.setTimeout(() => {
      setActiveSubKey(activeSubPanels[(activeSubIndex + 1) % activeSubPanels.length].key);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [activeSubIndex, activeSubPanels, shouldPauseSubAutoAdvance]);

  return (
    <main id="top" className="gsv-redesign-page">
      <JsonLd data={homePageStructuredData()} />
      <SiteHeader />

      <nav className="gsv-redesign-service-menu" aria-label="Service categories">
        {serviceMenuGroups.map((group) => (
          <div className="gsv-redesign-service-menu-group" key={group.heading}>
            <div className="gsv-redesign-service-menu-heading">{group.heading}</div>
            <div className="gsv-redesign-service-menu-items">
              {group.items.map(({ key }) => {
                const item = servicePanels[key];
                const selected = key === activeServiceKey;

                return (
                  <button
                    key={key}
                    type="button"
                    className={`gsv-redesign-service-menu-item${selected ? " is-active" : ""}`}
                    aria-pressed={selected}
                    onClick={() => {
                      setActiveServiceKey(key);
                      setActiveSubKey(serviceSubPanels[key][0].key);
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      width={360}
                      height={220}
                      className="gsv-redesign-service-menu-image"
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <section className="gsv-redesign-hero">
        <div className="gsv-section-head gsv-redesign-hero-head">
          <div className="gsv-eyebrow">{activePanel.eyebrow}</div>
          <h1>{activePanel.heroTitle}</h1>
          <p>{activePanel.heroBody}</p>
        </div>
      </section>

      <section className="gsv-redesign-tabs-wrap" aria-label={`${activePanel.label} examples`}>
        <div
          className={`gsv-redesign-tabs${shouldPauseSubAutoAdvance ? " is-auto-paused" : ""}`}
          role="tablist"
          aria-label={`${activePanel.label} examples`}
          onPointerEnter={() => setIsSubTabRowHovered(true)}
          onPointerLeave={() => setIsSubTabRowHovered(false)}
          onFocus={() => setIsSubTabRowFocused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsSubTabRowFocused(false);
            }
          }}
        >
          {activeSubPanels.map((panel) => {
            const selected = panel.key === activeSubPanel.key;

            return (
              <button
                key={panel.key}
                type="button"
                className={`gsv-redesign-tab${selected ? " is-active" : ""}`}
                role="tab"
                aria-selected={selected}
                aria-controls="gsv-redesign-active-panel"
                onClick={() => {
                  setIsSubAutoPaused(true);
                  setActiveSubKey(panel.key);
                }}
              >
                <SubPanelIcon icon={panel.icon} />
                {panel.label}
                {selected ? <span className="gsv-redesign-tab-progress" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="gsv-redesign-panel" id="gsv-redesign-active-panel">
        <div className="gsv-redesign-board">
          <div className="gsv-redesign-board-head">
            <span>System status</span>
            <span className="gsv-redesign-board-live">Example snapshot</span>
          </div>

          <div className="gsv-redesign-board-grid">
            {activeSubPanel.stats.map((stat) => (
              <div className="gsv-redesign-stat" key={`${activeServiceKey}-${activeSubPanel.key}-${stat.label}`}>
                <div className="gsv-redesign-stat-value">
                  <TickerStatValue value={stat.value} />
                </div>
                <div className="gsv-redesign-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="gsv-redesign-board-foot">{activeSubPanel.foot}</div>
        </div>

        <div className="gsv-redesign-copy">
          <h2>{activeSubPanel.title}</h2>
          <p className="gsv-redesign-copy-body">{activeSubPanel.body}</p>

          <ul className="gsv-redesign-feature-list">
            {activeSubPanel.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>

          <div className="gsv-redesign-copy-actions">
            <Link href="/book-consult" className="gsv-redesign-cta">
              Book a walkthrough
            </Link>
            <Link href={activePanel.href} className="gsv-redesign-cta-secondary">
              See {activePanel.label} Details
            </Link>
          </div>
        </div>
      </section>

      <section id="how-we-work" className="gsv-redesign-live-section gsv-section gsv-section-alt">
        <div className="gsv-section-head">
          <div className="gsv-eyebrow">How We Work</div>
          <h2>A single technology partner across business and residential environments.</h2>
          <p>
            We combine support, infrastructure, and automation into one cohesive
            service experience, reducing handoffs and giving clients a cleaner,
            more reliable path forward.
          </p>
        </div>

        <div className="gsv-feature-grid">
          <div className="gsv-feature">
            <h3>Consult &amp; plan</h3>
            <p>
              We start with the <strong>environment, goals, and future needs</strong>{" "}
              so the solution is sized correctly from day one.
            </p>
          </div>
          <div className="gsv-feature">
            <h3>Build &amp; deploy</h3>
            <p>
              We <strong>implement cleanly and document clearly</strong>, focusing
              on dependable performance over flashy complexity.
            </p>
          </div>
          <div className="gsv-feature">
            <h3>Support &amp; evolve</h3>
            <p>
              As systems grow, we <strong>support, refine, and expand</strong> them
              with a long term service mindset.
            </p>
          </div>
        </div>
      </section>

      <section className="gsv-redesign-partners gsv-section gsv-section-alt" aria-labelledby="technology-partners-heading">
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

      <section id="why-us" className="gsv-redesign-live-section gsv-section gsv-section-alt">
        <div className="gsv-section-head">
          <div className="gsv-eyebrow">Why Golden State Visions</div>
          <h2>One partner for support, infrastructure, automation, and technology procurement.</h2>
        </div>

        <div className="gsv-feature-grid">
          <div className="gsv-feature">
            <h3>Business-first mindset</h3>
            <p>
              We help businesses stay productive with <strong>reliable systems</strong>,{" "}
              <strong>practical support</strong>, and{" "}
              <strong>thoughtful long term planning</strong>.
            </p>
          </div>
          <div className="gsv-feature">
            <h3>Built for physical locations</h3>
            <p>
              Networks, cameras, Wi-Fi, workstations, displays, and smart systems
              are planned around <strong>the real rooms they live in</strong>, with{" "}
              <strong>onsite details handled</strong> before they become support issues.
            </p>
          </div>
          <div className="gsv-feature">
            <h3>Scalable client experience</h3>
            <p>
              Our client portal supports <strong>billing and account access</strong>{" "}
              today, with a roadmap for <strong>service tracking</strong>,{" "}
              <strong>appointments</strong>, <strong>system visibility</strong>, and{" "}
              <strong>account management</strong>.
            </p>
          </div>
          <div className="gsv-feature">
            <h3>Microsoft &amp; Google platforms</h3>
            <p>
              Support for <strong>Microsoft 365</strong>,{" "}
              <strong>Google Workspace</strong>, <strong>email</strong>, identity,
              licensing, administration, and ongoing platform management.
            </p>
          </div>
          <div className="gsv-feature">
            <h3>Business technology procurement</h3>
            <p>
              Access to <strong>business hardware</strong>,{" "}
              <strong>networking equipment</strong>, <strong>workstations</strong>,
              servers, software licensing, and infrastructure products through
              established technology channels.
            </p>
          </div>
          <div className="gsv-feature">
            <h3>Planning through support</h3>
            <p>
              Help with <strong>product selection</strong>,{" "}
              <strong>implementation planning</strong>, renewals, upgrades,
              lifecycle management, and vendor coordination.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
