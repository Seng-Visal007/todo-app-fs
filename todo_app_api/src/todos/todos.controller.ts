import { Body, Controller, Delete, Get, HttpCode, Param,
ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { TodosService } from "./todos.service.js";
import { CreateTodoDto } from "./dto/create-todo.dto.js";
import { UpdateTodoDto } from "./dto/update-todo.dto.js";
import { BulkTodoStatusDto } from "./dto/bulk-todo-status.dto.js";
import { TodoOrderDto } from "./dto/todo-order.dto.js";

@Controller("todos")
export class TodosController {
  constructor(private readonly todos: TodosService) {}
  
  @Get()
  findAll(@Query('status') status?: string, @Query('q') q?: string) {
    return this.todos.findAll(status, q);
  }
  
  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todos.create(dto); // 201 by default
  }

  @Patch("bulk")
  bulkUpdate(@Body() dto: BulkTodoStatusDto) {
    return this.todos.bulkUpdateStatus(dto);
  }

  @Patch("order")
  updateOrder(@Body() dto: TodoOrderDto) {
    return this.todos.updateOrder(dto.ids);
  }
  
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateTodoDto) {
    return this.todos.update(id, dto);
  }
  
  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.todos.remove(id);
  }
}
