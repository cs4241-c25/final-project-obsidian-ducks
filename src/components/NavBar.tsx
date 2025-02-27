'use client';
import Link from "next/link";

import Button from "@/components/Button";
import Image from "next/image";
// import { handleLogout } from '../app/profile/page';
import { useRouter } from "next/navigation";
import {signOut, useSession} from 'next-auth/react';


export default function NavBar(){
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await signOut({ redirect: false });
            router.push('/login');
        } catch (error) {
            console.error("Logout failed:", error); // Debugging
        }
    };
    const { data: session, status } = useSession();
    return (
        <nav className="w-screen h-[10vh] flex justify-between items-center border relative z-10">
            <div className="flex h-full justify-between items-center gap-8 md:text-sm lg:text-base font-semibold ml-10">
                {status === 'authenticated' ? (
                    <>
                        <Link href="/profile">
                            <p>Profile</p>
                        </Link>
                        <Button type={"button"} onClick={handleLogout}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            <p>Login</p>
                        </Link>
                        <Link href="/register">
                            <p>Sign Up</p>
                        </Link>
                    </>
                )}
                <Link href="/favorites">
                    <Image src={"/like.svg"} alt={"heart icon"} width={20} height={20}/>
                </Link>
            </div>
            <Link href="/">
                <svg className="xl:w-[75px] 2xl:w-[85px]" width={70} height="100%" viewBox="0 0 100 100">
                    <image href="/WPIBuys.png" />
                </svg>
            </Link>
            <Link href="/sell">
                <Button className="mr-10 md:text-sm lg:text-base" type="button">Sell an Item</Button>
            </Link>
        </nav>
    );
}