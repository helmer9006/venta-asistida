import { PartialType } from '@nestjs/swagger';
import { CreateAlliesAdvisorDto } from './create-allies-advisor.dto';

export class UpdateAlliesAdvisorDto extends PartialType(CreateAlliesAdvisorDto) {}
