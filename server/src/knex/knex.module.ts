import { Global, Module } from '@nestjs/common';
import knex from 'knex';
import knexConfig from '../../knexfile';

@Global()
@Module({
  providers: [
    {
      provide: 'KnexConnection',
      useValue: knex(knexConfig.development),
    },
  ],
  exports: ['KnexConnection'],
})
export class KnexModule {}
