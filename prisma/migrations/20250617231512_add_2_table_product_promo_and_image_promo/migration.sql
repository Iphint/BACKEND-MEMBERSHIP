-- CreateTable
CREATE TABLE "ProductPromo" (
    "id" SERIAL NOT NULL,
    "product_name" TEXT NOT NULL,
    "price_normal" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "product_description" TEXT,
    "product_category" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductPromo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagePromo" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImagePromo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImagePromo" ADD CONSTRAINT "ImagePromo_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "ProductPromo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
