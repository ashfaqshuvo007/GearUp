CREATE TABLE "users"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) CHECK
        ("status" IN('ACTIVE', 'SUSPENDED')) NOT NULL DEFAULT 'ACTIVE',
        "role" VARCHAR(255)
    CHECK
        (
            "role" IN('USER', 'ADMIN', 'PROVIDER')
        ) NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
CREATE TABLE "categories"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "categories" ADD PRIMARY KEY("id");
ALTER TABLE
    "categories" ADD CONSTRAINT "categories_name_unique" UNIQUE("name");
CREATE TABLE "gearItems"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(8, 2) NOT NULL,
    "providerId" UUID NOT NULL,
    "categoryName" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) CHECK
        (
            "status" IN('AVAILABLE', 'OUT OF STOCK', 'DRAFT')
        ) NOT NULL DEFAULT 'AVAILABLE',
        "brand" VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "gearItems" ADD PRIMARY KEY("id");
CREATE TABLE "RentalOrders"(
    "id" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "total" DECIMAL(8, 2) NOT NULL,
    "status" VARCHAR(255) CHECK
        (
            "status" IN(
                'PENDING',
                'CONFIRMED',
                'PICKED UP',
                'RETURNED',
                'CANCELED'
            )
        ) NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "RentalOrders" ADD PRIMARY KEY("id");
CREATE TABLE "orderItems"(
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "price" DECIMAL(8, 2) NOT NULL,
    "orderQty" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "orderItems" ADD PRIMARY KEY("id");
CREATE TABLE "reviews"(
    "id" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "reviews" ADD PRIMARY KEY("id");
CREATE TABLE "payments"(
    "transactionId" UUID NOT NULL,
    "rentalOrderId" UUID NOT NULL,
    "amount" DECIMAL(8, 2) NOT NULL,
    "method" VARCHAR(255) NOT NULL,
    "provider" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) CHECK
        (
            "status" IN('COMPLETED', 'PENDING', 'FAILED')
        ) NOT NULL DEFAULT 'PENDING',
        "paidAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "payments" ADD PRIMARY KEY("transactionId");
ALTER TABLE
    "RentalOrders" ADD CONSTRAINT "rentalorders_customerid_foreign" FOREIGN KEY("customerId") REFERENCES "users"("id");
ALTER TABLE
    "orderItems" ADD CONSTRAINT "orderitems_itemid_foreign" FOREIGN KEY("itemId") REFERENCES "gearItems"("id");
ALTER TABLE
    "reviews" ADD CONSTRAINT "reviews_customerid_foreign" FOREIGN KEY("customerId") REFERENCES "users"("id");
ALTER TABLE
    "orderItems" ADD CONSTRAINT "orderitems_orderid_foreign" FOREIGN KEY("orderId") REFERENCES "RentalOrders"("id");
ALTER TABLE
    "reviews" ADD CONSTRAINT "reviews_itemid_foreign" FOREIGN KEY("itemId") REFERENCES "gearItems"("id");
ALTER TABLE
    "payments" ADD CONSTRAINT "payments_rentalorderid_foreign" FOREIGN KEY("rentalOrderId") REFERENCES "RentalOrders"("id");
ALTER TABLE
    "gearItems" ADD CONSTRAINT "gearitems_providerid_foreign" FOREIGN KEY("providerId") REFERENCES "users"("id");
ALTER TABLE
    "gearItems" ADD CONSTRAINT "gearitems_categoryname_foreign" FOREIGN KEY("categoryName") REFERENCES "categories"("name");