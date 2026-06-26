import SkillCategorySheet from "@/components/skill-categories/skill-category-sheet";
import TableActions from "@/components/skill-categories/table-actions";
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
import SkillCategory from "@/models/SkillCategory";
import { redirect } from "next/navigation";

const SkillCategoriesIndex = async () => {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("skill_categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    redirect("/500");
  }

  return (
    <Card className="m-5">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Skill Categories</CardTitle>
            <CardDescription>
              Manage skill category names, icons, and descriptions.
            </CardDescription>
          </div>
          <SkillCategorySheet />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Highlighted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {category.icon}
                </TableCell>
                <TableCell
                  className="max-w-96"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {category.description}
                </TableCell>
                <TableCell>
                  {category.is_highlighted ? "Yes" : "No"}
                </TableCell>
                <TableCell>
                  <TableActions category={category as SkillCategory} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SkillCategoriesIndex;
