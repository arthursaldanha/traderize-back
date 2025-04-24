import { z } from 'zod';

const findJournalByIdSchema = z.object({
  id: z.string().uuid(),
});

type FindJournalByIdDTO = z.infer<typeof findJournalByIdSchema>;

export { findJournalByIdSchema, type FindJournalByIdDTO };
