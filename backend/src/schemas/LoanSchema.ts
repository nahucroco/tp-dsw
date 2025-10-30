import { z } from 'zod';

const LoanSchema = z.object({
    id: z.number().int(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    person: z.object({
        id: z.number().int().positive(),
    }),
    bookCopies: z
        .array(
            z.object({
                id: z.number().int().positive(),
            }),
        )
        .max(3, 'A loan cannot have more than 3 copies of books'),
});

export type LoanInput = z.infer<typeof LoanSchema>;
export { LoanSchema };
