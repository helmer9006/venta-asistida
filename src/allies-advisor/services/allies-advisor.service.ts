import { Injectable } from '@nestjs/common';
import { CreateAlliesAdvisorDto } from '../models/dto/create-allies-advisor.dto';
import { UpdateAlliesAdvisorDto } from '../models/dto/update-allies-advisor.dto';
import { handleExceptions } from '@src/shared/helpers/general';

@Injectable()
export class AlliesAdvisorService {
  create(createAlliesAdvisorDto: CreateAlliesAdvisorDto) {
    try {
      // this.
    } catch (error) {
      handleExceptions(error);
    }
    return 'This action adds a new alliesAdvisor';
  }

  findAll() {
    return `This action returns all alliesAdvisor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alliesAdvisor`;
  }

  remove(id: number) {
    return `This action removes a #${id} alliesAdvisor`;
  }
}
