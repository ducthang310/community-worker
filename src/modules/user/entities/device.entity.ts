import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'devices' })
export class Device {
  @PrimaryColumn('varchar')
  userId: string;

  @Column()
  deviceToken: string;
}
