export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: "Business IT" | "Networks & Security" | "Smart Home";
  audience: string;
  published: string;
  updated: string;
  readTime: string;
  serviceHref: string;
  serviceLabel: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "restaurant-network-security-checklist",
    title: "A Practical Network Security Checklist for Restaurants",
    description:
      "A restaurant network security checklist covering guest Wi-Fi, POS systems, cameras, vendors, backups, PCI scope, and day-to-day operations.",
    excerpt:
      "Separate the systems that take payments, serve guests, run cameras, and support staff—then make failures visible before they interrupt service.",
    category: "Networks & Security",
    audience: "Restaurant owners and operators",
    published: "2026-07-27",
    updated: "2026-07-27",
    readTime: "8 min read",
    serviceHref: "/managed-it?service=06",
    serviceLabel: "Explore networks and security systems",
    sections: [
      {
        heading: "Why restaurant networks need deliberate separation",
        paragraphs: [
          "A restaurant rarely has just one kind of technology traffic. Point-of-sale terminals, payment processors, online ordering tablets, kitchen display systems, staff devices, guest Wi-Fi, cameras, music, signage, and building controls may all share the same internet connection. They should not all share the same trust level.",
          "The goal is not complexity for its own sake. A well-designed network limits what each device can reach, preserves checkout and kitchen operations when guest traffic spikes, and gives the support team enough visibility to identify a failing access point, switch, cable, or internet circuit quickly.",
        ],
      },
      {
        heading: "The core restaurant network security checklist",
        paragraphs: [
          "Start with an inventory of every device that connects by cable or Wi-Fi and identify who owns it, what it needs to communicate with, and what happens if it goes offline. From there, use separate network segments and access rules for distinct operational roles.",
        ],
        bullets: [
          "Place POS terminals and payment-related systems on a dedicated network with tightly limited access.",
          "Keep guest Wi-Fi isolated from business devices, printers, cameras, and management interfaces.",
          "Separate cameras, access control, audio, signage, and other internet-connected equipment from staff computers.",
          "Use unique administrator accounts, multifactor authentication, and a documented process for vendor access.",
          "Keep firewalls, switches, access points, POS devices, and supported endpoints on a defined update schedule.",
          "Back up configurations for the firewall, switches, wireless system, and other critical infrastructure.",
          "Monitor internet availability, device health, capacity, and repeated authentication or connectivity failures.",
        ],
      },
      {
        heading: "Design Wi-Fi around the actual floor plan",
        paragraphs: [
          "Dining rooms, kitchens, patios, freezers, storage areas, and offices create very different radio conditions. Stainless steel, tile, refrigeration equipment, dense walls, neighboring businesses, and crowds all affect coverage. Access points should be placed from a coverage plan, not simply wherever a cable is easiest to reach.",
          "Verify coverage where handheld POS devices are used, where delivery tablets sit, and where staff move between indoor and outdoor service areas. Guest Wi-Fi should have sensible bandwidth limits so it cannot crowd out payment and operational traffic.",
        ],
      },
      {
        heading: "Reduce PCI scope without treating PCI as the whole security plan",
        paragraphs: [
          "Network segmentation can help reduce which systems are in scope for payment-card requirements, but segmentation has to be real, documented, and tested. PCI compliance does not automatically protect email accounts, cloud applications, cameras, backups, or employee devices.",
          "A practical review should cover payment-system boundaries, vendor responsibilities, remote access, endpoint protection, backups, incident response, and who receives alerts. The result should be a short operating document your managers and technology partners can actually follow.",
        ],
      },
      {
        heading: "What to review with a technology partner",
        paragraphs: [
          "Ask for a current network diagram, device inventory, wireless coverage review, configuration backups, update ownership, and a written explanation of how critical systems are separated. You should also know who can access the network remotely and what the escalation path is during service hours.",
          "Golden State Visions designs and supports business networks, Wi-Fi, cameras, endpoint security, backup, and managed IT as one documented environment. That matters when a restaurant problem crosses the line between the internet provider, POS vendor, cabling, Wi-Fi, and local hardware.",
        ],
      },
    ],
  },
  {
    slug: "lutron-vs-control4-smart-home",
    title: "Lutron vs. Control4: What Each System Actually Does",
    description:
      "Compare Lutron lighting and shading with Control4 home automation, including overlap, differences, integration, planning, and which system fits a project.",
    excerpt:
      "Lutron and Control4 are often compared, but they solve different layers of a smart home. The right answer may be one platform—or both working together.",
    category: "Smart Home",
    audience: "Homeowners, builders, and designers",
    published: "2026-07-27",
    updated: "2026-07-27",
    readTime: "9 min read",
    serviceHref: "/smart-home-automation?service=03",
    serviceLabel: "Explore smart home automation",
    sections: [
      {
        heading: "Lutron and Control4 are not direct substitutes",
        paragraphs: [
          "Lutron is best known for lighting control, dimming, keypads, motorized shades, and the engineering required to make those systems reliable. Control4 is a broader automation and control platform that can coordinate audio, video, climate, locks, cameras, lighting, shades, and other connected systems through shared interfaces and scenes.",
          "That distinction matters. A homeowner choosing between them is often really deciding whether the project needs dedicated lighting and shading, whole-home control, or a coordinated design that uses both.",
        ],
      },
      {
        heading: "Where Lutron is strongest",
        paragraphs: [
          "Lighting is part of the building, not just another app. Lutron systems are designed around dependable local control, smooth dimming, compatible loads, thoughtful keypad layouts, and shades that operate consistently. Product families range from focused retrofit solutions to centralized lighting systems for large custom homes.",
        ],
        bullets: [
          "Architectural lighting control and reliable dimming",
          "Keypads that replace banks of switches with named scenes",
          "Motorized shades coordinated with lighting and time of day",
          "Strong retrofit and new-construction options",
          "Local wall control that remains useful without a phone",
        ],
      },
      {
        heading: "Where Control4 is strongest",
        paragraphs: [
          "Control4 provides a common control layer across multiple subsystems and brands. It is often used when a home needs one experience for televisions, distributed audio, climate, door stations, locks, cameras, lighting scenes, and scheduled or event-driven automation.",
        ],
        bullets: [
          "Unified control through touchscreens, remotes, mobile devices, and voice integrations",
          "Audio and video distribution across multiple rooms",
          "Automation scenes that coordinate several subsystems",
          "A dealer-programmed platform with room-level interfaces",
          "Broad third-party device integration",
        ],
      },
      {
        heading: "Why many well-designed homes use both",
        paragraphs: [
          "In a combined design, Lutron handles the lighting and shades while Control4 presents those functions alongside entertainment, climate, security, and other home controls. Each platform does the job it is best equipped to do.",
          "Integration should not erase independent operation. Lights should still work from keypads, shades should still have dependable local control, and core home functions should not become unusable because a remote, app, or internet service is unavailable.",
        ],
      },
      {
        heading: "Questions to answer before choosing",
        paragraphs: [
          "The right design depends on whether the home is finished or under construction, the number and type of lighting loads, shade requirements, the desired control interfaces, audio and video plans, network readiness, and the owner’s expectations for ongoing support.",
        ],
        bullets: [
          "Is this a lighting project, a whole-home control project, or both?",
          "Will wiring and electrical panels be accessible during construction?",
          "Which functions must continue working independently?",
          "Who will document programming, credentials, device locations, and warranties?",
          "What support model will be available after installation?",
        ],
      },
    ],
  },
  {
    slug: "warehouse-wifi-planning-guide",
    title: "Warehouse Wi-Fi Planning: Coverage for Scanners, Docks, and Inventory",
    description:
      "Plan warehouse Wi-Fi for handheld scanners, racks, loading docks, cameras, printers, roaming, channel design, redundancy, and ongoing monitoring.",
    excerpt:
      "Warehouse Wi-Fi succeeds when it is designed around moving devices, changing inventory, metal racks, dock areas, and the applications workers depend on.",
    category: "Networks & Security",
    audience: "Warehouse and fulfillment teams",
    published: "2026-07-27",
    updated: "2026-07-27",
    readTime: "8 min read",
    serviceHref: "/managed-it?service=06",
    serviceLabel: "Explore business network design",
    sections: [
      {
        heading: "A warehouse is a moving radio environment",
        paragraphs: [
          "A coverage test performed in an empty building does not represent a working warehouse. Pallets, metal racks, inventory density, lift equipment, freezer walls, open dock doors, and neighboring networks all change how Wi-Fi behaves. Devices also move constantly and may be mounted low, held against the body, or used inside vehicles.",
          "Good planning starts with the applications and devices that matter: handheld scanners, vehicle-mounted terminals, label printers, tablets, cameras, phones, sensors, and guest or vendor access. Each has different roaming, bandwidth, latency, and coverage requirements.",
        ],
      },
      {
        heading: "Build the design around critical workflows",
        paragraphs: [
          "Map receiving, put-away, picking, packing, staging, loading, returns, and inventory workflows. Identify where a lost connection interrupts a transaction or forces a worker to repeat a scan. Those locations deserve explicit coverage and roaming tests.",
        ],
        bullets: [
          "Document device models, Wi-Fi capabilities, and supported frequency bands.",
          "Define minimum signal and roaming requirements for operational devices.",
          "Plan coverage at rack height, work height, dock doors, yards, and enclosed areas.",
          "Separate operational devices, cameras, staff systems, building equipment, and guests.",
          "Validate switch capacity, Power over Ethernet, uplinks, internet redundancy, and battery backup.",
        ],
      },
      {
        heading: "More access points are not automatically better",
        paragraphs: [
          "Excessive access-point density can create co-channel interference and unstable roaming. The design needs deliberate channel use, power levels, mounting locations, antenna choices, and minimum data rates. High ceilings may require different equipment or placement than offices attached to the warehouse.",
          "A predictive design is a starting point. It should be followed by onsite validation with inventory and normal operations present, then adjusted using real device behavior rather than laptop speed tests alone.",
        ],
      },
      {
        heading: "Plan for failure and change",
        paragraphs: [
          "Warehouses change layouts, inventory, equipment, carriers, and applications. Keep current floor plans, access-point locations, switch-port assignments, network diagrams, and configuration backups. Monitor access-point health, client experience, interference, uplink errors, and capacity trends.",
          "Critical locations should have a documented response plan for circuit failure, switch failure, damaged cabling, or a failed access point. Redundancy is valuable only when the team knows what it covers and tests it.",
        ],
      },
    ],
  },
  {
    slug: "small-business-managed-it-cost-guide",
    title: "What Does Managed IT Cost for a Small Business?",
    description:
      "Understand common managed IT pricing models, cost drivers, included services, onboarding needs, and questions Northern California businesses should ask.",
    excerpt:
      "Managed IT pricing makes more sense when you separate the recurring support model from projects, hardware, licensing, and remediation.",
    category: "Business IT",
    audience: "Small and midsize business leaders",
    published: "2026-07-27",
    updated: "2026-07-27",
    readTime: "8 min read",
    serviceHref: "/managed-it?service=01",
    serviceLabel: "Explore managed IT services",
    sections: [
      {
        heading: "Why managed IT prices vary",
        paragraphs: [
          "Two companies with the same employee count can require very different levels of support. Pricing is shaped by the number and type of users, devices, locations, servers, cloud services, security requirements, support hours, regulatory obligations, and the condition of the existing environment.",
          "A reliable proposal should explain what is recurring, what is a one-time onboarding or remediation cost, which licenses are included, and which projects or hardware purchases remain separate.",
        ],
      },
      {
        heading: "Common pricing models",
        paragraphs: [
          "Per-user pricing is common when support, identity, productivity applications, and endpoint security align closely with employee count. Per-device pricing may fit environments with shared workstations, specialized equipment, or more devices than users. Some providers use a hybrid or flat monthly model after assessing the environment.",
        ],
        bullets: [
          "Per user: a recurring amount for each supported employee",
          "Per device: pricing tied to supported computers, servers, or network equipment",
          "Tiered plans: different service bundles with defined inclusions",
          "Flat monthly agreement: a scoped recurring fee for the documented environment",
          "Time and materials: hourly support without a comprehensive management agreement",
        ],
      },
      {
        heading: "What a complete managed service should address",
        paragraphs: [
          "The lowest quoted monthly fee is not necessarily the lowest operating cost. Compare ownership and outcomes, not just line items. A comprehensive plan may include help desk, endpoint monitoring, patching, security controls, identity management, backup oversight, network monitoring, vendor coordination, documentation, reporting, and strategic planning.",
          "Ask whether after-hours work, onsite visits, employee onboarding, cloud administration, security incidents, projects, cabling, hardware, and third-party licenses are included or billed separately.",
        ],
      },
      {
        heading: "Expect an onboarding and stabilization phase",
        paragraphs: [
          "A new provider needs accurate documentation, administrative access, device inventories, security baselines, backup verification, network configuration, and escalation contacts. Unsupported systems, shared accounts, missing backups, expired warranties, or undocumented networks may require remediation before predictable support is possible.",
          "That work should result in a clearer environment: named owners, current diagrams, verified backups, protected accounts, known lifecycle risks, and a prioritized improvement plan.",
        ],
      },
      {
        heading: "Questions that make proposals easier to compare",
        bullets: [
          "What exact users, devices, sites, and cloud services are in scope?",
          "Which security, backup, and productivity licenses are included?",
          "What response targets apply to urgent and routine requests?",
          "How are projects, onsite work, and after-hours support billed?",
          "Who owns documentation, credentials, configurations, and exported data?",
          "What happens during onboarding and when the agreement ends?",
        ],
        paragraphs: [
          "Golden State Visions scopes managed IT around the actual environment and documents the division between recurring operations, licensing, projects, procurement, and remediation. That gives business owners a more useful basis for comparing cost and accountability.",
        ],
      },
    ],
  },
  {
    slug: "new-construction-smart-home-wiring-checklist",
    title: "A Smart Home Wiring Checklist for New Construction",
    description:
      "A new-construction smart home wiring checklist for networks, Wi-Fi, cameras, lighting, shades, audio, video, control, racks, power, and documentation.",
    excerpt:
      "The best time to plan network, lighting, shades, cameras, audio, and control infrastructure is before insulation and drywall limit your options.",
    category: "Smart Home",
    audience: "Homeowners, builders, architects, and designers",
    published: "2026-07-27",
    updated: "2026-07-27",
    readTime: "10 min read",
    serviceHref: "/smart-home-automation?service=02",
    serviceLabel: "Explore new-construction planning",
    sections: [
      {
        heading: "Treat technology infrastructure like a building system",
        paragraphs: [
          "Networking, lighting control, motorized shades, audio, video, cameras, access, and automation all depend on pathways, power, equipment locations, and coordination with other trades. Waiting until trim-out often leads to visible wires, compromised equipment locations, extra wall controls, and expensive changes.",
          "A technology plan should be coordinated with architectural, reflected-ceiling, electrical, cabinetry, landscape, and interior-design drawings before rough-in.",
        ],
      },
      {
        heading: "Network and Wi-Fi rough-in",
        bullets: [
          "Choose a conditioned, accessible equipment-rack location with service clearance.",
          "Provide dedicated power, ventilation, grounding, and battery-backup planning.",
          "Run home-run cabling for ceiling access points, televisions, offices, cameras, door stations, and other fixed devices.",
          "Plan conduit or spare pathways to difficult and high-value locations.",
          "Coordinate internet-provider entry, demarcation, backup connectivity, and exterior pathways.",
          "Label and test every cable, then retain the results with the project documentation.",
        ],
        paragraphs: [
          "Wi-Fi access-point locations should come from the floor plan and construction materials, not from visual convenience alone. Large glass areas, masonry, radiant barriers, mechanical spaces, detached structures, and outdoor living areas all affect the design.",
        ],
      },
      {
        heading: "Lighting, keypads, and motorized shades",
        paragraphs: [
          "Decide early whether lighting loads will be controlled locally, through centralized panels, or with a hybrid approach. Keypad locations and button functions should be coordinated with furniture, door swings, interior elevations, and the scenes the owner will actually use.",
          "Motorized shades require decisions about pockets, fascia, power, control wiring, fabric, window conditions, and service access. The shade, electrical, framing, and interior-design teams need the same details before ceilings and window treatments are completed.",
        ],
      },
      {
        heading: "Audio, video, cameras, and control",
        bullets: [
          "Confirm television sizes, mounting heights, backing, power, conduit, and equipment locations.",
          "Coordinate speaker positions with lighting, sprinklers, HVAC, beams, and acoustic treatments.",
          "Plan camera views around lighting, landscaping, rooflines, gates, and privacy expectations.",
          "Define door-station, gate, lock, and access-control requirements before hardware is ordered.",
          "Choose where touchscreens, remotes, keypads, and other control interfaces are appropriate.",
        ],
        paragraphs: [
          "Avoid designing every function around wireless devices and cloud applications. Wireless products can be useful, but permanent infrastructure should prioritize dependable local control, serviceable equipment, and documented wiring.",
        ],
      },
      {
        heading: "Documentation to require at handoff",
        paragraphs: [
          "The finished system should include cable schedules, test results, rack elevations, network diagrams, device locations, model and serial information, configuration backups, warranties, credentials, programming files where applicable, and a clear support path.",
          "Golden State Visions coordinates design, rough-in, installation, programming, commissioning, documentation, and ongoing support so the technology scope remains connected from planning through occupancy.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
