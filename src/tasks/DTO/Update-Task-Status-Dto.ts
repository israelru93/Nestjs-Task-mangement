import { IsEnum } from 'class-validator';
import { Taskstatus } from '../task-status.enum';

export class UpdateTaskStatus{
  @IsEnum(Taskstatus)
  status: Taskstatus;
     
}