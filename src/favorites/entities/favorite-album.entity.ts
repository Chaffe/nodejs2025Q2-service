import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Album } from '../../album/entities/album.entity';

@Entity('favorite_album')
export class FavoriteAlbum {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  albumId: string;

  @ManyToOne(() => Album, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'albumId' })
  album: Album;
}
