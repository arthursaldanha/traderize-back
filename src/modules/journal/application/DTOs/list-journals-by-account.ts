import { z } from 'zod';

const listJournalsByAccountSchema = z.object({
  accountId: z.string().uuid(),
});

type ListJournalsByAccountDTO = z.infer<typeof listJournalsByAccountSchema>;

export { listJournalsByAccountSchema, type ListJournalsByAccountDTO };
