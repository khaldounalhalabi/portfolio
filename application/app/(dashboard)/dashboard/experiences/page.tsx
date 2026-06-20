import ExperienceSheet from "@/components/experiences/experience-sheet";
import TableActions from "@/components/experiences/table-actions";
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
import Experience from "@/models/Experience";
import { format } from "date-fns";
import { redirect } from "next/navigation";

const ExperiencesIndex = async () => {
  const supabase = await createClient();
  const { data: experiences, error } = await supabase
    .from("experiences")
    .select("*")
    .order("from", { ascending: false });

  if (error) {
    redirect("/500");
  }

  return (
    <Card className={"m-5"}>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Experiences</CardTitle>
            <CardDescription>
              Manage work history, company details, and role descriptions.
            </CardDescription>
          </div>
          <ExperienceSheet />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((exp, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{exp.company_name}</TableCell>
                  <TableCell
                    className={"max-w-32"}
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {exp.company_website ?? "-"}
                  </TableCell>
                  <TableCell>{formatPeriod(exp)}</TableCell>
                  <TableCell>
                    <TableActions experience={exp as Experience} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExperiencesIndex;

function formatPeriod(experience: Pick<Experience, "from" | "to">) {
  const from = format(new Date(experience.from), "MMM yyyy");
  const to = experience.to
    ? format(new Date(experience.to), "MMM yyyy")
    : "Present";

  return `${from} - ${to}`;
}
