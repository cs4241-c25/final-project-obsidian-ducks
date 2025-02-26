'use client';
import LoginForm from "@/components/LoginForm";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import HeroSection from "../HeroSection";

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
            <HeroSection/>
            <div className="absolute inset-0 flex justify-center items-center ">
                <div className="w-full md:w-80 lg:w-90 mt-100">
                <LoginForm/>
                </div>
            </div>

        </main>
);
}