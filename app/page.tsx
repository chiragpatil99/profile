import { Nav } from "@/components/nav";
import { CommandPalette } from "@/components/command-palette";
import { GsapEffects } from "@/components/gsap-effects";
import { Hero } from "@/components/hero";
import { About } from "@/components/sections/about";
import { ExperienceSection } from "@/components/sections/experience";
import { ProjectsSection } from "@/components/sections/projects";
import { Playground } from "@/components/sections/playground";
import { Skills } from "@/components/sections/skills";
import { EducationSection } from "@/components/sections/education";
import { TerminalSection } from "@/components/sections/terminal";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
import { site, socials } from "@/content/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.title,
    url: site.url,
    sameAs: [socials.github, socials.linkedin],
    alumniOf: { "@type": "CollegeOrUniversity", name: "Virginia Tech" },
  };

  return (
    <>
      <Nav />
      <CommandPalette />
      <GsapEffects />
      <main id="main">
        <Hero />
        <About />
        <ExperienceSection />
        <ProjectsSection />
        <Playground />
        <Skills />
        <EducationSection />
        <TerminalSection />
        <Contact />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
