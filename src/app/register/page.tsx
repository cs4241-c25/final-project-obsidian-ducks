
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
        <main>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full" style={{ maxWidth: '800px' }}>
                    <RegisterForm/>
                </div>
            </div>
        </main>
);
}

