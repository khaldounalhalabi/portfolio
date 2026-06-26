import SkillSheet from "@/components/skills/skill-sheet";
import TableActions from "@/components/skills/table-actions";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const SkillsPage = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("* , skill_categories(name, description)")
    .order("skill_categories(name)");

  const { data: categories, error: categoriesError } = await supabase
    .from("skill_categories")
    .select("*");

  if (error || categoriesError) {
    redirect("/500");
  }

  return (
    <Card className="m-5">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Manage skills.</CardDescription>
          </div>
          <SkillSheet categories={categories} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell>{skill.name}</TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      {skill.skill_categories.name}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{skill.skill_categories.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <TableActions skill={skill} categories={categories} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SkillsPage;
