export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  image: string;
  role: string;
};

export type TRequestUser = {
  googleId: string;
  email: string;
  name: string;
  displayName: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
};
