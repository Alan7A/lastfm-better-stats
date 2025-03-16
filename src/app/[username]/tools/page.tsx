import BulkEdit from "@/components/bulk-edit";
import { cookies } from "next/headers";

const page = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("lastfm_session");
  const { value } = sessionCookie ?? {};
  const session = JSON.parse(value ?? "{}");
  const username = session.name;
  const isAuthenticated = !!sessionCookie;

  return (
    <div className="p-3 space-y-4 max-w-screen-lg mx-auto">
      <h2 className="text-3xl font-bold">Tools</h2>
      <BulkEdit isAuthenticated={isAuthenticated} username={username} />
    </div>
  );
};

export default page;
