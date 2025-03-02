
'use client';
import RegisterForm from "@/components/RegisterForm";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function RegisterPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'authenticated') {
        router.push('/profile');
    }

    return (
        <main className="relative flex justify-center items-center h-screen mt-30">
            <div className="absolute top-[30%] left-[18%] transform -translate-x-1/2 -translate-y-1/2 hidden xl:block">
                <Image src={"/WPIBuysLogo.png"} alt={"WPIBuys Logo"} width={240} height={272}/>
            </div>

            <div className="w-full max-w-2xl px-4">
                <RegisterForm/>
            </div>
        </main>


    );
}

