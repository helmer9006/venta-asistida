import { PartialType } from '@nestjs/swagger';
import { CreateConfigAllyDto } from './create-config-ally.dto';

export class UpdateConfigAllyDto extends PartialType(CreateConfigAllyDto) {}
