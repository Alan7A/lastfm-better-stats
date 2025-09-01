import BulkEdit from "@/components/bulk-edit";
import ManualScrobble from "@/components/manual-scrobble";
import ScrobbleAlbum from "@/components/scrobble-album";
import { cookies } from "next/headers";

const Page = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("lastfm_session");
  const sessionValue = sessionCookie?.value;

  let username: string | undefined;
  let isAuthenticated = false;

  if (sessionValue) {
    try {
      const session = JSON.parse(sessionValue);
      username = session.name;
      isAuthenticated = true;
    } catch (error) {
      console.error("Failed to parse session cookie:", error);
      username = undefined;
      isAuthenticated = false;
    }
  } else {
    username = undefined;
    isAuthenticated = false;
  }

  return (
    <div className="p-3 space-y-4 max-w-screen-lg mx-auto">
      <h2 className="text-3xl font-bold">Tools</h2>
      <BulkEdit isAuthenticated={isAuthenticated} username={username ?? ""} />
      <ManualScrobble
        isAuthenticated={isAuthenticated}
        username={username ?? ""}
      />
      <ScrobbleAlbum
        isAuthenticated={isAuthenticated}
        username={username ?? ""}
      />
    </div>
  );
};

export default Page;
