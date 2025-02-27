'use client';
import LoginForm from "@/components/LoginForm";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import HeroSectionLogin from "../login/HeroSectionLogin";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();


    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/profile');
        }
    }, [status, router]);

    return (
        <main className="relative">
            <HeroSectionLogin/>
            <div className="absolute inset-0 flex justify-center items-center ">
                <div className="w-full md:w-86 lg:w-86 ml-20">
                <LoginForm/>
                </div>
            </div>

        </main>
);
}