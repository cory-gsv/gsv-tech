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
      "A restaurant network security checklist covering guest Wi-Fi, POS systems, cameras, vendors, backups, PCI scope, and daily operations.",
    excerpt:
      "Separate the systems that take payments, serve guests, run cameras, and support staff. Then make failures visible before they interrupt service.",
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
          "A restaurant rarely has just one kind of technology traffic. POS terminals, payment processors, online ordering tablets, kitchen display systems, staff devices, guest Wi-Fi, cameras, music, signage, and building controls may all share the same internet connection. They should not all share the same trust level.",
          "The goal is not complexity for its own sake. A thoughtfully designed network limits what each device can reach, preserves checkout and kitchen operations when guest traffic spikes, and gives the support team enough visibility to identify a failing access point, switch, cable, or internet circuit quickly.",
        ],
      },
      {
        heading: "The core restaurant network security checklist",
        paragraphs: [
          "Start with an inventory of every device that connects by cable or Wi-Fi and identify who owns it, what it needs to communicate with, and what happens if it goes offline. From there, use separate network segments and access rules for distinct operational roles.",
        ],
        bullets: [
          "Place POS terminals and payment systems on a dedicated network with tightly limited access.",
          "Keep guest Wi-Fi isolated from business devices, printers, cameras, and management interfaces.",
          "Separate cameras, access control, audio, signage, and other connected equipment from staff computers.",
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
          "Network segmentation can help reduce which systems are in scope for payment card requirements, but segmentation has to be real, documented, and tested. PCI compliance does not automatically protect email accounts, cloud applications, cameras, backups, or employee devices.",
          "A practical review should cover payment system boundaries, vendor responsibilities, remote access, endpoint protection, backups, incident response, and who receives alerts. The result should be a short operating document your managers and technology partners can actually follow.",
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
      "Lutron and Control4 are often compared, but they solve different layers of a smart home. The right answer may be one platform or both working together.",
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
          "That distinction matters. A homeowner choosing between them is often really deciding whether the project needs dedicated lighting and shading, control throughout the home, or a coordinated design that uses both.",
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
          "Strong options for retrofits and new construction",
          "Local wall control that remains useful without a phone",
        ],
      },
      {
        heading: "Where Control4 is strongest",
        paragraphs: [
          "Control4 provides a common control layer across multiple subsystems and brands. It is often used when a home needs one experience for televisions, distributed audio, climate, door stations, locks, cameras, lighting scenes, and scheduled or triggered automation.",
        ],
        bullets: [
          "Unified control through touchscreens, remotes, mobile devices, and voice integrations",
          "Audio and video distribution across multiple rooms",
          "Automation scenes that coordinate several subsystems",
          "A professionally programmed platform with controls for each room",
          "Broad integration with devices from other manufacturers",
        ],
      },
      {
        heading: "Why many thoughtfully designed homes use both",
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
          "Is this a lighting project, a control project for the entire home, or both?",
          "Will wiring and electrical panels be accessible during construction?",
          "Which functions must continue working independently?",
          "Who will document programming, credentials, device locations, and warranties?",
          "What support model will be available after installation?",
        ],
      },
    ],
  },
  {
    slug: "wifi-design-guide",
    title: "Wi-Fi Design Guide: Coverage, Capacity, Roaming, and Reliability",
    description:
      "Learn how professional Wi-Fi design handles coverage, capacity, roaming, access point placement, cabling, channels, interference, security, and validation.",
    excerpt:
      "Reliable Wi-Fi is designed around the building, connected devices, and real workflows. It is not based on bars on a phone or access points placed wherever convenient.",
    category: "Networks & Security",
    audience: "Business owners, homeowners, builders, and facility teams",
    published: "2026-07-27",
    updated: "2026-07-27",
    readTime: "11 min read",
    serviceHref: "/managed-it?service=06",
    serviceLabel: "Explore professional Wi-Fi and network design",
    sections: [
      {
        heading: "Good Wi-Fi starts with requirements, not hardware",
        paragraphs: [
          "A Wi-Fi design should begin by defining what the network must support. A small office using laptops and video meetings has different needs than a restaurant with handheld POS devices, a warehouse full of scanners, or a large home with cameras, streaming, automation, and outdoor living spaces.",
          "Document the number and type of devices, important applications, expected simultaneous use, mobility, outdoor coverage, guest access, security boundaries, and areas where a dropped connection would interrupt work. Those requirements determine the design more reliably than a target number of access points.",
        ],
        bullets: [
          "Identify critical applications and the devices that run them.",
          "Mark where users work, gather, move, and expect outdoor coverage.",
          "Separate operational, employee, guest, camera, and smart device requirements.",
          "Define what must keep working during an internet, switch, or access point failure.",
          "Account for future devices, building changes, and applications that use more bandwidth.",
        ],
      },
      {
        heading: "Coverage and capacity are different problems",
        paragraphs: [
          "Coverage asks whether a usable signal reaches a location. Capacity asks whether the network can serve all the devices and traffic in that location at the same time. One powerful access point may show strong signal across a large area while still becoming a bottleneck in a busy conference room, dining area, event space, or open office.",
          "A professional design evaluates both. It considers client density, application traffic, radio airtime, channel reuse, and how the building attenuates signals. The objective is consistent service where it matters, not the largest possible coverage circle from each access point.",
        ],
      },
      {
        heading: "Access point placement follows the building",
        paragraphs: [
          "Walls, floors, glass, mirrors, tile, concrete, masonry, metal, insulation, equipment, shelving, and even furniture change radio behavior. Access points should be located with those materials in mind and mounted in the orientation for which their antennas were designed.",
          "Hiding an access point inside a cabinet, above metal ductwork, behind a television, or at one end of a long building can create uneven coverage. Outdoor spaces, detached buildings, stairwells, elevators, freezers, mechanical rooms, and high ceilings may require different equipment or antenna strategies.",
        ],
        bullets: [
          "Use floor plans and construction materials to create an initial predictive design.",
          "Favor wired access points mounted on ceilings or walls in deliberate locations.",
          "Plan Ethernet, Power over Ethernet, switch capacity, and battery backup together.",
          "Use equipment rated for outdoor use and correct pathways for exterior coverage.",
          "Keep access points accessible for inspection, replacement, and future upgrades.",
        ],
      },
      {
        heading: "More access points can make Wi-Fi worse",
        paragraphs: [
          "Adding access points without coordinating channels and transmit power can increase interference, reduce usable airtime, and encourage devices to remain connected to the wrong radio. Wi-Fi is a shared medium: nearby devices take turns transmitting, even when speed tests occasionally look fast.",
          "Channel width, channel reuse, transmit power, minimum data rates, and band strategy should be configured as one system. Wider channels can provide higher peak throughput, but they also consume more spectrum and are not always the best choice in dense environments.",
        ],
      },
      {
        heading: "Roaming is a system and client decision",
        paragraphs: [
          "Access points advertise the network, but client devices usually decide when to leave one access point and join another. A device may hold onto a weak connection longer than expected if coverage overlap, power levels, supported roaming features, or client behavior are poorly matched.",
          "Design roaming around the actual devices that move. Test phones, tablets, scanners, voice devices, and handheld POS equipment along real walking paths while their applications are active. A stationary laptop speed test does not validate a roaming design.",
        ],
      },
      {
        heading: "The wired network determines wireless reliability",
        paragraphs: [
          "Every access point depends on cabling, switch ports, Power over Ethernet, uplinks, routing, DNS, DHCP, firewall rules, and the internet connection. A wireless problem can originate anywhere along that path. The design should verify cable performance, available PoE power, switch capacity, uplink speed, redundancy, and configuration ownership.",
          "Use separate network segments and access policies for systems with different trust levels. Guest devices should not reach business systems; cameras and smart devices should not automatically share the same access as employee computers; and management interfaces should be restricted to authorized administrators.",
        ],
      },
      {
        heading: "Validate after installation and monitor over time",
        paragraphs: [
          "Predictive plans are valuable, but the finished environment must be measured. After installation, validate signal strength, interference, channel use, roaming, throughput, application behavior, and coverage at the height and locations where devices are actually used.",
          "Buildings and networks change. New neighbors, furniture, inventory, equipment, devices, and software can alter performance. Keep access point locations, switch port assignments, cable tests, network diagrams, configurations, and validation results with the system documentation, then monitor health and capacity so emerging problems are visible before users begin reporting them.",
        ],
        bullets: [
          "Perform an onsite survey after installation and correct gaps.",
          "Test critical applications, not only internet speed.",
          "Review client experience, interference, retries, and access point utilization.",
          "Back up network configurations and document administrative access.",
          "Reassess the design after material layout or usage changes.",
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
          "Good planning starts with the applications and devices that matter: handheld scanners, terminals mounted in vehicles, label printers, tablets, cameras, phones, sensors, and guest or vendor access. Each has different roaming, bandwidth, latency, and coverage requirements.",
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
          "Excessive access point density can create channel interference and unstable roaming. The design needs deliberate channel use, power levels, mounting locations, antenna choices, and minimum data rates. High ceilings may require different equipment or placement than offices attached to the warehouse.",
          "A predictive design is a starting point. It should be followed by onsite validation with inventory and normal operations present, then adjusted using real device behavior rather than laptop speed tests alone.",
        ],
      },
      {
        heading: "Plan for failure and change",
        paragraphs: [
          "Warehouses change layouts, inventory, equipment, carriers, and applications. Keep current floor plans, access point locations, switch port assignments, network diagrams, and configuration backups. Monitor access point health, client experience, interference, uplink errors, and capacity trends.",
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
          "A reliable proposal should explain what is recurring, what is an initial onboarding or remediation cost, which licenses are included, and which projects or hardware purchases remain separate.",
        ],
      },
      {
        heading: "Common pricing models",
        paragraphs: [
          "Pricing per user is common when support, identity, productivity applications, and endpoint security align closely with employee count. Pricing per device may fit environments with shared workstations, specialized equipment, or more devices than users. Some providers use a hybrid or flat monthly model after assessing the environment.",
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
          "Ask whether work outside normal hours, onsite visits, employee onboarding, cloud administration, security incidents, projects, cabling, hardware, and external licenses are included or billed separately.",
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
          "How are projects, onsite work, and support outside normal hours billed?",
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
      "A smart home wiring checklist for new construction, including networks, Wi-Fi, cameras, lighting, shades, audio, video, control, racks, power, and documentation.",
    excerpt:
      "The best time to plan network, lighting, shades, cameras, audio, and control infrastructure is before insulation and drywall limit your options.",
    category: "Smart Home",
    audience: "Homeowners, builders, architects, and designers",
    published: "2026-07-27",
    updated: "2026-07-27",
    readTime: "10 min read",
    serviceHref: "/smart-home-automation?service=02",
    serviceLabel: "Explore planning for new construction",
    sections: [
      {
        heading: "Treat technology infrastructure like a building system",
        paragraphs: [
          "Networking, lighting control, motorized shades, audio, video, cameras, access, and automation all depend on pathways, power, equipment locations, and coordination with other trades. Waiting until final installation often leads to visible wires, compromised equipment locations, extra wall controls, and expensive changes.",
          "A technology plan should be coordinated with architectural, reflected ceiling, electrical, cabinetry, landscape, and interior design drawings before rough-in.",
        ],
      },
      {
        heading: "Network and Wi-Fi rough-in",
        bullets: [
          "Choose a conditioned, accessible equipment rack location with service clearance.",
          "Provide dedicated power, ventilation, grounding, and backup power planning.",
          "Run dedicated cabling for ceiling access points, televisions, offices, cameras, door stations, and other fixed devices.",
          "Plan conduit or spare pathways to difficult and priority locations.",
          "Coordinate internet provider entry, demarcation, backup connectivity, and exterior pathways.",
          "Label and test every cable, then retain the results with the project documentation.",
        ],
        paragraphs: [
          "Wi-Fi access point locations should come from the floor plan and construction materials, not from visual convenience alone. Large glass areas, masonry, radiant barriers, mechanical spaces, detached structures, and outdoor living areas all affect the design.",
        ],
      },
      {
        heading: "Lighting, keypads, and motorized shades",
        paragraphs: [
          "Decide early whether lighting loads will be controlled locally, through centralized panels, or with a hybrid approach. Keypad locations and button functions should be coordinated with furniture, door swings, interior elevations, and the scenes the owner will actually use.",
          "Motorized shades require decisions about pockets, fascia, power, control wiring, fabric, window conditions, and service access. The shade, electrical, framing, and interior design teams need the same details before ceilings and window treatments are completed.",
        ],
      },
      {
        heading: "Audio, video, cameras, and control",
        bullets: [
          "Confirm television sizes, mounting heights, backing, power, conduit, and equipment locations.",
          "Coordinate speaker positions with lighting, sprinklers, HVAC, beams, and acoustic treatments.",
          "Plan camera views around lighting, landscaping, rooflines, gates, and privacy expectations.",
          "Define door station, gate, lock, and access control requirements before hardware is ordered.",
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
