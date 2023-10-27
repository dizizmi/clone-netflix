import { PrismaClient } from '@prisma/client';

const client = global.prismadb || new PrismaClient();
/** below is when too many prisma client running thus save prisma in global file, not affected by reloading   */
if (process.env.NODE_ENV === 'production') global.prismadb = client;

export default client;