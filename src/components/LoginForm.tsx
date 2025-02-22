import Button from "@/components/Button";
import TextInput from "@/components/TextInput";

async function postLogin(formData: FormData) {
    "use server";
    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", errorText);
            throw new Error(errorText);
        }
        const data = await response.json();
        if (data.error) {
            return { error: data.error };
        }
        console.log("Logged in correctly! :)");
        return { success: true };
    } catch (e) {
        console.error("Login failed:", e);
        return { error: "Login failed" };
    }
}

export default function LoginForm() {

    return (
        // @ts-ignore
        <form action={postLogin}>
            <h1>Login</h1>
            <TextInput className="w-[1000px]" type="text" name="username" placeholder="Enter your username">Username</TextInput>
            <TextInput type="password" name="password" placeholder="Enter your password">Password</TextInput>
            <Button type="submit">Login</Button>
        </form>
    );
}