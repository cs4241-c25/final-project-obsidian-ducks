"use client";
import { useSession, signOut } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";

import Button from "@/components/Button";
import {useState} from "react";

export default function NavBar(){
    const { status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    function handleHamburgerClick() {
        setIsOpen(!isOpen);
    }

    function handleMenu() {
        let classes = [];
        if(isOpen) {
            classes = [
                "flex",
                "flex-col",
                "w-full",
                "top-[80px]",
                "p-4",
            ]
        }
        else {
            classes = ["hidden", "md:flex", "gap-8",]
        }
        return classes.join(" ");
    }

    return (
        <nav className="w-screen h-[10vh] flex justify-center">
                <div className="w-9/10 flex justify-center items-center relative z-10">
                    <div className="md:hidden">
                        <Button onClick={handleHamburgerClick} className="bg-transparent hover:bg-transparent">
                            <Image src="/hamburger.svg" alt="Mobile Menu" width={50} height={50}/>
                        </Button>
                    </div>
                    <div className="mr-auto text-base font-semibold">
                        {status === 'authenticated' ? (
                                <div className={handleMenu()}>
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
                        ) : (
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
                </div>
        </nav>
    );
}
