import Button from "@/components/Button";
import TextInput from "@/components/TextInput";

async function postRegister(formData: FormData) {
    "use server";
    try {
        const email = formData.get("username") as string;

        console.log("Email:", email);

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
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;

        if (!email.endsWith("@wpi.edu")) {
            alert("Only @wpi.edu emails are allowed.");
            return;
        }

        const result = await postRegister(formData);
        if (result.error) {
            alert(result.error);
        } else {
            alert("Registration successful!");
        }
    };
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