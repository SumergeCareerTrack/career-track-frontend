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
  name: string;
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
  pending: boolean;

}
export interface LearningReq{
  type: UUID;
  subject: UUID;
  title: string;
  url: string;
  description: string;
  lengthInHours: string;
  pending: boolean;
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

export interface Notifications {
  receiverID: string[];
  actorId: string;
  name: ActionEnum;
  entityId: string;
  entityTypeName: EntityTypeEnum;
  date: Date;
  seen: boolean;
}
export interface NotificationData{
  receiverID: string[];
  actor?: UserResponse;
  name: string;
  entity?: LearningResp //| WikiResp | CareerPackageResp | BlogResp;
  entityTypeName: string;
  date: string;
  seen: boolean;
}

export enum ActionEnum {
  approval= 'APPROVAL',
  rejection= 'REJECTION',
  submission='SUBMISSION'
}
export enum EntityTypeEnum {
  approval= 'LEARNING',
  wiki= 'WIKI',
  blog='BLOG',
  Career_package='CAREER_PACKAGE'
}


