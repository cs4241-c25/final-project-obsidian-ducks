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
        <main>
            <HeroSectionLogin/>
            <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ maxWidth: '800px' }}>
                <LoginForm />
                </div>
            </div>

        </main>
);
}