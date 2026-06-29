import { SectionCards } from "@/components/section-cards";
import { RegenerateResumeCard } from "@/components/resume/regenerate-resume-card";

export default function Page() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <SectionCards />
      <RegenerateResumeCard />
    </div>
  );
}
