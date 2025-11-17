import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './entities/entities';
import { CreateCrudDto } from './dto/create-crud.dto';
import { UpdateCrudDto } from './dto/update-crud.dto';

@Injectable()
export class CrudService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createCrudDto: CreateCrudDto) {
    const task = this.taskRepository.create({
      title: createCrudDto.title,
      completed: createCrudDto.completed,
      category: createCrudDto.category,
      dueDate: createCrudDto.dueDate,
    });
    const save = await this.taskRepository.save(task);
    return {
      id: save.id,
      title: save.title,
      completed: save.completed,
      category: save.category,
      dueDate: save.dueDate,
    };
  }

  async findAll() {
    return await this.taskRepository.find();
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    return task;
  }

  async update(id: number, updateCrudDto: UpdateCrudDto) {
    const task = await this.findOne(id);
    const updated = Object.assign(task, updateCrudDto);
    const save =  await this.taskRepository.save(updated);

    return {
      id: save.id,
      title: save.title,
      completed: save.completed,
      category: save.category,
      dueDate: save.dueDate,
    };
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }
    await this.taskRepository.remove(task);
    return { message: `Tarefa ${id} removida com sucesso` };
  }
}
