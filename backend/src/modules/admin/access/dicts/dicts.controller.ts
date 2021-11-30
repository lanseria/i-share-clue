import { ApiPaginatedResponse, PaginationParams } from '@common/decorators';
import { PaginationResponseDto } from '@common/dtos';
import { PaginationRequest } from '@common/interfaces';
import { JwtAuthGuard, PermissionsGuard, TOKEN_NAME } from '@modules/auth';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DictsService } from './dicts.service';
import { CreateDictRequestDto } from './dtos/create-dict-request.dto';
import { DictResponseDto } from './dtos/dict-response.dto';
import { UpdateDictRequestDto } from './dtos/update-dict-request.dto';

@ApiTags('Dicts')
@ApiBearerAuth(TOKEN_NAME)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({
  path: 'access/dicts',
  version: '1',
})
export class DictsController {
  constructor(private dictsService: DictsService) {}
  /**
   * 新增字典
   * @param dict
   * @returns
   */
  @ApiOperation({ description: '新增字典' })
  @Post()
  public createDict(@Body() dict: CreateDictRequestDto) {
    return this.dictsService.createDict(dict);
  }
  /**
   * 更新字典
   * @param dict
   * @returns
   */
  @ApiOperation({ description: '更新字典' })
  @Put()
  public updateDict(@Body(ValidationPipe) dict: UpdateDictRequestDto) {
    return this.dictsService.updateDict(dict);
  }
  /**
   * 删除字典
   * @param ids
   * @returns
   */
  @ApiOperation({ description: '删除字典' })
  @Delete()
  public deleteDict(@Body() ids: string[]) {
    return this.dictsService.deleteDict(ids);
  }
  /**
   * 字典管理分页
   * @param pagination 分页信息
   * @returns 字典管理分页
   */
  @ApiOperation({ description: '获得一个分页的字典列表' })
  @ApiPaginatedResponse(DictResponseDto)
  @Get('/page')
  public getUsers(
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<DictResponseDto>> {
    return this.dictsService.getDicts(pagination);
  }
}
