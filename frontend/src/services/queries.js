import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export const useItems = (params = {}) => {
  return useQuery({
    queryKey: ["items", params],
    queryFn: async () => {
      const response = await api.get("/items", { params });
      return response.data;
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId) => api.delete(`/items/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["items"]);
    },
  });
};
export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemData) => api.post("/items", itemData),
    onSuccess: () => {
      queryClient.invalidateQueries(["items"]);
    },
  });
};

// Requisitions queries
export const useRequisitions = (params = {}) => {
  return useQuery({
    queryKey: ["requisitions", params],
    queryFn: async () => {
      const response = await api.get("/requisitions", { params });
      return response.data;
    },
  });
};

export const useCreateRequisition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requisitionData) => api.post("/requisitions", requisitionData),
    onSuccess: () => {
      queryClient.invalidateQueries(["requisitions"]);
    },
  });
};

// Auth queries
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials) => api.post("/auth/login", credentials),
  });
};

// Dashboard queries
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/stats");
      return response.data;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};
