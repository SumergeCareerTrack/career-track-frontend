export interface Department {
  id: string;
  name: string;
}

export interface Title {
  id: string;
  departmentId: string;
  titleName: string;
  manager: boolean;
}

export interface UserRequest {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  managerId: string;
  department: string;
  title: string;
}
export interface UserResponse {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  managerId: string;
  department: Department;
  title: Title;
  token: string;
}
