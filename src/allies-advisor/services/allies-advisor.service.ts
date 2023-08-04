import { Injectable } from '@nestjs/common';
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
  async create(createAlliesAdvisorDto: CreateAlliesAdvisorDto[]) {
    try {
      await this.utils.findAdvisorById(createAlliesAdvisorDto[0].advisorId);
      const alliesId = createAlliesAdvisorDto.map((advisor) => advisor.allyId);
      await this.utils.findAllyById(alliesId);
      return await this.prismaService.alliesAdvisor.createMany({
        data: createAlliesAdvisorDto,
      });
    } catch (error) {
      handleExceptions(error);
    }
  }

  async findAll(advisorId: number) {
    try {
      const recordsFound = await this.prismaService
        .$queryRaw`SELECT aa."id", u."name", u."lastname", u."email" , u."phone", aa."allyId", aa."advisorId"  FROM "Users" u 
        INNER JOIN "AlliesAdvisor" aa ON u.id = aa."allyId" 
        WHERE aa."advisorId" = ${advisorId}`;
      return recordsFound;
    } catch (error) {
      handleExceptions(error);
    }
  }

  async findOneById(id: number) {
    try {
      const recordsFound = await this.prismaService.alliesAdvisor.findUnique({
        where: { id: id },
      });
      return recordsFound;
    } catch (error) {
      handleExceptions(error);
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.alliesAdvisor.delete({
        where: { id },
      });
      return {};
    } catch (error) {
      handleExceptions(error);
    }
  }
}
