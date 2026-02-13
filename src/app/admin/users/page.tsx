import UsersPageClient from "./UsersPageClient";
import { transformApiUsers } from "../../../lib/utilis/transformUsers";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

async function getAllUsers() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const response = await fetch(`${baseUrl}/api/user/getAllUsers`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      // console.error("API Error:", errorText);
      toast.error("Failed to fetch users. Please try again.");
      if (response.status === 401) {
        console.log("Token expired, needs refresh");
      }
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export default async function UsersPage() {
  const apiResponse = await getAllUsers();

  if (!apiResponse) {
    return <UsersPageClient initialUsers={[]} />;
  }

  console.log("=== FULL API RESPONSE ===");
  console.log(JSON.stringify(apiResponse, null, 2));

  console.log("=== FIRST USER OBJECT ===");
  console.log(JSON.stringify(apiResponse.data?.[0], null, 2));

  const users = transformApiUsers(apiResponse);

  return <UsersPageClient initialUsers={users} />;
}
