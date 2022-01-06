import { CommonDTO } from '../../Common/dto';
import { UserStatus } from '/@/global-enums/User.enum';

export { UserStatus };
export class LoginDTO implements LoginVO {
  username = '';
  password = '';
  randomStr = '';
  code = '';
}

export class SmsLoginDTO implements SmsLoginVO {
  constructor(data: SmsLoginDTO) {
    this.mobile = 'SMS@' + data.mobile;
    this.code = data.code;
  }
  mobile: string;
  code: string;
}

export class UserInfoDTO extends CommonDTO implements UserInfoVO {
  id: string = '';
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  avatar: string = '';
  status: UserStatus = UserStatus.Active;
  isSuperUser = false;
}

export class CreateUserFormDTO extends CommonDTO implements CreateUserFormVO {
  id = '';
  username = '';
  lastName = '';
  firstName = '';
  password = '';
}
