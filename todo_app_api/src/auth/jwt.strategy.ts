import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Role } from "../users/entities/user.entity.js";

interface JwtPayload {
    sub: string;
    role: Role;
}

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET must be set in the environment");
    }

    return secret;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: getJwtSecret(),
        });
    }

    validate(payload: JwtPayload): JwtPayload {
        return payload;
    }
}
