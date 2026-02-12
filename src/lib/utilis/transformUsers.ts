// lib/utils/transformUsers.ts
import { ApiUser, User } from '@/types/user';

export function transformApiUsers(apiResponse: { data?: ApiUser[] }): User[] {
  const apiUsers = apiResponse.data || [];
  
  return apiUsers.map((apiUser: ApiUser) => ({
    id: apiUser.id,
    name: apiUser.name || 'Unknown User',
    email: apiUser.email,
    roadmaps: apiUser.roadmaps?.length || 0,
    joined: new Date(apiUser.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }),
    status: apiUser.emailVerified === true ? "Verified" : "Not Verified",
    image: apiUser.image,
  }));
}