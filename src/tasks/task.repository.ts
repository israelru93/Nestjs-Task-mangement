import { EntityRepository, Repository } from "typeorm";
import { Task } from './task.entity';
import { CreateTaskDto } from './DTO/creat-task.dto';
import { Taskstatus } from './task-status.enum';
import { GetTasksFilterDto } from "./DTO/get-taskas-filltter-Dto";
import { User } from 'src/auth/user-entity';
import { InternalServerErrorException, Query } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { json } from "stream/consumers";

@EntityRepository(Task)

export class TaskRepository extends Repository<Task> {

  private logger = new Logger('TasksRepository');

  async getTasks(_filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    {

      const { status, search } = _filterDto; // תיקון שגיאת כתיב ב-`search`



      const query = this.createQueryBuilder('task');
      query.where({ user });



      if (status) {
        query.andWhere('task.status = :status', { status }); // אין צורך בהצבת 'OPEN', השתמש בפרמטר `status`
      }



      if (search) {
        query.andWhere(
          '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
          { search: `%${search}%` }, // וודא שהפרמטר `search` מוגדר נכון
        );
      }



      try {
        const tasks = await query.getMany();

        return tasks;
      }
      catch (error) {
        this.logger.error(`'failed to get tasks for USer  ' ${user.username} filter : ${JSON.stringify(_filterDto)}`,error.stack,
      )
        throw new InternalServerErrorException();
      };


    }
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {

    const { title, description } = createTaskDto;

    // יצירת המשימה החדשה עם המאפיינים שהוצאו
    const task = this.create({
      title,
      description,
      status: Taskstatus.OPEN,
      user,
    });


    await this.save(task);


    return task;


  }
}