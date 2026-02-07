import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Currency {
  constructor(data: Currency) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryColumn()
  id?: string;

  @OneToMany(() => Product, (product) => product.currency)
  product?: Product[];

  @Column({ type: 'varchar', unique: true, default: '' })
  name?: string;

  @Column({ type: 'varchar', default: '' })
  symbol?: string;

  @Column({ type: 'varchar', unique: true, default: '' })
  code?: string;

  @Column({ type: 'varchar', default: '' })
  countryCode?: string;

  @Column({ type: 'varchar', default: '' })
  countryName?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;
}
