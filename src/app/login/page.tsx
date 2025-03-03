'use client';
import LoginForm from "@/components/LoginForm";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from "next/image";

export default function LoginPage() {
    const {status } = useSession();
    const router = useRouter();


    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/profile');
        }
    }, [status, router]);

    return (
        <main className="relative flex justify-center items-center h-screen">
            <div className="absolute top-[38%] left-[18%] transform -translate-x-1/2 -translate-y-1/2 hidden xl:block">
                <Image src={"/WPIBuysLogo.png"} alt={"WPIBuys Logo"} width={240} height={272}/>
            </div>
            <div className="w-full max-w-2xl px-4" >
                <LoginForm />
            </div>

        </main>
);
}