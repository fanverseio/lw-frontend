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

  // Path nodes and edges
  async getPathData(token, pathId) {
    try {
      const response = await pathAPI.get(`/${pathId}/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error || "Failed to fetch path data";
      throw new Error(message);
    }
  },

  async updatePathData(token, pathId, nodes, edges) {
    try {
      const response = await pathAPI.put(
        `/${pathId}/data`,
        { nodes, edges },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error || "Failed to update path data";
      throw new Error(message);
    }
  },

  // Get public paths
  async getPublicPaths() {
    try {
      const response = await pathAPI.get(`/public`);
      console.log(response.data);
  
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error || "Failed to fetch public paths";
      throw new Error(message);
    }
  },

  // toggle privacy settings
  async togglePathVisibility(token, pathId, isPublic) {
    try {
      const response = await pathAPI.put(
        `/${pathId}/visibility`,
        { isPublic },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error || "Failed to toggle path visibility";
      throw new Error(message);
    }
  },

  // copy path
  async copyPath(token, pathId, title) {
    try {
      const response = await pathAPI.post(
        `/${pathId}/copy`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to copy path";
      throw new Error(message);
    }
  },
};
