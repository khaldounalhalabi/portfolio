import { fetchProjectImageAction } from "./actions";
import ProjectSheet from "@/components/projects/project-sheet";
import TableActions from "@/components/projects/table-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import Project from "@/models/Project";
import { redirect } from "next/navigation";

const ProjectsPage = async () => {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    redirect("/500");
  }

  return (
    <Card className="m-5">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Manage portfolio projects, media, and tech stacks.
            </CardDescription>
          </div>
          <ProjectSheet fetchImageAction={fetchProjectImageAction} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>{project.year}</TableCell>
                <TableCell>{project.featured ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <TableActions project={project as Project} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProjectsPage;
