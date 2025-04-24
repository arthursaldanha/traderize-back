import { z } from 'zod';
import { config } from 'dotenv';

config();

const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3001),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatória'),
  JWT_SECRET_EXPIRES: z.coerce.number().optional().default(604800),
  APP_DEBUG: z
    .string()
    .optional()
    .default('false')
    .transform((value) => value === 'true'),
});

const envsParsed = envSchema.safeParse(process.env);

if (!envsParsed.success) {
  console.error(
    'Erro na validação das variáveis de ambiente:',
    envsParsed.error.format(),
  );
  process.exit(1);
}

export const env = envsParsed.data;
