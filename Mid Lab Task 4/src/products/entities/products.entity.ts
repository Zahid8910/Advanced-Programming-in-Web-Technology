
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number): number => value,
      from: (value: string | number): number => {
        const price = Number(value);

        if (!Number.isFinite(price)) {
          throw new TypeError('Product price must be a finite number');
        }

        return price;
      },
    },
  })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column()
  category: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
