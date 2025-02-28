'use client';
import Link from "next/link";
import Button from "@/components/Button";
import Image from "next/image";
import {signOut, useSession} from 'next-auth/react';
import MailIcon from "./chat/MailIcon";
import {useLogout} from '../app/profile/handleLogout';


export default function NavBar(){
    const { data: session, status } = useSession();
    const handleLogout = useLogout();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        handleLogout();
    };
    return (
        <nav className="w-screen h-[10vh] flex justify-between items-center border relative z-10">
            <div className="flex h-full justify-between items-center gap-8 md:text-sm lg:text-base font-semibold ml-10">
                {status === 'authenticated' ? (
                    <>
                        <Link href="/profile">
                            <p>Profile</p>
                        </Link>
                        <Link href="/login" onClick={handleClick}>
                            <p>Logout</p>
                        </Link>

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
                <Image src={"/wpibuysicon1.svg"} alt={"WPIBuys Logo"} width={75} height={85}/>
            </Link>
            <div className="flex flex-row gap-5">
              <Link href={"/chats"}>
                <MailIcon height={50} width={50}/>
              </Link>
              <Link href="/sell">
                  <Button className="mr-10 md:text-sm lg:text-base" type="button">Sell an Item</Button>
              </Link>
            </div>
        </nav>
    );
}
