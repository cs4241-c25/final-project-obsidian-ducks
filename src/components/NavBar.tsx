'use client';
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import {useSession, signOut} from 'next-auth/react';


export default function NavBar(){
    const { status } = useSession();

    return (
        <nav className="w-screen h-[10vh] flex justify-center items-center border relative z-10 pl-8 pr-8">
            <div className="mr-auto text-base font-semibold">
                {status === 'authenticated' ? (
                    <div className="flex gap-8">
                        <Link href="/profile">
                            <p>Profile</p>
                        </Link>
                        <Link href="/login" onClick={async () => await signOut()}>
                            <p>Sign Out</p>
                        </Link>
                        <Link href="/chats">
                            <p>Messages</p>
                        </Link>
                    </div>
                ):(
                    <div className="flex gap-6">
                        <Link href="/login">
                            <p>Login</p>
                        </Link>
                        <Link href="/register">
                            <p>Sign Up</p>
                        </Link>
                    </div>
                )}
            </div>
            <Link className="absolute" href="/">
                <Image src={"/WPIBuysLogo.png"} alt={"WPIBuys Logo"} width={80} height={80} quality={100}/>
            </Link>
            <Link className="ml-auto" href="/sell">
                <Button className="md:text-sm lg:text-base" type="button">Sell an Item</Button>
            </Link>
        </nav>
    );
}
