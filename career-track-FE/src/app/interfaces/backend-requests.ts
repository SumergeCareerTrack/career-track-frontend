
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

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  managerId: string;
  department: string;
  title: string;

}
