import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RolesEnum } from '../enums/roles.enum';
import { Roles } from './roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: RolesEnum[]) {
    return applyDecorators(
        Roles(...roles),
        UseGuards(AuthGuard('oauth-bearer'), RolesGuard)
    );
}