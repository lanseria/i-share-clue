interface LoginVO {
  username: string;
  password: string;
  randomStr: string;
  code: string;
}

interface SmsLoginVO {
  mobile: string;
  code: string;
}

interface UserPageItemVO {
  createAt: string;
  id: string;
  avatar: string;
  isSuperUser: boolean;
  username: string;
  status: string;
  lastName: string;
  firstName: string;
}

interface CreateUserFormVO {
  id: string;
  username: string;
  lastName: string;
  firstName: string;
  password: string;
}
