import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloed } from './jwt-payloed.interface';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserRepository)
        private usersRepository:UserRepository,
        private jwtService:JwtService,
    ){}


    async signUp(authcredentialsDto:AuthCredentialsDto):Promise<void>{
        return this.usersRepository.createUser(authcredentialsDto);
    }

    async signIn(authcredentialsDto:AuthCredentialsDto):Promise<{accsesToken:string}>
    {
        const {username,password} =authcredentialsDto;
        const user = await this.usersRepository.findOne({ where: { username } });


        if(user && (bcrypt.compare(password,user.password))){
          const payloed:JwtPayloed= {username};
          const accsesToken:string = await this.jwtService.sign(payloed);
          return {accsesToken};
        }
        else
        throw new UnauthorizedException('plasse check tour login ');
    }
}
