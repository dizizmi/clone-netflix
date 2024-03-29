import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';

import prismadb from '@/lib/prismadb';

const serverAuth = async (req: NextApiRequest) => {
    const session = await getSession ({ req });

    // get fields of model user bcuz session doesnt have
    if (!session?.user?.email) { //if doesnt exist
        throw new Error('Not signed in');

    }

    const currentUser = await prismadb.user.findUnique({ 
        where: {
            email: session.user.email,
        }

    });

    if (!currentUser) {
        throw new Error('Not signed in');

    }

    return { currentUser };

};

export default serverAuth;

