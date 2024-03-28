import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import prismadb from '@/lib/prismadb';


import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';

import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { PrismaAdapter } from '@next-auth/prisma-adapter';

export default NextAuth ({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || ''
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    Credentials ({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',

        },
        password: {
          label: 'Password',
          type: 'password',
        }

      }, 
      async authorize(credentials) {
        if (!credentials ?.email || !credentials ?.password) {
          throw new Error ('Email and password required');
        }

        const user = await prismadb.user.findUnique({ //find user email
          where: {
            email: credentials.email
          }
        });

        // check if user exist
        if (!user || !user.hashedPassword){
          throw new Error('Email does not exist');
        }
        
        //compare is from bcrypt
        const isCorrectPassword = await compare(
          credentials.password, 
          user.hashedPassword
          );

        //if incorrect password

        if (!isCorrectPassword){
          throw new Error('Incorrect password');
        }

      return user;
      }
    })
  ],

  //this helps to see error in terminal
  pages: {
    signIn: '/auth',
  },
  debug: process.env.NODE_ENV === 'development', //helps w errors and logs
  adapter: PrismaAdapter(prismadb),
  session: {
    strategy: 'jwt', 

  },

  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,

  },
  secret: process.env.NEXTAUTH_SECRET,

})

