import type {
  ActiveStatus,
  Role,
} from "../../../prisma/generated/prisma/enums";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: Role;
  status?: ActiveStatus;
}

export interface ILoginUser {
  email: string;
  password: string;
}
