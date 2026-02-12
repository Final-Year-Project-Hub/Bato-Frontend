import { cookies } from "next/headers";
import UsersPageClient from "./UsersPageClient";
import { transformApiUsers } from "../../../lib/utilis/transformUsers";

async function getAllUsers() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const cookieStore = await cookies();
    
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      console.error("No access token found");
      return null;
    }

    const response = await fetch(`${baseUrl}/api/user/getAllUsers`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
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