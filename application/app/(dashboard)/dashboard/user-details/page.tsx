import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UpdateUserForm from "@/components/user/update-user-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const UserDetails = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
    return;
  }
  return (
    <Card className={"m-5"}>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Change Your Account Preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateUserForm user={user} />
      </CardContent>
    </Card>
  );
};

export default UserDetails;
