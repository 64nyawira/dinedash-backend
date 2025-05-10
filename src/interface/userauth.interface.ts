export interface RegisterInput {
    name: string;
    email: string;
    password: string;
  }
  
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface ForgotPasswordInput {
    email: string;
  }
  
  export interface VerifyResetCodeInput {
    email: string;
    code: string;
  }
  
  export interface ResetPasswordInput {
    email: string;
    newPassword: string;
  }
  
  export interface ChangeRoleInput {
    adminId: string;
    userId: string;
    newRole: 'customer' | 'client';
  }
