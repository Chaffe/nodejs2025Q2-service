import { IsString, IsNotEmpty, IsInt, IsOptional, IsUUID } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsOptional()
  @IsUUID()
  artistId?: string | null;
}