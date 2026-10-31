
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module.js';

const dbPassword = process.env.DB_PASSWORD;

if (!dbPassword) {
  throw new Error('Missing required environment variable: DB_PASSWORD');
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: dbPassword,
      database: 'product_inventory_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
  ],
})
export class AppModule {}
