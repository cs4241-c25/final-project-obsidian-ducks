
'use client';
import RegisterForm from "@/components/RegisterForm";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HeroSectionLogin from "../login/HeroSectionLogin";
import Image from "next/image";

export default function RegisterPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'authenticated') {
        router.push('/profile');
    }

    return (
        <main className="relative flex justify-center items-center h-screen">
            <div className="absolute top-[40%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 hidden lg:block">
                <Image src={"/wpibuysicon1.svg"} alt={"WPIBuys Logo"} width={240} height={272}/>
            </div>

            <div className="flex justify-center items-center">
                <RegisterForm/>
            </div>
        </main>


    );
}

