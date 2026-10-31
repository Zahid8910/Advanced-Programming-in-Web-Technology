import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto.js';
import { PartialUpdateProductDto } from './dto/partial-update-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Products } from './entities/products.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepo: Repository<Products>,
  ) {}

  async create(
    dto: CreateProductDto,
  ): Promise<{ message: string; data: Products }> {
    const product = this.productsRepo.create(dto);
    const savedProduct = await this.productsRepo.save(product);

    return { message: 'Product created successfully', data: savedProduct };
  }

  async findAll(): Promise<{
    message: string;
    count: number;
    data: Products[];
  }> {
    const products = await this.productsRepo.find({
      order: { createdAt: 'DESC' },
    });

    return {
      message: 'Products retrieved successfully',
      count: products.length,
      data: products,
    };
  }

  async findOne(id: number): Promise<{ message: string; data: Products }> {
    const product = await this.findProductOrThrow(id);

    return { message: 'Product retrieved successfully', data: product };
  }

  async update(
    id: number,
    dto: PartialUpdateProductDto,
  ): Promise<{ message: string; data: Products }> {
    const product = await this.findProductOrThrow(id);
    Object.assign(product, dto);
    const updatedProduct = await this.productsRepo.save(product);

    return { message: 'Product updated successfully', data: updatedProduct };
  }

  async replace(
    id: number,
    dto: UpdateProductDto,
  ): Promise<{ message: string; data: Products }> {
    await this.findProductOrThrow(id);

    const replacement = this.productsRepo.create({
      id,
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      stock: dto.stock ?? 0,
      category: dto.category,
      isActive: dto.isActive ?? true,
    });
    const replacedProduct = await this.productsRepo.save(replacement);

    return { message: 'Product replaced successfully', data: replacedProduct };
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    await this.findProductOrThrow(id);
    await this.productsRepo.delete(id);

    return { message: 'Product deleted successfully', id };
  }

  async findByCategory(category: string): Promise<{
    message: string;
    count: number;
    data: Products[];
  }> {
    const products = await this.productsRepo.find({
      where: { category },
    });

    return {
      message: 'Products retrieved successfully',
      count: products.length,
      data: products,
    };
  }

  async search(keyword: string): Promise<{
    message: string;
    count: number;
    data: Products[];
  }> {
    const products = await this.productsRepo.find({
      where: { name: ILike(`%${keyword}%`) },
    });

    return {
      message: 'Product search completed successfully',
      count: products.length,
      data: products,
    };
  }

  async toggleActive(
    id: number,
  ): Promise<{ message: string; data: Products }> {
    const product = await this.findProductOrThrow(id);
    product.isActive = !product.isActive;
    const savedProduct = await this.productsRepo.save(product);

    return {
      message: 'Product status toggled successfully',
      data: savedProduct,
    };
  }

  private async findProductOrThrow(id: number): Promise<Products> {
    const product = await this.productsRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }
}
