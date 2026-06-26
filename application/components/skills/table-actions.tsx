import DeleteSkillButton from "@/components/skills/delete-skill-button";
import SkillSheet from "@/components/skills/skill-sheet";
import Skill from "@/models/Skill";
import SkillCategory from "@/models/SkillCategory";

const TableActions = ({
  skill,
  categories,
}: {
  skill: Skill;
  categories: SkillCategory[];
}) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <SkillSheet categories={categories} skill={skill} />
      <DeleteSkillButton skill={skill} />
    </div>
  );
};

export default TableActions;
