import { UserProfile } from "../types";
import { apiRequest } from "./api";

export const userServices = {
  getUserProfile: (userId: number) => {
    return apiRequest<UserProfile>({
      method: "GET",
      url: `/users/${userId}/profile`,
    });
  },
};
