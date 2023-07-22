import { Injectable } from '@nestjs/common';
import { CreateConfigAllyDto } from './dto/create-config-ally.dto';
import { UpdateConfigAllyDto } from './dto/update-config-ally.dto';

@Injectable()
export class ConfigAllyService {
  create(createConfigAllyDto: CreateConfigAllyDto) {
    return 'This action adds a new configAlly';
  }

  findAll() {
    return `This action returns all configAlly`;
  }

  findOne(id: number) {
    return `This action returns a #${id} configAlly`;
  }

  update(id: number, updateConfigAllyDto: UpdateConfigAllyDto) {
    return `This action updates a #${id} configAlly`;
  }

}
