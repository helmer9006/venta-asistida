import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class RequestUserDto extends PartialType(CreateUserDto) {}
