import api from "./api";

export const getNearbyGyms = async (city) => {
  try {
    const response = await api.get(`/gym?city=${encodeURIComponent(city)}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch nearby gyms");
  }
};
