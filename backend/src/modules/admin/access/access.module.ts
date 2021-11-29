import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { DictsModule } from './dicts/dicts.module';

@Module({
  imports: [RolesModule, PermissionsModule, UsersModule, DictsModule],
})
export class AccessModule {}
