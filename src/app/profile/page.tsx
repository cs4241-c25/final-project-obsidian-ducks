import Link from "next/link";
import Button from "@/components/Button";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";



export default function ProfilePage() {
    return (
        <main>
            <h1>Username and Pic here</h1>

            <div style={{ marginTop: '20px' }}>
                <Link href="/shop">
                    <Button type={"button"}>Your Shop</Button>
                </Link>
                <Link href="/saved">
                    <Button type={"button"}>Saved</Button>
                </Link>
                <Link href="/edit-profile">
                    <Button type={"button"}>Edit Profile</Button>
                </Link>
            </div>


            <LoginForm />
            <RegisterForm />

        </main>
    );
} //buttons do not do anything yet, just setting up page