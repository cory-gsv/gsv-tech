export const resourceGuideTopics = [
  {
    number: "01",
    category: "Managed IT",
    title: "What a managed IT plan should cover",
    description:
      "A useful managed IT plan connects daily user support with monitoring, cloud administration, security, backups, documentation, and long-term ownership.",
    items: [
      "Confirm help desk coverage, response expectations, and onsite support",
      "Review endpoint monitoring, patching, EDR, and device lifecycle standards",
      "Document Microsoft 365 or Google Workspace identity, permissions, and backups",
      "Define vendor coordination, recovery planning, reporting, and system ownership",
    ],
    bestFor:
      "Businesses comparing providers, replacing reactive support, opening a location, or formalizing technology operations for a growing team.",
    platforms: [
      "Help desk",
      "NinjaOne",
      "Microsoft 365",
      "Google Workspace",
      "SentinelOne",
      "Cloud backup",
    ],
    outcome:
      "A support scope that clearly identifies what is managed, how issues are handled, and where responsibility sits.",
  },
  {
    number: "02",
    category: "Security & Compliance",
    title: "Cybersecurity, HIPAA & PCI readiness",
    description:
      "Practical security starts with controlled identities, protected endpoints, separated networks, recoverable data, and documentation that supports operational requirements.",
    items: [
      "Require multi-factor authentication, least-privilege access, and clean offboarding",
      "Establish endpoint detection, security baselines, patching, and alert ownership",
      "Separate medical, payment, guest, camera, and general business systems",
      "Document backups, recovery procedures, incident response, and compliance support",
    ],
    bestFor:
      "Medical offices, retail, hospitality, professional services, and other organizations handling sensitive information or payment systems.",
    platforms: [
      "SentinelOne",
      "Bitdefender",
      "MFA & SSO",
      "HIPAA support",
      "PCI support",
      "Recovery planning",
    ],
    outcome:
      "A defensible security baseline and a clearer roadmap for closing gaps without treating compliance as a one-time checkbox.",
  },
  {
    number: "03",
    category: "Business Networks",
    title: "Plan the network around the physical location",
    description:
      "Reliable business networks account for real rooms, walls, aisles, counters, outdoor areas, connected devices, and the systems that cannot stop when internet service fails.",
    items: [
      "Map Wi-Fi coverage, access-point placement, channel use, and wired backhaul",
      "Plan switching, PoE capacity, firewalls, VLANs, racks, and structured cabling",
      "Separate staff, guest, payment, camera, voice, and building-control traffic",
      "Evaluate failover internet, remote monitoring, labeling, and network documentation",
    ],
    bestFor:
      "Offices, warehouses, restaurants, medical practices, retail locations, and multi-site businesses planning upgrades or new spaces.",
    platforms: [
      "UniFi Network",
      "Wi-Fi 6 & 7",
      "VLANs",
      "PoE",
      "Cat6 & fiber",
      "Failover internet",
    ],
    outcome:
      "A network design tied to the physical environment, critical workflows, and future support requirements.",
  },
  {
    number: "04",
    category: "Lighting & Shading",
    title: "Lutron decisions to make before finish work",
    description:
      "Lighting control and motorized shades are easiest to execute when loads, keypads, power, pockets, scenes, and homeowner expectations are coordinated early.",
    items: [
      "Choose between Lutron HomeWorks and RadioRA 3 based on project scope",
      "Document lighting loads, dimming requirements, keypads, engraving, and scenes",
      "Coordinate shade fabric, power, pockets, drapery, windows, and finish details",
      "Plan programming, commissioning, homeowner training, and ongoing support",
    ],
    bestFor:
      "New construction, remodels, additions, and existing homes where lighting quality, daylight control, and clean wall controls matter.",
    platforms: [
      "Lutron HomeWorks",
      "RadioRA 3",
      "Palladiom",
      "Lutron Shades",
      "Drapery",
      "Lighting scenes",
    ],
    outcome:
      "Fewer late-stage changes, cleaner controls, and lighting and shading scenes that remain intuitive after move-in.",
  },
  {
    number: "05",
    category: "Connected Home",
    title: "Make automation, networking, and AV work as one",
    description:
      "A connected home should use a reliable network and coordinated control layer instead of leaving the household to manage disconnected devices and apps.",
    items: [
      "Build a wired UniFi foundation for Wi-Fi, cameras, control, work, and streaming",
      "Coordinate Control4, Savant, Crestron, or Home Assistant with lighting and climate",
      "Plan architectural audio, media rooms, displays, sources, and equipment racks",
      "Define local camera recording, remote access, privacy, and long-term support",
    ],
    bestFor:
      "Homes combining lighting, shades, climate, audio, video, cameras, access, and daily routines across several rooms or buildings.",
    platforms: [
      "Control4",
      "Savant",
      "Crestron",
      "Home Assistant",
      "UniFi",
      "Sonos & Sonance",
    ],
    outcome:
      "A simpler control experience with fewer app handoffs, better infrastructure, and a system that can be maintained over time.",
  },
  {
    number: "06",
    category: "Assessment & Handoff",
    title: "Prepare for an assessment, repair, or upgrade",
    description:
      "Good documentation helps a technology partner distinguish urgent failures from usability issues, deferred maintenance, and opportunities for phased improvement.",
    items: [
      "List known devices, software, service providers, subscriptions, and account owners",
      "Record recurring symptoms, affected rooms or users, and business or household impact",
      "Gather floor plans, rack photos, network maps, credentials, and prior proposals",
      "Identify what must be preserved, what can change, and the preferred project timeline",
    ],
    bestFor:
      "Businesses and homeowners inheriting undocumented systems, recurring problems, ownership changes, remodels, or equipment nearing replacement.",
    platforms: [
      "System inventory",
      "Network maps",
      "As-built documents",
      "Support history",
      "Lifecycle review",
      "Upgrade roadmap",
    ],
    outcome:
      "A faster assessment and a prioritized plan that protects working systems while addressing the highest-impact problems first.",
  },
] as const;

