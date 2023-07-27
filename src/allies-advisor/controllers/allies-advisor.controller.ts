import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AlliesAdvisorService } from '../services/allies-advisor.service';
import { CreateAlliesAdvisorDto } from '../models/dto/create-allies-advisor.dto';
import { UpdateAlliesAdvisorDto } from '../models/dto/update-allies-advisor.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Auth } from '@src/auth/decorators';
import { RolesEnum } from '@src/auth/enums/roles.enum';

@ApiTags('Services Allies Advisor')
@Controller('allies-advisor')
export class AlliesAdvisorController {
  constructor(private readonly alliesAdvisorService: AlliesAdvisorService) {}

  @Post()
  @Auth(RolesEnum.SUPERADMIN, RolesEnum.ADMIN)
  @ApiBody({ type: CreateAlliesAdvisorDto })
  create(@Body() createAlliesAdvisorDto: CreateAlliesAdvisorDto) {
    return this.alliesAdvisorService.create(createAlliesAdvisorDto);
  }

  @Get()
  findAll() {
    return this.alliesAdvisorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alliesAdvisorService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alliesAdvisorService.remove(+id);
  }
}
