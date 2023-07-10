import { Module } from '@nestjs/common';
import { ExampleProviderService } from './example-provider/services/example-provider.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [],
  providers: [ExampleProviderService],
  exports: [ExampleProviderService],
})
export class AdapterModule {}
