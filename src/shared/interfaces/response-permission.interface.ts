export interface IResponsePermissions {
  id: number;
  description: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  moduleId: number;
  isActive: boolean;
  rolesPermission: any[];
}
