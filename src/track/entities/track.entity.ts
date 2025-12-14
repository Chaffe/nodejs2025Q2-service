import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';

@Entity('track')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  duration: number;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;

  @Column({ type: 'uuid', nullable: true })
  albumId: string | null;

  @ManyToOne(() => Artist, (artist) => artist.tracks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @ManyToOne(() => Album, (album) => album.tracks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'albumId' })
  album: Album;
}
