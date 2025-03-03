'use client';
import LoginForm from "@/components/LoginForm";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from "next/image";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();


    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/profile');
        }
    }, [status, router]);

    return (
        <main className="relative min-h-screen">
            <section className="absolute inset-0 z-0 mt-4">
                <img className="w-full h-full object-cover blur-md" src="/wpibackground.png" alt="WPI's campus"/>
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </section>
            <div className="relative z-10 flex justify-center items-center min-h-screen">
                <div className="w-full max-w-2xl px-4">
                    <LoginForm/>
                </div>
            </div>

        </main>
);
}