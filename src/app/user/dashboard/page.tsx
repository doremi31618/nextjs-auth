'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";

export default function Dashboard(){
    const { data: session } = useSession()
    const router = useRouter();
    if (!session?.user){
        router.push('/')
        return <div>permission error</div>;
    }
    console.log('session data', session);
    return <div>this is {session?.user.name}'s dashboard space</div>
}
