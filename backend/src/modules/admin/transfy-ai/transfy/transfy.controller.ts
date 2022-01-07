import { PaginationParams } from '@common/decorators';
import { PaginationRequest } from '@common/interfaces';
import { UserEntity } from '@modules/admin/access/users/user.entity';
import {
  CurrentUser,
  JwtAuthGuard,
  PermissionsGuard,
  TOKEN_NAME,
} from '@modules/auth';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTransfyRequestDto } from './dtos/';
import { TransfyService } from './transfy.service';

@ApiTags('Transfy')
@ApiBearerAuth(TOKEN_NAME)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({
  path: 'transfy-ai/transfy',
  version: '1',
})
export class TransfyController {
  constructor(private transfyService: TransfyService) {}

  @Get('/run_rec/:id')
  public runRecQueueTask(@Param('id', ParseUUIDPipe) id: string) {
    return this.transfyService.runRecQueueTask(id);
  }

  @ApiOperation({ description: '删除项目' })
  @Delete()
  public deleteTransfy(@Body() ids: string[]) {
    return this.transfyService.deleteTransfy(ids);
  }
  /**
   * 字幕转译分页
   * @param pagination 分页参数
   * @returns 分页
   */
  @ApiOperation({ description: '字幕转译项目分页' })
  @Get('/page')
  public getTransfyPage(@PaginationParams() pagination: PaginationRequest) {
    return this.transfyService.getTransfyPage(pagination);
  }
  /**
   * 创建字幕转译项目
   */
  @ApiOperation({ description: '创建字幕转译项目' })
  @Post()
  public createTransfy(
    @Body(ValidationPipe) transfyFormDto: CreateTransfyRequestDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.transfyService.createTransfy(transfyFormDto, user);
  }
}
