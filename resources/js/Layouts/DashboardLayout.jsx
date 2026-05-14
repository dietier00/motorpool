import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import scpaLogo from '../../../assets/images/scpa1.jpg';
import Switch from '../Components/Switch';
import { useTheme } from '../context/ThemeContext';

const navItems = [
    { label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/dashboard' },
    { label: 'Vehicles', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0', href: '/vehicles' },
    { label: 'Drivers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', href: '/drivers' },
    { label: 'Trip History', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', href: '/history' },
];

const reportItems = [
    { label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', href: '/reports' },
    { label: 'Maintenance', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', href: '/maintenance' },
    { label: 'Fuel Logs', icon: 'M3 10l1.664-2.331A3 3 0 017.664 6h8.672a3 3 0 012.664 1.669L21 10M5 10v10a1 1 0 001 1h3m10-11v11a1 1 0 001 1h3m-4-12h.01M9 21h6', href: '/fuel' },
];

const settingsItems = [
    { label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', href: '/profile' }
];

function NavItem({ item, currentUrl, isDark }) {
    const isActive = currentUrl === item.href;
    return (
        <Link
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 mx-3 rounded-xl text-sm font-medium transition-all duration-300
                ${isActive
                    ? isDark 
                        ? 'bg-indigo-500/10 text-indigo-400 shadow-sm shadow-indigo-500/10 border border-indigo-500/20' 
                        : 'bg-indigo-600 shadow-md shadow-indigo-600/20 text-white border border-indigo-500'
                    : isDark 
                        ? 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
        >
            <svg className={`w-5 h-5 flex-shrink-0 ${isActive && !isDark ? 'text-white' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.label}
        </Link>
    );
}

export default function DashboardLayout({ children, title = 'Dashboard' }) {
    const { auth, url } = usePage().props;
    const { isDark } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#0B1121] text-white' : 'bg-[#eef2f6] text-slate-800'}`}>

            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-[280px]' : 'w-0 overflow-hidden'} flex-shrink-0 flex flex-col transition-all duration-300 z-40 relative shadow-2xl ${isDark ? 'bg-slate-900/50 backdrop-blur-xl border-r border-slate-800' : 'bg-white border-r border-slate-200'} `}>
                
                {/* Logo Area */}
                <div className={`flex items-center gap-3 px-6 h-[88px] flex-shrink-0`}>
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl text-white shadow-lg shadow-green-600">
                    <img src={scpaLogo} alt="" className='h-10 w-10 rounded-xl'/>
                    </div>
                    <div>
                        <div className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>SCPA Fleet</div>
                        <div className={`text-[11px] font-medium tracking-wide pb-0.5 uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Motor Pool Ops</div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 space-y-1 overflow-y-auto w-full custom-scrollbar">
                    
                    <div className={`px-7 py-2 text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Menu</div>
                    {navItems.map(item => <NavItem key={item.href} item={item} currentUrl={url} isDark={isDark} />)}
                    
                    <div className="my-4 border-t border-slate-200 dark:border-slate-800/60 mx-6"></div>
                    
                    <div className={`px-7 py-2 text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Insights</div>
                    {reportItems.map(item => <NavItem key={item.href} item={item} currentUrl={url} isDark={isDark} />)}

                    <div className="my-4 border-t border-slate-200 dark:border-slate-800/60 mx-6"></div>
                    
                    <div className={`px-7 py-2 text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>System</div>
                    {settingsItems.map(item => <NavItem key={item.href} item={item} currentUrl={url} isDark={isDark} />)}
                    
                </nav>

                {/* Profile Card Bottom component */}
                <div className={`p-2 m-4 rounded-xl ${isDark ? 'bg-slate-800/30 border border-[#255F38]' : 'bg-slate-50 border border-zinc-400'}`}>
                    <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${auth?.user?.name || 'A'}&background=random`} alt="Avatar" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
                        <div className="flex-1 min-w-0">
                            <div className={`text-sm font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{auth?.user?.name ?? 'Admin User'}</div>
                            <div className={`text-[11px] truncate ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{auth?.user?.email ?? 'admin@scpa.local'}</div>
                        </div>
                        <Link href="/logout" method="post" as="button"  className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400' : 'bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 shadow-sm'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className={`flex items-center justify-between px-8 h-[58px] flex-shrink-0 transition-colors duration-300 z-30 ${isDark ? 'bg-[#0B1121]/80 backdrop-blur-md border-b border-slate-800' : 'bg-[#eef2f6]/80 backdrop-blur-md'}`}>
                    <div className="flex items-center gap-5">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h1>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="relative hidden lg:block">
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className={`w-[260px] pl-11 pr-4 py-2.5 text-sm rounded-xl transition-all focus:outline-none focus:ring-2 ${isDark ? 'bg-slate-900/50 border border-slate-700/50 text-slate-200 placeholder-slate-500 focus:ring-indigo-500/30 focus:border-indigo-500/50' : 'bg-white border-none shadow-sm text-slate-900 placeholder-slate-400 focus:ring-indigo-500/20'}`}
                            />
                            <svg className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        
                        <div className={`h-8 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'} hidden md:block`}></div>

                        <div className="flex items-center gap-3">
                            <button className={`relative p-2.5 rounded-xl transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                            </button>
                            <div className={`p-2.5 rounded-xl flex items-center`}>
                                <Switch />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className={`flex-1 overflow-x-hidden overflow-y-auto px-8 py-6 custom-scrollbar`}>
                    <div className="max-w-[1600px] w-full mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            
            {/* Global Custom Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: \${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: \${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}; }
            `}} />
        </div>
    );
}