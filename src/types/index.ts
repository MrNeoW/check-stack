// API response type
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface Employee {
  employeeNumber: string;
  firstName: string;
  name: string;
  lastName: string;
  salutation: string;
  profileColor: string;
  id: number;
  userId: string;
}

export interface EmployeeDetails extends Employee {
  fullName: string;
  gender: 'Male' | 'Female' | 'Unspecified';
  salutation: 'Dr.' | 'Mr.' | 'Ms.' | 'Mrs.' | 'Mx.'
  gsalary: number;
  profileColor: 'Green' | 'Blue' | 'Red' | 'Default';
} 