export const resourceFaqItems = [
  {
    question: "What does managed IT include?",
    answer:
      "Managed IT generally includes help desk support, endpoint monitoring and patching, threat protection, backup planning, cloud administration, vendor coordination, documentation, and lifecycle planning. Golden State Visions sizes the scope around the organization, devices, applications, locations, and internal ownership model instead of forcing every client into one generic contract.",
  },
  {
    question: "What should happen during managed IT onboarding?",
    answer:
      "Onboarding should establish users, devices, administrators, vendors, licenses, networks, backups, security controls, and known risks. It should also define support contacts, escalation paths, documentation standards, and which improvements need immediate attention versus phased planning.",
  },
  {
    question: "Do small businesses need EDR or managed endpoint protection?",
    answer:
      "Most small and medium-sized businesses should protect laptops, desktops, and servers with centrally managed endpoint detection and response. Tools such as SentinelOne or Bitdefender can identify suspicious behavior, but they still need appropriate policies, alert ownership, patching, identity controls, and a documented response process.",
  },
  {
    question: "What is the difference between backup and business continuity?",
    answer:
      "Backup creates recoverable copies of data. Business continuity also considers how people will keep working, which systems must return first, how long recovery can take, who owns each step, and whether internet, identity, devices, servers, or vendors create additional dependencies.",
  },
  {
    question: "Can IT support help with HIPAA or PCI requirements?",
    answer:
      "Technology support can help implement and document safeguards such as access controls, multi-factor authentication, endpoint protection, backups, logging, network segmentation, and secure configuration. HIPAA and PCI obligations depend on the organization, systems, vendors, contracts, and data flows. Technical support should complement legal, compliance, or assessor guidance, not replace it.",
  },
  {
    question: "Why should guest Wi-Fi be separated from business devices?",
    answer:
      "Guest traffic should not share unrestricted access with point-of-sale systems, printers, cameras, workstations, medical devices, or back-office systems. Segmentation reduces exposure, improves visibility and performance, and can support PCI or HIPAA planning depending on the environment.",
  },
  {
    question: "When does a business need failover internet?",
    answer:
      "Failover is worth planning when payments, phones, cloud applications, cameras, booking systems, access control, or dispatch workflows depend on internet access. The design should identify which systems continue through the backup connection and how the transition is monitored and tested.",
  },
  {
    question: "When does a home need wired networking instead of Wi-Fi only?",
    answer:
      "Homes with cameras, touchscreens, outdoor areas, media rooms, smart-home processors, workspaces, or dense construction usually benefit from wired connections for access points and key devices. Wi-Fi performs best when it is supported by a planned wired backbone.",
  },
  {
    question: "How do Lutron HomeWorks and RadioRA 3 differ?",
    answer:
      "RadioRA 3 is well suited to many focused residential lighting projects, while HomeWorks supports larger and more customized homes with broader keypad, processor, panelized-lighting, shading, and integration requirements. The correct choice depends on project scale, load control, design expectations, construction stage, and long-term expansion needs.",
  },
  {
    question: "What should be planned before installing motorized shades?",
    answer:
      "Shade planning should cover window dimensions, fabric and openness, privacy, power, pockets, fascia, drapery, controls, daylight behavior, furniture, finish details, and service access. These decisions are substantially easier before framing, electrical, drywall, and millwork are complete.",
  },
  {
    question: "Can an existing smart home be repaired without replacing everything?",
    answer:
      "Often, yes. An assessment should identify which processors, keypads, lighting controls, network equipment, speakers, cameras, and control interfaces are still serviceable. Golden State Visions can then separate immediate repairs from reprogramming, documentation, and phased upgrades.",
  },
  {
    question: "Can one team handle business IT and connected-home systems?",
    answer:
      "Yes. Golden State Visions works across managed IT, business networks, cybersecurity, lighting control, smart-home automation, audio/video, surveillance, and access systems so clients can coordinate related technology through one accountable partner.",
  },
] as const;
