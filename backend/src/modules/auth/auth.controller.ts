import { ValidationPipe, Controller, Post, Body } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthCredentialsRequestDto,
  ValidateTokenResponseDto,
  ValidateTokenRequestDto,
  RefreshTokenRequestDto,
  LoginResponseDto,
  TokenDto,
} from './dtos';
import { TokenService, AuthService } from './services';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @ApiOperation({ description: '用户鉴权登录' })
  @ApiOkResponse({ description: '成功鉴权用户' })
  @ApiUnauthorizedResponse({ description: '非法登录' })
  @ApiInternalServerErrorResponse({ description: '服务器错误' })
  @Post('/login')
  login(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(authCredentialsDto);
  }

  @ApiOperation({ description: '在应用程序中更新访问' })
  @ApiOkResponse({ description: '令牌成功续期' })
  @ApiUnauthorizedResponse({ description: '刷新令牌无效或过期' })
  @ApiInternalServerErrorResponse({ description: '服务器错误' })
  @Post('/token/refresh')
  async getNewToken(
    @Body(ValidationPipe) refreshTokenDto: RefreshTokenRequestDto,
  ): Promise<TokenDto> {
    const { refreshToken } = refreshTokenDto;
    return this.tokenService.generateRefreshToken(refreshToken);
  }

  @ApiOperation({ description: '验证令牌' })
  @ApiOkResponse({ description: '验证成功' })
  @ApiInternalServerErrorResponse({ description: '服务器错误' })
  @Post('/token/validate')
  async validateToken(
    @Body(ValidationPipe) validateToken: ValidateTokenRequestDto,
  ): Promise<ValidateTokenResponseDto> {
    const { token } = validateToken;
    return this.tokenService.validateToken(token);
  }
}
