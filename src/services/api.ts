import axios from 'axios';
import { ApiResponse, Employee, EmployeeDetails } from '../types';

const API_BASE_URL = 'http://localhost:8000'; // Update this to match your backend URL

export const api = {
  // Generic GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return {
      data: response.data,
      status: response.status
    };
  },

  // Get all employees
  async getEmployees(): Promise<ApiResponse<Employee[]>> {
    return this.get<Employee[]>('/api/employees');
  },

  // Get employee by ID
  async getEmployee(employeeNumber: string): Promise<ApiResponse<EmployeeDetails>> {
    return this.get<EmployeeDetails>(`/api/employees/${employeeNumber}`);
  },

  // Generic POST request
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
    return {
      data: response.data,
      status: response.status
    };
  },

  // Generic PUT request
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, data);
    return {
      data: response.data,
      status: response.status
    };
  },

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`);
    return {
      data: response.data,
      status: response.status
    };
  }
}; 