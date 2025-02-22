import Button from "@/components/Button";
import TextInput from "@/components/TextInput";

async function postRegister(formData: FormData) {
    "use server";
    try {
        const response = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            body: formData,
        });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (data.error) {
            return { error: data.error };
        }
        console.log("Register correctly");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Registration failed" };
    }
}

export default function RegisterForm({ error }: { error?: string }) {
    return (
        // @ts-ignore
        <form action={postRegister}>
            <h1>Register</h1>
            <TextInput type="text" name="username" placeholder="Choose a username">Username</TextInput>
            <TextInput type="password" name="password" placeholder="Choose a password">Password</TextInput>
            <Button type="submit">Register</Button>
            {error && <p>User already exists.</p>}
        </form>
    );
}