import axiosInstance from "./axiosInstance";
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  status: number;
  result: {
    data: {
      accessToken: string;
      expiresIn: number;
    };
    message: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/api/login', credentials);
    return response.data;
  }
};
