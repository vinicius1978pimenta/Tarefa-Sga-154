import { Module } from '@nestjs/common';
import { CrudController } from './crud.controller';
import { CrudService } from './crud.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [CrudController],
  providers: [CrudService],
  exports: [],
})
export class CrudModule {}
