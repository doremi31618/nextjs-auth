'use client'
import Link from 'next/link';
import { buttonVariants, Button } from './ui/button';
import { HandMetal } from 'lucide-react';
import { signOut, useSession } from "next-auth/react"


const Navbar = () => {
  const { data: session } = useSession()

  return (
    <div className=' bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
      <div className='container flex items-center justify-between'>
        <Link href='/'>
          <HandMetal />
        </Link>
        {
          session?.user ? (
            <Button onClick={()=>signOut()} variant="destructive">
              Sign out
            </Button>
          ) : (
            <Link className={buttonVariants()} href='/sign-in'>
              Sign in
            </Link>)
        }
        
      </div>
    </div>
  );
};

export default Navbar;
