import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlliesAdvisorDto } from '../models/dto/create-allies-advisor.dto';
import { handleExceptions } from '@src/shared/helpers/general';
import { PrismaService } from '../../prisma/services/prisma.service';
import { UtilsService } from '@src/shared/services/utils.service';
@Injectable()
export class AlliesAdvisorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utils: UtilsService,
  ) {}
  async create(createAlliesAdvisorDto: CreateAlliesAdvisorDto) {
    try {
      await this.utils.findAllyById(createAlliesAdvisorDto.allyId);
      return await this.prismaService.alliesAdvisor.create({
        data: createAlliesAdvisorDto,
      });
    } catch (error) {
      handleExceptions(error);
    }
  }

  async findAll(advisorId: number) {
    try {
      const recordsFound = await this.prismaService
        .$queryRaw`SELECT u.id, u."name", u.lastname, u.email , u.phone  FROM "Users" u 
        INNER JOIN "AlliesAdvisor" aa ON u.id = aa."allyId" 
        WHERE aa."advisorId" = ${advisorId}`;
      return recordsFound;
    } catch (error) {
      handleExceptions(error);
    }
  }

  async remove(id: number) {
    try {
      const recordsFound = await this.prismaService.alliesAdvisor.delete({
        where: { id },
      });
      return recordsFound;
    } catch (error) {
      handleExceptions(error);
    }
  }
}