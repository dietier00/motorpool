import { Head, Link } from '@inertiajs/react';
import scpaLogo from '../../../assets/images/scpa1.jpg';
import Prism from '../Components/Prism';
import TextType from '../Components/TextType';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
             <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
                <div className='absolute inset-0 z-0'>
                    <Prism
                        animationType="rotate"
                        timeScale={0.5}
                        height={3.5}
                        baseWidth={5.5}
                        scale={3.6}
                        hueShift={0}
                        colorFrequency={1}
                        noise={0}
                        glow={1}
                    />
                </div>
                <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 lg:px-8">
                    <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
                        <Link href="/" className="flex items-center gap-3">
                             <img
                                src={scpaLogo}
                                alt="Sanitary Care Products Asia, Inc."
                                className="h-11 w-11 rounded-2xl object-contain shadow-lg shadow-cyan-500/30"
                            />
                            <div>
                                <div className="text-sm font-semibold tracking-[0.2em] text-cyan-200 uppercase">
                                    Sanitary Care Products Asia, Inc.
                                </div>
                            </div>
                        </Link>
                        <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="relative cursor-pointer py-4 px-8 text-center font-barlow inline-flex justify-center text-base uppercase text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden"
                                >
                                    <span className="relative z-20">Login</span>

                                    <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out" />

                                    <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0" />
                                    <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0" />
                                    <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0" />
                                    <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0" />
                                </Link>
                            </div>
                    </header>
                    <div className='flex flex-1 items-center justify-center text-center text-5xl px-5 py-6' style={{fontFamily: 'Astra'}}>
                        <TextType 
                        text={["Welcome to SCPA Motor Pool Management System"]}
                        typingSpeed={75}
                        pauseDuration={1500}
                        showCursor
                        cursorCharacter="_"
                        deletingSpeed={50}
                        variableSpeedEnabled={false}
                        variableSpeedMin={60}
                        variableSpeedMax={120}
                        cursorBlinkDuration={0.5}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}