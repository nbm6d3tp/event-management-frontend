export type TUser = {
  lastname: string;
  firstname: string;
  email: string;
  avatar: string;
};

export type TUserRegisterData = TUser & { password: string };
