import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistRepository.create({
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    });
    return this.artistRepository.save(artist);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return this.artistRepository.save(artist);
  }

  async remove(id: string): Promise<void> {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    await this.artistRepository.remove(artist);
  }
}
