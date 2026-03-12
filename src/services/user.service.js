import api from "./api";

export const getProfile = async () => {
  const res = await api.get("/user");

  if (!res.data?.success) {
    throw new Error("Failed to fetch profile");
  }

  return res.data.data;
};

export const updateProfile = async (payload) => {
  const res = await api.put("/user", payload);

  if (!res.data?.success) {
    throw new Error("Failed to update profile");
  }

  return res.data.data;
};
export const getUserById = async (userId) => {
  const res = await api.get(`/user/${userId}`);

  if (!res.data?.success) {
    throw new Error("Failed to fetch user");
  }

  return res.data.data;
};
