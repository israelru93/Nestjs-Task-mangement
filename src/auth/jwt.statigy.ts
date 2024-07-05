import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "./users.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayloed } from "./jwt-payloed.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    constructor(
        @InjectRepository(UserRepository)
        private userRepository:UserRepository,
        private configService:ConfigService,
    )
    {
        super({
     secretOrKey:configService.get('JWT_SECRET'),
     jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),



        });
    }

    async validate(payloed:JwtPayloed)
    {
        const {username} =payloed;
        const user = await this.userRepository.findOne({ where: { username }});


        if(!user)
            {
                throw  new UnauthorizedException();
            }
            return user ;
    }
}