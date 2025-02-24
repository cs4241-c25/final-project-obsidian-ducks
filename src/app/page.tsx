import { Oswald } from "next/font/google";

const oswald = Oswald({
    subsets: ["latin"]
});

export default function Home() {
    return (
        <main>
            <div className="w-screen relative">
                <div className="absolute w-full h-full bg-linear-to-r from-crimson-500 to-crimson-500 opacity-50"></div>
                <img className="w-full" src="/WPI.png" alt="WPI campus"/>
                <p className={`absolute top-[30%] left-[3%] ${oswald.className} text-6xl tracking-widest text-center leading-[65px] font-semibold text-white`}>
                    Sell, Buy, and Swap<br/>
                    Secondhand Items with<br/>
                    Fellow WPI Students
                </p>
            </div>
        </main>
    );
}
