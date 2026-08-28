import { projects } from "@/content/projects";
import { Section } from "./Section";
import { ProjectRow } from "./ProjectRow";

export function SelectedWork() {
  return (
    <Section id="work" index="01" name="Selected work">
      {projects.map((project, i) => (
        <ProjectRow key={project.slug} project={project} order={i} />
      ))}
    </Section>
  );
}
