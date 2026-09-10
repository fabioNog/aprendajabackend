import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Index()
  name: string;

  @Column({ length: 100 })
  @Index()
  email: string;

  @Column({ length: 20, nullable: true })
  whatsapp: string;

  @Column({ length: 50 })
  @Index()
  interestArea: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isProcessed: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
