
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '@/lib/db';
import {compare, hash} from 'bcrypt';

const authOptions : AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    pages:{
        signIn: '/sign-in',
    },
    session: {
        strategy : 'jwt'
    },
    adapter : PrismaAdapter(prisma),
    providers : [
        CredentialsProvider({
            name : 'credentials',
            credentials : {
                email: { label: "Email", type: "email", placeholder: "enter email" },
                password: { label: "Password", type: "enter password" }
            }, 
            authorize : async (credentials) => {
                // console.log('here comes a user', credentials)
                //check credentials content
                if (!credentials?.email || !credentials?.password){
                return null;
                }

                //get user by prisma orm
                const user = await prisma.user.findFirst({
                    where:{
                        email: credentials?.email
                    }
                })
                if (!user){return null;}
                
                //check password 
                const passwordMatch = await compare(credentials.password, user.password)
                if (!passwordMatch){
                    return null
                }
                return {
                    id       : `${user.id}`,
                    name : user.username,
                    email    : user.email,
                };
            },
            
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
          // Persist the OAuth access_token to the token right after signin
          if (user){
            return {
                ...token,
                id:user.id,
                name : user.name
            }
          }
          return {
            // id:user?.id,
            // email:user?.email,
            ...token}
        },
        async session({ session, token }) {
          // Send properties to the client, like an access_token from a provider.
            return {
                ...session,
                user : {
                    id:token.id,
                    name : token.name
                }
            }
        }
    }
}

export default authOptions;