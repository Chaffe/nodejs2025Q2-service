import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { AppService } from '../app.service';

@Injectable()
export class TrackService {
  constructor(private readonly db: AppService) {}

  findAll(): Track[] {
    return this.db.tracks;
  }

  findOne(id: string): Track {
    const track = this.db.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
      duration: createTrackDto.duration,
    };
    this.db.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const trackIndex = this.db.tracks.findIndex((t) => t.id === id);

    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    const updatedTrack: Track = {
      id: this.db.tracks[trackIndex].id,
      name: updateTrackDto.name,
      artistId: updateTrackDto.artistId ?? null,
      albumId: updateTrackDto.albumId ?? null,
      duration: updateTrackDto.duration,
    };

    this.db.tracks[trackIndex] = updatedTrack;
    return updatedTrack;
  }

  remove(id: string): void {
    const trackIndex = this.db.tracks.findIndex((t) => t.id === id);

    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    const favIndex = this.db.favorites.tracks.indexOf(id);
    if (favIndex !== -1) {
      this.db.favorites.tracks.splice(favIndex, 1);
    }

    this.db.tracks.splice(trackIndex, 1);
  }
}