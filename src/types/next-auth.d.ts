import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface User {
    id:string;
    name: string | null;
    email:string;
  }
  interface Session {
    user: User 
    token: {
        username:string
    }
  }
}