import { User } from './user.model';

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
  password?: string;
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
  id: UUID;
  title: string;
  url: string;
  typeName: string;
  typeBaseScore: number;
  description: string;
  subjectType: string;
  subjectName: string;
  lengthInHours: string;
  approved: boolean;
}

export interface LearningReq {
  type: UUID;
  subject: UUID;
  title: string;
  url: string;
  description: string;
  lengthInHours: string;
  approved: boolean;
}
export interface TypeReq {
  name: string;
  baseScore: number;
}

export interface TypeResp {
  id: UUID;
  name: string;
  baseScore: number;
}

export interface SubjectReq {
  type: string;
  name: string;
}
export interface SubjectResp {
  id: UUID;
  type: string;
  name: string;
}

export interface myLearningReq {
  proof: String;
  comment: string;
  date: Date;
  approvalStatus: ApprovalStatus;
  User: User;
  Learning: LearningResp;
  // Booster: Booster;
  // ProofType: ProofType;
}
enum ApprovalStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
}
export enum SubjectType {
  Functional = 'FUNCTIONAL',
  Organisational = 'ORGANISATIONAL',
}

export interface Notifications {
  id: string;
  receiverID: string[];
  actorId: string;
  name: ActionEnum;
  entityId: string;
  entityTypeName: EntityTypeEnum;
  date: Date;
  seen: boolean;
}
export interface NotificationData {
  id: string;
  receiverID: string[];
  actor?: UserResponse;
  name: string;
  entity?: LearningResp | ArticleResp | EmployeeCareerPackageResponseDTO;
  entityTypeName: string;
  date: Date;
  seen: boolean;
}

export interface ArticleReq {
  title: string;
  author: string;
  type: ArticleType;
  submissionDate: Date;
  approvalStatus: ApprovalStatus;
  comment: string;
  body: string;
}

export interface ArticleResp {
  id: string;
  title: string;
  author: string;
  type: ArticleType;
  submissionDate: Date;
  approvalStatus: ApprovalStatus;
  comment: string;
  body: string;
}
export interface CareerPackageTemplateRequestDTO {
  file: File;
  titleId: string;
  name: string;
}
export interface EmployeeCareerPackageRequestDTO {
  employeeId: string;
  file: File;
}
export interface CareerPackageTemplateResponseDTO {
  id: string;
  fileId: string;
  titleId: string;
  name: string;
}

export interface EmployeeCareerPackageResponseDTO {
  id: string;
  employeeId: string;
  fileId: string;
  submissionDate: Date;
  comment: string;
  approvalStatus: ApprovalStatus;
  title?: '';
}

export enum ArticleType {
  blog = 'BLOG',
  wiki = 'WIKI',
}
export enum ActionEnum {
  approval = 'APPROVAL',
  rejection = 'REJECTION',
  submission = 'SUBMISSION',
}
export enum EntityTypeEnum {
  learning = 'LEARNING',
  wiki = 'WIKI',
  blog = 'BLOG',
  career_package = 'CAREER_PACKAGE',
}
export interface UserLearningResp {
  id: UUID;
  proof: string;
  comment: string;
  date: Date;
  approvalStatus: ApprovalStatus;
  userId: string;
  learning: LearningResp;
  booster: any;
}

export interface UserLearningReq {
  proof: string;
  userId: string;
  learningId: string;
}

export interface UserLearningApprovalReq {
  approvalStatus: string;
  comment: string;
  date: string;
  id: string;
  booster: any;
  learning: CustomUserLearning;
  proof: string;
  userId: string;
}

export interface CustomUserLearning {
  id: string;
  approved: boolean;
  description: string;
  lengthInHours: number;
  subject: SubjectResp;
  type: TypeResp;
  title: string;
  url: string;
}
