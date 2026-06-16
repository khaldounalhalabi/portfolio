import TableActions from "@/components/site-settings/table-actions";
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
import { title } from "@/lib/portfolio/forms";
import { createClient } from "@/lib/supabase/server";
import SiteSetting from "@/models/SiteSetting";
import { redirect } from "next/navigation";

const SiteSettingsIndex = async () => {
  const supabase = await createClient();

  const { data: siteSettings, error } = await supabase
    .from("site_settings")
    .select("*");

  if (error) {
    redirect("/500");
  }
  return (
    <Card className={"m-5"}>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>
          Change General Titles , Paragraphs and Settings Across the Landing
          Page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {siteSettings.map((setting, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{title(setting.key)}</TableCell>
                  <TableCell
                    className={"max-w-32"}
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {String(setting.value)}
                  </TableCell>
                  <TableCell>
                    <TableActions setting={setting as SiteSetting} />
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

export default SiteSettingsIndex;
