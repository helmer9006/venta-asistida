import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AADAuthGaurd extends AuthGuard('aad') {}
