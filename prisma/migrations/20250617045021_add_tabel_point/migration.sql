-- CreateTable
CREATE TABLE "Point" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "point_balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
