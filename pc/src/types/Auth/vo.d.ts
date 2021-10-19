interface AuthRole {
  name: string;
  permissions: string[];
}

interface AuthAccessVO {
  additionalPermissions: string[];
  roles: AuthRole[];
}

interface AuthTokenVO {
  accessToken: string;
  accessTokenExpires: string;
  refreshToken: string;
  tokenType: string;
}

interface AuthUserVO {
  firstName: string;
  id: string;
  isSuperUser: boolean;
  lastName: string;
  status: string;
  username: string;
}

interface AuthLoginVO {
  access: AuthAccessVO;
  token: AuthTokenVO;
  user: AuthUserVO;
}
