import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity.js';
import { CreateProfileDto } from './dto/create-profile.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profiles: Repository<Profile>,
  ) {}

  create(createProfileDto: CreateProfileDto) {
    return this.profiles.save(this.profiles.create(createProfileDto));
  }

  findAll() {
    return this.profiles.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const profile = await this.profiles.findOneBy({ id });
    if (!profile) throw new NotFoundException(`Profile ${id} was not found`);
    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    await this.findOne(id);
    await this.profiles.update(id, updateProfileDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.profiles.delete(id);
    if (!result.affected) throw new NotFoundException(`Profile ${id} was not found`);
  }
}
