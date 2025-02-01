import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as dotenv from 'dotenv';
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";


dotenv.config();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){    
    constructor(
        private userService: UserService,
    ){
        //[3] Cookie에 있는 JWT 토큰 추출
        super({
            secretOrKey:process.env.JWT_SECRET, // 검증하기 위한 Secret Key
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
    } // [4] Secret Key 로 검증 - 해당 인스턴스가 생성되는 시점 자체가 검증과정
    
    //[5] JWT에서 사용자 정보 가져오기
    async validate(payload){
        const { email } = payload;

        const user: User = await this.userService.findUserByEmail(email);
        
        if(!user){
            throw new UnauthorizedException();
        }
        return user;
    }


}