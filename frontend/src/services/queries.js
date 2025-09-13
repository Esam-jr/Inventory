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
export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...itemData }) => api.put(`/items/${id}`, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries(["items"]);
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

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials) => api.post("/auth/login", credentials),
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/stats");
      return response.data;
    },
    refetchInterval: 300000,
  });
};

export const useUpdateRequisition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...requisitionData }) =>
      api.put(`/requisitions/${id}`, requisitionData),
    onSuccess: () => {
      queryClient.invalidateQueries(["requisitions"]);
    },
  });
};

export const useUpdateRequisitionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reasonForRejection }) =>
      api.patch(`/requisitions/${id}/status`, { status, reasonForRejection }),
    onSuccess: () => {
      queryClient.invalidateQueries(["requisitions"]);
    },
  });
};

// SERVICE REQUEST MUTATIONS
export const useCreateServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceRequestData) =>
      api.post("/service-requests", serviceRequestData),
    onSuccess: () => {
      queryClient.invalidateQueries(["service-requests"]);
    },
  });
};

export const useUpdateServiceRequestStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reasonForRejection }) =>
      api.patch(`/service-requests/${id}/status`, {
        status,
        reasonForRejection,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["service-requests"]);
    },
  });
};

// TRANSACTION MUTATIONS
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionData) => api.post("/transactions", transactionData),
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
      queryClient.invalidateQueries(["items"]);
    },
  });
};

export const useFulfillRequisition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requisitionId) =>
      api.post(`/requisitions/${requisitionId}/fulfill`),
    onSuccess: () => {
      queryClient.invalidateQueries(["requisitions"]);
      queryClient.invalidateQueries(["transactions"]);
      queryClient.invalidateQueries(["items"]);
    },
  });
};

// USER MUTATIONS (Admin only)
export const useUsers = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/users");
      return response.data;
    },
    refetchInterval: 300000,
  });
};
export const useDetailUser = (userId) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData) => api.post("/auth/register", userData),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...userData }) => api.put(`/users/${id}`, userData),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => api.delete(`/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};
