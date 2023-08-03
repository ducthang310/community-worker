import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_groups' })
export class UserGroup {
  @PrimaryColumn('varchar')
  userId: string;

  @Column()
  groupId: string;
}
