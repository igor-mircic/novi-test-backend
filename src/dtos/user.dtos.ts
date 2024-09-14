export interface RegisterUserRequestBodyDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterUserResponseBodyDto {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

export interface LoginUserRequestBodyDto {
  email: string;
  password: string;
}

export interface LoginUserResponseBodyDto {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}
