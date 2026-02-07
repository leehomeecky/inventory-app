import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Country } from './county.entity';

@Entity()
export class State {
  constructor(data: State) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Country, (country) => country.state)
  @JoinColumn()
  country?: Country;

  @Column({ type: 'varchar' })
  name?: string;

  @Column({ type: 'varchar' })
  shortName?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
