import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from '../users/entities/user.entity.js';
import { SignupDto } from './dto/signup.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const email = dto.email.trim().toLowerCase();
    
    if (await this.usersRepository.existsBy({ email })) {
      throw new ConflictException('Email taken');
    }

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.usersRepository.save({ email, passwordHash });
    
    return { id: user.id, email: user.email };
  }

  async validateUser(email: string, pw: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, role: true, passwordHash: true },
    });

    const ok = user && (await argon2.verify(user.passwordHash, pw));
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
