import { HttpService } from '@nestjs/axios';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NotFoundException } from '@src/shared/exceptions/not_found.exception';
import { catchError, firstValueFrom } from 'rxjs';
import config from 'src/config/config';
import { GenericResponse } from 'src/shared/models/generic-response.model';

@Injectable()
export class ExampleProviderService {
  private readonly logger: Logger = new Logger(ExampleProviderService.name);
  constructor(
    private readonly httpService: HttpService,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}
  async getDataFromProvider(): Promise<GenericResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<GenericResponse>(this.configService.exampleProviderGetService)
        .pipe(
          catchError(() => {
            throw new NotFoundException({
              details: 'No se encontro ningún registro del usuario',
              error: 'No se encontro registro del usuario',
              status: HttpStatus.NOT_FOUND,
              title: 'El usuario no se encuentra afiliado',
            })
          })
    ));
    return data;
  }
}
