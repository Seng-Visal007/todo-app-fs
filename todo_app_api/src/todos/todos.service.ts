import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "./entities/todo.entity.js";
import { In, ILike, Repository } from "typeorm";
import { CreateTodoDto } from "./dto/create-todo.dto.js";
import { UpdateTodoDto } from "./dto/update-todo.dto.js";
import { BulkTodoStatusDto } from "./dto/bulk-todo-status.dto.js";

const TODO_STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) 
    private readonly repo: Repository<Todo>,
  ) {}
  findAll(status?: string, q?: string) {
    if (status && !TODO_STATUSES.includes(status)) {
      throw new BadRequestException(`status must be one of: ${TODO_STATUSES.join(", ")}`);
    }
    return this.repo.find({
      where: {
        ...(status ? { status } : {}),
        ...(q ? { title: ILike(`%${q}%`) } : {}),
      },
      order: { sortOrder: "ASC", id: "ASC" },
    });
  }
  async create(dto: CreateTodoDto) {
    const result = await this.repo
      .createQueryBuilder("todo")
      .select("MAX(todo.sortOrder)", "max")
      .getRawOne<{ max: number | null }>();
    const nextSortOrder = Number(result?.max ?? -1) + 1;
    return this.repo.save(this.repo.create({ ...dto, sortOrder: nextSortOrder }));
  }
  update(id: number, dto: UpdateTodoDto) {
    return this.repo.findOneBy({ id }).then(async (todo) => {
      if (!todo) throw new NotFoundException(`Todo ${id} was not found`);
      await this.repo.update(id, dto);
      return this.repo.findOneByOrFail({ id });
    });
  }
  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException(`Todo ${id} was not found`);
  }

  async bulkUpdateStatus(dto: BulkTodoStatusDto) {
    return this.repo.manager.transaction(async (manager) => {
      const result = await manager.getRepository(Todo).update(
        { id: In(dto.ids) },
        { status: dto.status },
      );
      if (result.affected !== dto.ids.length) {
        throw new NotFoundException("One or more todo IDs were not found");
      }
      return { updated: result.affected };
    });
  }

  updateOrder(ids: number[]) {
    return this.repo.manager.transaction(async (manager) => {
      const repo = manager.getRepository(Todo);
      const existing = await repo.find({ where: { id: In(ids) }, select: { id: true } });
      if (existing.length !== ids.length) {
        throw new NotFoundException("One or more todo IDs were not found");
      }
      for (const [sortOrder, id] of ids.entries()) {
        await repo.update(id, { sortOrder });
      }
      return { updated: ids.length };
    });
  }
}
