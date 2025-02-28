'use client';

import Button from "@/components/Button";
import TextInput from "@/components/TextInput";

import { useSession, signIn } from 'next-auth/react';
import { postLogin } from '../app/actions/actions';
import { useRouter } from 'next/navigation';


export default function LoginForm() {
    const { update } = useSession();
    const router = useRouter();

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
                alert(signInResponse.error);
            } else {
                await update();
                console.log("Session updated after login");

                router.push('/profile');
            }
        } else {
            alert(result.error || "Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg border-2 border-crimson-500 shadow-md">
            <h1 className="text-3xl font-bold mb-6">Login</h1>
            <div className="flex flex-col space-y-4">
                <TextInput type="text" name="username" placeholder="Enter your school email" onChange={(e) => console.log(e.target.value)}>Username:</TextInput>
                <TextInput type="password" name="password" placeholder="Enter your password" onChange={(e) => console.log(e.target.value)}>Password:</TextInput>
                <a href="/register" className="text-crimson-500 hover:underline mb-0">Don't have an account?</a>
                <div className="w-full flex justify-end">
                    <Button type="submit">Login</Button>
                </div>


            </div>
        </form>
    );
}