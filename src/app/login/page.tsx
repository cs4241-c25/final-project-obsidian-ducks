'use client';
import LoginForm from "@/components/LoginForm";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'authenticated') {
        router.push('/profile');
    }

    return (
        <main>
            <h1>Login Page</h1>
            <LoginForm />
        </main>
    );
}