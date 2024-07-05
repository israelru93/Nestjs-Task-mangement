import { Entity, EntityRepository, Repository } from 'typeorm';
import { User } from './user-entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import *as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User>{
  async createUser(authcredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authcredentialsDto;

  const salt= await bcrypt.genSalt();
  const hashPassword= await bcrypt.hash(password,salt);

    const user = this.create ({username,password: hashPassword});

    try{
        await this.save(user);
    }
    catch(error)
    {
        if(error.code==='23505')
        {
            throw new ConflictException('Username allready exists');
        }
        else
        {
            throw new InternalServerErrorException()
        }
        console.log(error.code);
    }
    
    
}

}


