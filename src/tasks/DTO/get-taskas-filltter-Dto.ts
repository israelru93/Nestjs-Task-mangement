import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Taskstatus } from '../task-status.enum';

export class GetTasksFilterDto {
    @IsOptional()
    @IsEnum(Taskstatus)
  status?: Taskstatus;
  @IsOptional()
  @IsString()
  search?: string;
}
