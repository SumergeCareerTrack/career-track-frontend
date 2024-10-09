import { User } from "./user.model";

export type UUID = string;
export interface Department {
  id: string;
  name: string;
}

export interface Title {
  id: string;
  departmentId: string;
  manager: boolean;
  titleName: string;
}

export interface UserRequest {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  managerId: string;
  department: string;
  titleName: string;
  password?:string;
}
export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  title: Title;
  managerId: string;
}

export interface LearningResp {
  id:UUID;
  title: string;
  url: string;
  typeName:string;
  typeBaseScore:number;
  description: string;
  subjectType: string;
  subjectName: string;
  lengthInHours: string;
}
export interface LearningReq{
  type: UUID;
  subject: UUID;
  title: string;
  url: string;
  description: string;
  lengthInHours: string;
}

export interface TypeReq{
  name: string;
  baseScore: number;
}

export interface TypeResp{
  id:UUID;
  name: string;
  baseScore: number;
}

export interface SubjectReq{
  type:string;
  name: string;
}
export interface SubjectResp{
  id: UUID;
  type: string;
  name: string;
}

export interface myLearningReq{
  proof: String;
  comment: string;
  date: Date;
  approvalStatus: ApprovalStatus;
  User : User;
  Learning : LearningResp;
  // Booster: Booster;
  // ProofType: ProofType;

}
enum ApprovalStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED'
}
export enum SubjectType {
  Functional= 'FUNCTIONAL',
  Organisational= 'ORGANISATIONAL',
}



