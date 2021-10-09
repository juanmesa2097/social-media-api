-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT E'ACTIVE',
    "role" "Role" NOT NULL DEFAULT E'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(40) NOT NULL,
    "last_name" VARCHAR(40),
    "bio" VARCHAR(300) DEFAULT E'I\'m a mysterious individual who has not yet fill out my bio.',
    "date_of_birth" TIMESTAMP(3),
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(45) NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "author_id" TEXT NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "post_id" INTEGER,
    "user_id" TEXT,

    CONSTRAINT "post_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_reaction" (
    "id" SERIAL NOT NULL,
    "reaction" "ReactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "post_id" INTEGER,
    "user_id" TEXT,

    CONSTRAINT "post_reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_tag" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "post_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profile_user_id_key" ON "profile"("user_id");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reaction" ADD CONSTRAINT "post_reaction_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reaction" ADD CONSTRAINT "post_reaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tag" ADD CONSTRAINT "post_tag_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tag" ADD CONSTRAINT "post_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
