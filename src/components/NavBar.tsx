"use client";
import { useSession, signOut } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";

import Button from "@/components/Button";
import {useEffect, useState} from "react";

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
                "p-4",
                "absolute",
                "top-[80px]",
                "left-0",
                "bg-gray-100",
                "w-full",
                "z-40",
            ]
        }
        else {
            classes = ["hidden", "md:flex", "mr-auto", "text-base", "font-semibold"]
        }
        return classes.join(" ");
    }

    useEffect(() => {
        function handleResize() {
            if (window.screen.width >= 768) {
                setIsOpen(false);
            }
        }
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    return (
        <nav className="w-screen h-[10vh] flex-shrink-0 flex justify-center pt-2 mb-5 md:py-0 md:mb-0">
                <div className="w-9/10 flex justify-center items-center relative z-30">
                    <div className="md:hidden">
                        <Button type={"button"} onClick={handleHamburgerClick} className="bg-transparent hover:bg-transparent">
                            <Image src="/hamburger.svg" alt="Mobile Menu" width={50} height={50}/>
                        </Button>
                    </div>
                    <div className={handleMenu()}>
                        {status === 'authenticated' ? (
                            <div className="flex flex-col gap-y-2 md:flex-row md:gap-8">
                                <Link href="/profile" onClick={() => {setIsOpen(false)}}>
                                    <p className="hover:bg-white p-1">Profile</p>
                                </Link>
                                <Link href="/login" onClick={async () => await signOut()}>
                                    <p className="hover:bg-white p-1" onClick={() => {setIsOpen(false)}}>Sign Out</p>
                                </Link>
                                <Link href="/chats">
                                    <p className="hover:bg-white p-1" onClick={() => {setIsOpen(false)}}>Messages</p>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-y-2 md:flex-row md:gap-6">
                                <Link href="/login" onClick={() => {setIsOpen(false)}}>
                                    <p className="hover:bg-white p-1">Login</p>
                                </Link>
                                <Link href="/register" onClick={() => {setIsOpen(false)}}>
                                    <p className="hover:bg-white p-1">Sign Up</p>
                                </Link>
                            </div>
                        )}
                    </div>
                    <Link className="absolute" href="/" onClick={() => {setIsOpen(false)}}>
                        <Image src={"/WPIBuysLogo.png"} alt={"WPIBuys Logo"} width={80} height={80} quality={100}/>
                    </Link>
                    <Link className="ml-auto" href="/sell" onClick={() => {setIsOpen(false)}}>
                        <Button className="text-xs md:text-sm lg:text-base" type="button">Sell an Item</Button>
                    </Link>
                </div>
        </nav>
    );
}
