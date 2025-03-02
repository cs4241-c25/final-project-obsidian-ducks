'use client';

import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { postLogin } from '@/lib/actions';
import { useRouter } from 'next/navigation';


export default function LoginForm() {
    const { update } = useSession();
    const router = useRouter();
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const result = await postLogin(formData);

        if (result.success) {
            const signInResponse = await signIn('credentials', {
                redirect: false,
                username: formData.get('username'),
                password: formData.get('password'),
            });

            if (signInResponse?.error) {
                setLoginError("Wrong username or password");
            } else {
                await update();
                console.log("Session updated after login");

                router.push('/profile');
            }
        } else {
            setLoginError("Wrong username or password.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 rounded-lg bg-alice-blue-200 shadow-md min-h-[400px] -mt-45">
            <h1 className="text-3xl font-bold mb-10">Login</h1>
            <div className="flex flex-col space-y-4">
                <TextInput type="text" name="username" placeholder="School email" onChange={(e) => console.log(e.target.value)}>Username:</TextInput>
                <TextInput type="password" name="password" placeholder="Password" onChange={(e) => console.log(e.target.value)}>Password:</TextInput>
                {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                <a href="/register" className="text-crimson-500 hover:underline mb-0">Don't have an account?</a>
                <div className="w-full flex justify-end">
                    <Button type="submit">Login</Button>
                </div>


            </div>
        </form>
    );
}