// types.ts
export interface User {
    _id: string;
    name?: string;
    email: string;
    emailVerified?: boolean;
    image?: string;
    hashedPassword?: string;
    createdAt: number;
    updatedAt: number;
  }
  