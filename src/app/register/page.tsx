
'use client';
import RegisterForm from "@/components/RegisterForm";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HeroSectionLogin from "../login/HeroSectionLogin";

export default function RegisterPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'authenticated') {
        router.push('/profile');
    }

    return (
        <main className="relative">
            <HeroSectionLogin/>

            <div className="absolute inset-0 flex justify-center items-center ">
                <div className="w-full md:w-86 lg:w-86 ml-20">
                    <RegisterForm/>
                </div>
            </div>
        </main>
);
}

