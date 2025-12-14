import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1701900000000 implements MigrationInterface {
  name = 'InitialMigration1701900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create User table
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "login" character varying NOT NULL,
        "password" character varying NOT NULL,
        "version" integer NOT NULL DEFAULT 1,
        "createdAt" bigint NOT NULL,
        "updatedAt" bigint NOT NULL,
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )
    `);

    // Create Artist table
    await queryRunner.query(`
      CREATE TABLE "artist" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "grammy" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_artist_id" PRIMARY KEY ("id")
      )
    `);

    // Create Album table
    await queryRunner.query(`
      CREATE TABLE "album" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "year" integer NOT NULL,
        "artistId" uuid,
        CONSTRAINT "PK_album_id" PRIMARY KEY ("id")
      )
    `);

    // Create Track table
    await queryRunner.query(`
      CREATE TABLE "track" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "duration" integer NOT NULL,
        "artistId" uuid,
        "albumId" uuid,
        CONSTRAINT "PK_track_id" PRIMARY KEY ("id")
      )
    `);

    // Create FavoriteArtist table
    await queryRunner.query(`
      CREATE TABLE "favorite_artist" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "artistId" uuid NOT NULL,
        CONSTRAINT "PK_favorite_artist_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_favorite_artist_artistId" UNIQUE ("artistId")
      )
    `);

    // Create FavoriteAlbum table
    await queryRunner.query(`
      CREATE TABLE "favorite_album" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "albumId" uuid NOT NULL,
        CONSTRAINT "PK_favorite_album_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_favorite_album_albumId" UNIQUE ("albumId")
      )
    `);

    // Create FavoriteTrack table
    await queryRunner.query(`
      CREATE TABLE "favorite_track" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "trackId" uuid NOT NULL,
        CONSTRAINT "PK_favorite_track_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_favorite_track_trackId" UNIQUE ("trackId")
      )
    `);

    // Enable uuid-ossp extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "album"
      ADD CONSTRAINT "FK_album_artistId"
      FOREIGN KEY ("artistId") REFERENCES "artist"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "track"
      ADD CONSTRAINT "FK_track_artistId"
      FOREIGN KEY ("artistId") REFERENCES "artist"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "track"
      ADD CONSTRAINT "FK_track_albumId"
      FOREIGN KEY ("albumId") REFERENCES "album"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "favorite_artist"
      ADD CONSTRAINT "FK_favorite_artist_artistId"
      FOREIGN KEY ("artistId") REFERENCES "artist"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "favorite_album"
      ADD CONSTRAINT "FK_favorite_album_albumId"
      FOREIGN KEY ("albumId") REFERENCES "album"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "favorite_track"
      ADD CONSTRAINT "FK_favorite_track_trackId"
      FOREIGN KEY ("trackId") REFERENCES "track"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "favorite_track" DROP CONSTRAINT "FK_favorite_track_trackId"`);
    await queryRunner.query(`ALTER TABLE "favorite_album" DROP CONSTRAINT "FK_favorite_album_albumId"`);
    await queryRunner.query(`ALTER TABLE "favorite_artist" DROP CONSTRAINT "FK_favorite_artist_artistId"`);
    await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_track_albumId"`);
    await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_track_artistId"`);
    await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_album_artistId"`);
    await queryRunner.query(`DROP TABLE "favorite_track"`);
    await queryRunner.query(`DROP TABLE "favorite_album"`);
    await queryRunner.query(`DROP TABLE "favorite_artist"`);
    await queryRunner.query(`DROP TABLE "track"`);
    await queryRunner.query(`DROP TABLE "album"`);
    await queryRunner.query(`DROP TABLE "artist"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}