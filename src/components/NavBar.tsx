import Link from "next/link";

import Button from "@/components/Button";

export default function NavBar(){
    return (
        <nav className="w-screen h-[10vh] flex justify-between items-center border">
            <div className="flex h-full justify-between items-center gap-8 text-lg font-semibold ml-10">
                <Link href="/profile">
                    <p>Login</p>
                </Link>
                <Link href="/profile">
                    <p>Sign Up</p>
                </Link>
            </div>
            <Link href="/">
                <svg width={85} height="100%" viewBox="0 0 100 100">
                    <image href="/WPIBuys.png" />
                </svg>
            </Link>
            <Link href="/sell">
                <Button className="mr-10" type="button">Sell an Item</Button>
            </Link>
        </nav>
    );
}