/* class Book {
  code: number;
  name: string;
  author: string;
  gender: string;
  is_available: boolean;
  constructor(
    code: number,
    name: string,
    author: string,
    gender: string,
    is_available: boolean,
  ) {
    this.code = code;
    this.name = name;
    this.author = author;
    this.gender = gender;
    this.is_available = is_available;
  }
}
export { Book }; */

/// Version para MikroORM (agregado de decoradores)

import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
class Book {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  code!: number;

  @Property()
  name!: string;

  @Property()
  author!: string;

  @Property()
  gender!: string;

  @Property()
  is_available!: boolean;

  constructor(
    code: number,
    name: string,
    author: string,
    gender: string,
    is_available: boolean,
  ) {
    this.code = code;
    this.name = name;
    this.author = author;
    this.gender = gender;
    this.is_available = is_available;
  }
}
export { Book };
