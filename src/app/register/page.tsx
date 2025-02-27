
'use client';
import RegisterForm from "@/components/RegisterForm";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'authenticated') {
        router.push('/profile');
    }

    return (
        <main>
            <h1>Register Page</h1>
            <RegisterForm />
        </main>
    );
}

