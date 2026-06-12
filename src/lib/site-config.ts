// Site configuration — edit here to update content site-wide

type TeamLink = { type: "discord" | "roblox"; href: string; label: string };

type TeamMember = {
  name: string;
  handle: string;
  role: string;
  quote: string;
  img: string;
  robloxUserId?: number;
  discordUsername?: string;
  links?: TeamLink[];
};

export const siteConfig = {
  name: "BuildUp Games",
  shortName: "BuildUp",
  tagline: "Building games worth playing.",
  description:
    "BuildUp develops, scales, and acquires Roblox experiences with a focus on games that keep players coming back.",
  hero: {
    eyebrow: "Roblox Publishing Studio",
    titleLines: ["Building Games", "Worth Playing"],
    subtitle: "Where Roblox ideas come alive — through creative direction, live operations, and a publishing ecosystem built to grow.",
    primaryCta: { label: "Explore experiences", href: "#experiences" },
    secondaryCta: { label: "Get in touch", href: "#contact" },
    stats: [
      { value: "0", label: "Total CCU" },
      { value: "0", label: "Total Visits" },
    ],
  },
  about: {
    eyebrow: "About BuildUp",
    title: "Games that keep players coming back.",
    body: "BuildUp develops, scales, and acquires Roblox experiences with a focus on games that keep players coming back. We combine creative direction, live operations, progression design, and publishing support to turn strong ideas into durable worlds.",
    pillars: [
      {
        title: "We design the play.",
        body: "We shape clear game loops, satisfying progression, and polished worlds that feel good from the first session.",
      },
      {
        title: "We grow what works.",
        body: "We grow experiences with live updates, player insights, and systems built to support steady long-term momentum.",
      },
      {
        title: "We publish with creators.",
        body: "We work with creators and studios to bring promising Roblox projects into a stronger publishing ecosystem.",
      },
    ],
  },
  experiences: {
    eyebrow: "Experiences",
    title: "Featured Experiences",
    subtitle: "No live experiences yet. Add your first Roblox game when you’re ready.",
  },
  games: [] as Array<{
    name: string;
    studio: string;
    placeId: number;
    img: string;
    url: string;
    tag: string;
  }>,
  team: {
    eyebrow: "People",
    title: "Our Team",
    subtitle: "The leaders behind BuildUp.",
    members: [
      {
        name: "Dan",
        handle: "@danxboii",
        role: "CEO & Founder",
        quote: "We started BuildUp to give Roblox studios the support we always wished we had — strong creative direction, live ops that actually move the needle, and a team that cares about the long game.",
        img: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-7E144DA4A088DD490E99731B6E8AB554-Png/420/420/AvatarHeadshot/Png/noFilter",
        robloxUserId: 2929716136,
        discordUsername: "ows6",
        links: [
          { type: "discord" as const, href: "https://discord.gg/buildup", label: "Discord" },
          { type: "roblox" as const, href: "https://www.roblox.com/users/2929716136/profile", label: "Roblox Profile" },
        ] as TeamLink[],
      } as TeamMember,
      {
        name: "ShaysDevs",
        handle: "@ShaysDevs",
        role: "Chief Operating Officer",
        quote: "Building stronger studio operations, smoother launches, and more consistent growth across each Roblox experience.",
        img: "https://images.fillout.com/orgid-720100/flowpublicid-hmhysps8op/widgetid-default/6gTMX4fq9bGovu4zhC7qKd/pasted-image-1780736990599-f90y4fby.png",
        robloxUserId: 5785246980,
        discordUsername: "shaydevs",
        links: [
          { type: "discord" as const, href: "https://discord.gg/buildup", label: "Discord" },
          { type: "roblox" as const, href: "https://www.roblox.com/users/5785246980/profile", label: "Roblox Profile" },
        ] as TeamLink[],
      } as TeamMember,
    ] as TeamMember[],
  },
  contact: {
    eyebrow: "Get in touch",
    title: "Bring BuildUp the next Roblox hit.",
    body: "Interested in working with us? We'd love to hear from you. Reach out for publishing, live operations, creator collaboration, or development support.",
    email: "buildupsupport@gmail.com",
    options: [
      {
        tag: "Pitch",
        title: "New Concepts",
        body: "Send a prototype, design direction, or early idea that deserves a stronger production path.",
      },
      {
        tag: "Partner",
        title: "Studio Support",
        body: "Reach out for publishing, live operations, creator collaboration, or development support.",
      },
      {
        tag: "Portfolio",
        title: "Game Sales",
        body: "Talk with us about acquisition opportunities and moving your experience into BuildUp.",
      },
    ],
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} BuildUp Games. All rights reserved.`,
    built: "Crafted with care in the Roblox ecosystem.",
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Experiences", href: "#experiences" },
    { label: "Team", href: "#team" },
    { label: "Contact", href: "#contact" },
  ],
  social: {
    roblox: "https://www.roblox.com/groups/buildup",
    twitter: "https://twitter.com/buildupgames",
    discord: "https://discord.gg/buildup",
  },
};

export type SiteConfig = typeof siteConfig;
