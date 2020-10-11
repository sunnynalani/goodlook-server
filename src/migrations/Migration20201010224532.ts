import { Migration } from '@mikro-orm/migrations';

export class Migration20201010224532 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "client" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "first_name" text not null);');
  }

}
