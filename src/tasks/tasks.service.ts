import { Injectable, NotFoundException } from '@nestjs/common';
import { Taskstatus } from './task-status.enum'; // תיקון שם הקובץ
import { CreateTaskDto } from './DTO/creat-task.dto'; // תיקון שם הקובץ
import { GetTasksFilterDto } from './DTO/get-taskas-filltter-Dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { ReturnDocument } from 'typeorm';
import { User } from 'src/auth/user-entity';


@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
         private taskRepository:TaskRepository
    )  {}


    getTask(filterDTO:GetTasksFilterDto,user:User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDTO,user);
    }
 

 async getTaskByid(id:string,user:User) : Promise<Task>
{
    const found = await this.taskRepository.findOne({ where: { id, user } });


   if(!found){
    throw new NotFoundException(`Task with ID ${id} not found`); // השתמש ב-{} כדי להכניס ערך

   }

   return found;
}


creatTask(createTaskDto:CreateTaskDto,user:User):Promise<Task>
{
    return this.taskRepository.createTask(createTaskDto,user);

}

  async deleteTask(id:string ,user:User) :Promise<void>{
    const result =await this.taskRepository.delete({id,user});
   
    if(result.affected === 0)
        {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
}


async updateTaskStatus(id:string, status:Taskstatus,user:User):Promise<Task>{
    const task =await this.getTaskByid(id,user);

    task.status = status;
    await this.taskRepository.save(task);

    return task;
}



}
    

  


