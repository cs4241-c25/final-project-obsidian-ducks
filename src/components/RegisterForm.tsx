'use client';
import { postRegister } from '../app/actions/actions'
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { useRouter } from 'next/navigation';

export default function RegisterForm({ error }: { error?: string }) {
    const router = useRouter();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;



        if (!username.endsWith(".edu")) {
            alert("Only .edu emails are allowed.");
            return;
        }

        const result = await postRegister(formData);
        if (result.error) {
            alert(result.error);
        } else{
            form.reset();
            router.push('/login');
        }
    };
    return (

        // @ts-ignore
        <form onSubmit={handleSubmit}
              className="max-w-md mx-auto p-6 bg-white rounded-lg border-2 border-crimson-500 shadow-md">
            <h1 className="text-3xl font-bold mb-6">Register</h1>
            <div className="flex flex-col space-y-4">
                <TextInput type="text" name="username" placeholder="Enter your school email">Username:</TextInput>
                <TextInput type="password" name="password" placeholder="Choose a password">Password</TextInput>
                <a href="/login" className="text-crimson-500 hover:underline mb-0">Already have an account?</a>
                <div className="w-full flex justify-end">
                    <Button type="submit">Register</Button>
                </div>
            </div>

            {error && <p>User already exists.</p>}

        </form>
    );
}