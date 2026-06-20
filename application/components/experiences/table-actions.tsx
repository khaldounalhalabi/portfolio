"use client";

import DeleteExperienceButton from "@/components/experiences/delete-experience-button";
import ExperienceSheet from "@/components/experiences/experience-sheet";
import Experience from "@/models/Experience";

const TableActions = ({ experience }: { experience: Experience }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <ExperienceSheet experience={experience} />
      <DeleteExperienceButton experience={experience} />
    </div>
  );
};

export default TableActions;
