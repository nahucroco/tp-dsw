import {
    Entity,
    Property,
    ManyToOne,
    Collection,
    OneToMany,
    Cascade,
    LoadStrategy,
    type Rel,
} from '@mikro-orm/core';
import { BusinessEntity } from './BusinessEntity.js';
import { Person } from './Person.js';
import { BookCopy } from './BookCopy.js';

@Entity()
export class Loan extends BusinessEntity {
    @Property()
    startDate!: Date;

    @Property()
    endDate!: Date;

    @ManyToOne(() => Person, { nullable: false })
    person!: Rel<Person>;

    @OneToMany(
        () => BookCopy,
        (copy) => copy.loan,
        {
            cascade: [Cascade.PERSIST, Cascade.REMOVE],
            orphanRemoval: true,
            strategy: LoadStrategy.SELECT_IN,
        },
    )
    bookCopies = new Collection<Rel<BookCopy>>(this);

    @Property({ persist: false })
    get isFull(): boolean {
        return this.bookCopies.length >= 3;
    }
}
