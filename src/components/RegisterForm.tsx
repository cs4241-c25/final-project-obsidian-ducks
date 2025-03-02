'use client';
import { postRegister } from '@/lib/actions'
import React, { useState , useRef} from 'react';
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { useRouter } from 'next/navigation';
import FileDropzoneRegister from "../app/register/fileDropzoneRegister";

export default function RegisterForm({ error }: { error?: string }) {
    const router = useRouter();
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        const profileImage = formData.get("profileImage") as File;
        setPasswordError(null);
        setEmailError(null);

        if (!password) {
            setPasswordError("Password is required!");
            return;
        }

        if (!username.endsWith(".edu")) {
            setEmailError("Only .edu emails are allowed.");
            return;
        }

        const result = await postRegister(formData);
        if (result.error) {
            setEmailError("Email already exists.");
        } else{
            if (formRef.current) {
                formRef.current.reset();
            }
            router.push('/login');
        }
    };
    return (

        // @ts-ignore
        <form ref={formRef} onSubmit={handleSubmit}
              className="max-w-md mx-auto p-8 rounded-lg bg-alice-blue-200 shadow-md min-h-[400px] -mt-45">
            <h1 className="text-3xl font-bold mb-10">Register</h1>
            <div className="flex flex-col space-y-4">
                <TextInput type="text" name="username" placeholder="School email"
                           onChange={(e) => console.log(e.target.value)}>Username:</TextInput>
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                <TextInput type="password" name="password" placeholder="Choose a password"
                           onChange={(e) => console.log(e.target.value)}>Password:</TextInput>
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Profile Picture:</label>
                    <FileDropzoneRegister className="w-65 h-45 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50" name="profileImage"/>
                </div>

                <a href="/login" className="text-crimson-500 hover:underline mb-0">Already have an account?</a>
                <div className="w-full flex justify-end">
                    <Button type="submit">Register</Button>
                </div>
            </div>

            {
                error && <p>User already exists.</p>
            }

        </form>
    );
}