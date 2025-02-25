"use server";

export async function postLogin(formData: FormData) {
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
        return { success: true, username: data.username };
    } catch (e) {
        console.error("Login failed:", e);
        return { error: "Login failed" };
    }
}

export async function postRegister(formData: FormData) {
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

