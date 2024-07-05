

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Taskstatus } from './task-status.enum'; // כאן נראה שתיקנתי את שם המודול Taskstatus
import { CreateTaskDto } from './DTO/creat-task.dto';
import { GetTasksFilterDto } from './DTO/get-taskas-filltter-Dto';
import { UpdateTaskStatus } from './DTO/Update-Task-Status-Dto';
import { Task } from './task.entity';
import { promises } from 'dns';
import { ReturnDocument } from 'typeorm';
import { query } from 'express';
import { filter } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user-entity';
import { GetUser } from 'src/auth/get-user.decoritor';
import { Logger } from '@nestjs/common';
import { json } from 'stream/consumers';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger=  new Logger(`"TasksControllers"`);
  constructor(private taskService: TasksService) {}
  


  // @Get()
  // getTask(@Query() filterDto: GetTasksFilterDto, @GetUser()user:User): Promise<Task[]> {

  //   this.logger.verbose(`User"${user.username}"retrieving all tasks, filters: ${JSON.stringify(filterDto,)}`)
  //   return this.taskService.getTask(filterDto,user);
  // }
  
  @Get()
async getTask(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
  this.logger.verbose(`User "${user.username}" retrieving all tasks, filters: ${JSON.stringify(filterDto)}`);
  return this.taskService.getTask(filterDto, user);
}


  @Get('/:id')
  getTaskByid(@Param('id') id:string,  @GetUser()user:User) :Promise<Task>{

    return this.taskService.getTaskByid(id,user);
  }


  @Post()

  createTask(@Body() CreateTaskDto:CreateTaskDto,
  @GetUser()user:User,
):Promise<Task>{

  this.logger.verbose(`User "${user.username}" creating a new task,Data : ${JSON.stringify(CreateTaskDto)} `);
  return this.taskService.creatTask(CreateTaskDto,user);
  }

   @Delete('/:id')
   deleteTask(@Param('id') id: string,  @GetUser()user:User):  Promise<void> {
     return  this.taskService.deleteTask(id,user);
}

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatus: UpdateTaskStatus,
    @GetUser()user:User,
  ):Promise<Task> {
    const { status } = updateTaskStatus;
    return this.taskService.updateTaskStatus(id, status,user);

 
  }
 
}