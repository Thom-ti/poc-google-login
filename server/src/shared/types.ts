export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
};

export type RequestUser = {
  googleId: string;
  email: string;
  name: string;
  displayName: string;
  picture: string;
  accessToken: string;
};
