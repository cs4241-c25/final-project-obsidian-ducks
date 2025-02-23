'use client';

import Button from "@/components/inputs/Button";
import TextInput from "@/components/inputs/TextInput";

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
        <form onSubmit={handleSubmit}>
            <h1>Login:</h1>
            <TextInput type="text" name="username" placeholder="Enter your username">Username</TextInput>
            <TextInput type="password" name="password" placeholder="Enter your password">Password</TextInput>
            <Button type="submit">Login</Button>
        </form>
    );
}