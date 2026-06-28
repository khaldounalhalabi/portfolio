import { fetchProjectImageAction } from "@/app/(dashboard)/dashboard/projects/actions";
import DeleteProjectButton from "@/components/projects/delete-project-button";
import ProjectSheet from "@/components/projects/project-sheet";
import Project from "@/models/Project";

const TableActions = ({ project }: { project: Project }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <ProjectSheet project={project} fetchImageAction={fetchProjectImageAction} />
      <DeleteProjectButton project={project} />
    </div>
  );
};

export default TableActions;
