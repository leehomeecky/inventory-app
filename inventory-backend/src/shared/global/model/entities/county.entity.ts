import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { State } from './state.entity';

@Entity()
export class Country {
  constructor(data: Country) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryColumn()
  id?: string;

  @OneToMany(() => State, (state) => state.country)
  @JoinColumn()
  state?: State[];

  @Column({ type: 'varchar' })
  name?: string;

  @Column({ type: 'varchar' })
  shortName?: string;

  @Column({ type: 'varchar' })
  countryCode?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
