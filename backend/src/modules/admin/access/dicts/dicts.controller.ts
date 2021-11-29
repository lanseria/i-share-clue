import { JwtAuthGuard, PermissionsGuard, TOKEN_NAME } from '@modules/auth';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DictsService } from './dicts.service';
import { CreateDictRequestDto } from './dtos/create-dict-request.dto';

@ApiTags('Dicts')
@ApiBearerAuth(TOKEN_NAME)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({
  path: 'access/dicts',
  version: '1',
})
export class DictsController {
  constructor(private dictsService: DictsService) {}
  @Post()
  public createDict(@Body() dict: CreateDictRequestDto) {
    return this.dictsService.createDict(dict);
  }
}
