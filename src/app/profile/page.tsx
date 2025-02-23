import Link from "next/link";
import Button from "@/components/inputs/Button";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";


//doesn't separate page from not logged in to logged in version yet but checked with db that registering/logging in works
export default function ProfilePage() {
    return (
        <main>
            <LoginForm />
            <RegisterForm />

            <h1>Username and Pic here (stuff that will show up once user logged in)</h1>

            <div style={{ marginTop: '20px' }}>
                <Link href="/shop">
                    <Button type={"button"}>My Shop</Button>
                </Link>
                <Link href="/edit-profile">
                    <Button type={"button"}>Edit Profile</Button>
                </Link>
            </div>




        </main>
    );
} //buttons do not do anything yet, just setting up page