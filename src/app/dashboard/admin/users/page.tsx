import { getUsers } from "@/actions/users";
import UsersClient from "./UsersClient";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-primary mb-2">User Management</h1>
        <p className="font-body-md text-muted-foreground">Manage administrative and clerk access to the portal.</p>
      </div>

      <UsersClient initialUsers={users} />
    </div>
  );
}
