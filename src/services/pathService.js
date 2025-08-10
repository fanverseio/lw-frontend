import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/paths";

const pathAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const pathService = {
  // Get paths
  async getAllPaths(token) {
    try {
      const response = await pathAPI.get("/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to fetch paths";
      throw new Error(message);
    }
  },

  async getPathById(token, pathId) {
    try {
      const response = await pathAPI.get(`/${pathId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to fetch path";
      throw new Error(message);
    }
  },

  // create a path

  async createPath(token, pathData) {
    try {
      const response = await pathAPI.post("/", pathData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to create path";
      throw new Error(message);
    }
  },

  // update a path

  async updatePath(token, pathId, pathData) {
    try {
      const response = await pathAPI.put(`/${pathId}`, pathData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to update path";
      throw new Error(message);
    }
  },

  async deletePath(token, pathId) {
    try {
      const response = await pathAPI.delete(`/${pathId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to delete path";
      throw new Error(message);
    }
  },
};
