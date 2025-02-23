'use client';
import { postRegister } from '../app/actions/actions'
import Button from "@/components/inputs/Button";
import TextInput from "@/components/inputs/TextInput";


export default function RegisterForm({ error }: { error?: string }) {
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
        }
    };
    return (

        // @ts-ignore
        <form onSubmit={handleSubmit}>
            <h1>Need to Register?</h1>
            <TextInput type="text" name="username" placeholder="Choose a username">Username</TextInput>
            <TextInput type="password" name="password" placeholder="Choose a password">Password</TextInput>
            <Button type="submit">Register</Button>
            {error && <p>User already exists.</p>}
        </form>
    );
}