import DeleteSkillCategoryButton from "@/components/skill-categories/delete-skill-category-button";
import SkillCategorySheet from "@/components/skill-categories/skill-category-sheet";
import SkillCategory from "@/models/SkillCategory";

const TableActions = ({ category }: { category: SkillCategory }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <SkillCategorySheet category={category} />
      <DeleteSkillCategoryButton category={category} />
    </div>
  );
};

export default TableActions;
