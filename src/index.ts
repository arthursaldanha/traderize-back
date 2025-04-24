import { env } from '@/libs/envs';
import { createServer } from '@/server';

const server = createServer();

server.listen(env.PORT, () => {
  console.log(`Server is running on ${env.PORT}`);
});
