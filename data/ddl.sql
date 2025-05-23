CREATE DATABASE h2shop;
USE h2shop;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
                         `id`           INT NOT NULL AUTO_INCREMENT,
                         `full_name`    VARCHAR(100),
                         `phone`        VARCHAR(20),
                         `gender`        enum ('male','female','other') NOT NULL DEFAULT 'other',
                         `role`          ENUM ('admin','user'),
                         `avatar`        JSON DEFAULT NULL,
                         `address`      TEXT,
                         `status`        INT                                     DEFAULT 1,
                         `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         PRIMARY KEY (`id`),
                         KEY `status` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `user_permission`;
CREATE TABLE `user_permission` (
                                   `id` int NOT NULL  AUTO_INCREMENT,
                                   `user_id` int NOT NULL,
                                   `role`          ENUM ('admin','user'),
                                   `status`     INT                                DEFAULT 1,
                                   `created_at` datetime                           DEFAULT CURRENT_TIMESTAMP,
                                   `updated_at` datetime                           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                   PRIMARY KEY (`id`),
                                   UNIQUE KEY `user_id` (`user_id`)  USING BTREE
)ENGINE = InnoDB
 DEFAULT CHARSET = utf8mb4
 COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `auths`;
CREATE TABLE `auths`
(
    `id`         int                                NOT NULL AUTO_INCREMENT,
    `user_id`    int                                NOT NULL,
    `email`      varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `salt`       varchar(50) CHARACTER SET utf8mb4  DEFAULT NULL,
    `password`   varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
    `status`     INT                                DEFAULT 1,
    `created_at` datetime                           DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime                           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`) USING BTREE,
    KEY `user_id` (`user_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
                              `id`            INT NOT NULL AUTO_INCREMENT,
                              `name`          VARCHAR(100) NOT NULL UNIQUE,
                              `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              `updated_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                              PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `categories`
    ADD COLUMN `image` JSON DEFAULT NULL AFTER `name`;


DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
                            `id`            INT NOT NULL AUTO_INCREMENT,
                            `name`          VARCHAR(200) NOT NULL,
                            `description`   TEXT,
                            `category_id`   INT NOT NULL,
                            `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            `updated_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            PRIMARY KEY (`id`),
                            KEY `category_id` (`category_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `products`
    ADD COLUMN `images` JSON DEFAULT NULL AFTER `description`;

DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants` (
                                    `id`             INT NOT NULL AUTO_INCREMENT,
                                    `product_id`     INT NOT NULL,
                                    `sku`            VARCHAR(50) NOT NULL UNIQUE,
                                    `color`          VARCHAR(50),
                                    `size`           VARCHAR(20),
                                    `price`          DECIMAL(10,2) NOT NULL,
                                    `stock_quantity` INT NOT NULL DEFAULT 0,
                                    `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    `updated_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                    PRIMARY KEY (`id`),
                                    KEY `product_id` (`product_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `product_variants`
    ADD COLUMN `image` JSON DEFAULT NULL AFTER `size`;

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
                          `id`           INT NOT NULL AUTO_INCREMENT,
                          `user_id`      INT NOT NULL,
                          `total_price`  DECIMAL(10,2) NOT NULL,
                          `status`       ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
                          `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          PRIMARY KEY (`id`),
                          KEY `user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `order_details`;
CREATE TABLE `order_details` (
                                 `id`           INT NOT NULL AUTO_INCREMENT,
                                 `order_id`     INT NOT NULL,
                                 `variant_id`   INT NOT NULL,
                                 `quantity`     INT NOT NULL,
                                 `price`        DECIMAL(10,2) NOT NULL,
                                 `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 PRIMARY KEY (`id`),
                                 KEY `order_id` (`order_id`) USING BTREE,
                                 KEY `variant_id` (`variant_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
                        `id`           INT NOT NULL AUTO_INCREMENT,
                        `user_id`      INT NOT NULL,
                        `variant_id`   INT NOT NULL,
                        `quantity`     INT NOT NULL,
                        `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        PRIMARY KEY (`id`),
                        KEY `user_id` (`user_id`) USING BTREE,
                        KEY `variant_id` (`variant_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
                            `id`             INT NOT NULL AUTO_INCREMENT,
                            `order_id`       INT NOT NULL,
                            `user_id`        INT NOT NULL,
                            `amount`         DECIMAL(10,2) NOT NULL,
                            `payment_method` ENUM('Credit Card', 'Bank Transfer', 'Cash on Delivery') NOT NULL,
                            `status`         ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
                            `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            `updated_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            PRIMARY KEY (`id`),
                            KEY `order_id` (`order_id`) USING BTREE,
                            KEY `user_id` (`user_id`) USING BTREE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
                           `id`          INT NOT NULL AUTO_INCREMENT,
                           `user_id`     INT NOT NULL,
                           `product_id`  INT NOT NULL,
                           `rating`      INT NOT NULL,
                           `comment`     TEXT,
                           `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           PRIMARY KEY (`id`),
                           KEY `user_id` (`user_id`) USING BTREE,
                            KEY `product_id` (`product_id`) USING BTREE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
                           `id`           INT NOT NULL AUTO_INCREMENT,
                           `report_type`  ENUM('Sales', 'Users', 'Products', 'Orders') NOT NULL,
                           `generated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           `data`         JSON NOT NULL,
                           `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
