export interface Entry {
  period: string
  role: string
  /** Line under the role, e.g. "OCI, Oracle". */
  org: string
  /** Short name behind the logo tile; its initials show when `logo` is not set. */
  company: string
  /** Path to a logo in /static, e.g. "/logos/oracle.png". */
  logo?: string
  /** "cover" (default) fills the tile; "contain" is for transparent marks on a white tile. */
  logoFit?: "cover" | "contain"
  url?: string
  current?: boolean
  /** Short labels shown as chips under the role. */
  highlights?: string[]
  description: string
}

export const work: Entry[] = [
  {
    period: "10/2026 – Present",
    role: "Project Manager",
    org: "Second Foundation",
    company: "Second Foundation",
    logo: "/logos/second-foundation.png",
    url: "https://www.second-foundation.eu/",
    current: true,
    highlights: ["Team leadership", "Project delivery", "Business process automation"],
    description:
      "We create the code for a better future - literally. At Second Foundation, I am managing a team of extremely talented developers to help build custom inhouse products for energy scheduling and support of our physical assets.",
  },
  {
    period: "03/2026 – Present",
    role: "Co-founder",
    org: "Nomox",
    company: "Nomox",
    logo: "/logos/nomox_logo.svg",
    logoFit: "contain",
    url: "https://get-nomox.com/",
    highlights: ["Team of 5 engineers", "Semantic data layer", "AI agents"],
    description:
      "Nomox went from a hackathon project to a startup, and I led its team of five young engineers. We focused on a data layer that connects the sources a company already runs, discovers how they relate, and gives every field its business meaning, so that people and AI agents can ask questions in plain language and get answers from real data. We built the product before we learned the business, and as a startup it failed. It taught me a valuable lesson: understand the customer first, then build. The code will be open sourced soon. Also pitched in front of a VCs so that was fun and met some great mentors.",
  },
  {
    period: "07/2025 – 08/2026",
    role: "Software Engineer Intern",
    org: "OCI, Oracle",
    company: "Oracle",
    logo: "/logos/oracle.png",
    logoFit: "contain",
    url: "https://www.oracle.com/cloud/",
    highlights: ["Java", "AI champion", "Terraform", "Observability lead", "Distributed systems"],
    description:
      "Along my amazing collegues we focused on building a flagship product for Oracle Cloud Infrastructure - OCI Batch. I was fortunate to work on a product that was in Limited Availability and help bring it to General Availability. My role involved extending core Java APIs, working with Micronaut-based services, and collaborating closely with the Micronaut team on framework-level topics. Furthermore I was one of few ai champions - proposing new AI-driven approaches to development. I learned a great deal about cloud computing, distributed systems, and the challenges of building scalable and reliable software in a production environment (fun fun). I also had the opportunity to lead metrics and observability initiatives, enhancing the monitoring and performance of our services.",
  },
  {
    period: "06/2024 – 09/2024",
    role: "Software Engineer",
    org: "Greenpanda",
    company: "Greenpanda",
    logo: "/logos/greenpanda.png",
    url: "https://greenpanda.cz/",
    highlights: ["SvelteKit", "Figma to frontend"],
    description:
      "My first exposure to commercial software development was at Greenpanda - a small software studio. I worked on building responsive, production-ready web apps using SvelteKit, translating designs directly from Figma into optimized frontends.",
  },
]

export const education: Entry[] = [
  {
    period: "09/2025 – Present",
    role: "MSc Data and Software Engineering",
    org: "Charles University (Matfyz), Prague",
    company: "Charles University",
    logo: "/logos/uk_logo.jpg",
    url: "https://www.mff.cuni.cz/",
    current: true,
    highlights: ["Information retrieval", "Large-scale data processing", "Applied ML"],
    description:
      "I am currently pursuing a master’s degree focused on data-centric software systems, with an emphasis on information retrieval, large-scale data processing, and applied machine learning",
  },
  {
    period: "09/2022 – 09/2025",
    role: "BSc Computer Science - Web and Data Oriented Programming",
    org: "Charles University (Matfyz), Prague",
    company: "Charles University",
    logo: "/logos/uk_logo.jpg",
    url: "https://www.mff.cuni.cz/",
    highlights: ["Dean’s Award nomination", "Basics of data engineering", "CS foundations"],
    description:
      "During my bachelor’s studies, I built a strong foundation in computer science with a focus on data engineering, distributed systems, semantic web, and linked data. My bachelor’s thesis, Interactive web-based voting application, was nominated for the Dean’s Award.",
  },
]
