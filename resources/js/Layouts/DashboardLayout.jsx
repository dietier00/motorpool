import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import scpaLogo from '../../../assets/images/scpa1.jpg';
import Switch from '../Components/Switch';
import { useTheme } from '../context/ThemeContext';

const navItems = [
    { label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/dashboard' },
    { label: 'Vehicles', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0', href: '/vehicles' },
    { label: 'Drivers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', href: '/drivers' },
    { label: 'History', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', href: '/history' },
];

const reportItems = [
    { label: 'Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', href: '/reports' },
    { label: 'Maintenance', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', href: '/maintenance' },
    { label: 'Profile', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4', href: '/profile' },
];

function NavItem({ item, currentUrl, isDark }) {
    const isActive = currentUrl === item.href;
    return (
        <Link
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl mx-2 text-sm font-medium transition-all duration-200
                ${isActive
                    ? isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-500/10 text-cyan-600 border border-cyan-300'
                    : isDark ? 'text-slate-400 hover:bg-white/5 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
        >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
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
        <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

            <aside className={`${sidebarOpen ? 'w-60' : 'w-0 overflow-hidden'} flex-shrink-0 flex flex-col transition-all duration-300 ${isDark ? 'bg-slate-950 border-white/5' : 'bg-white border-slate-200'} border-r`}>
                <div className={`flex items-center gap-3 px-4 py-5 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                    <img src={scpaLogo} alt="SCPA" className="h-8 w-8 rounded-lg object-contain" />
                    <div>
                        <div className={`text-xs font-bold tracking-widest uppercase ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>SCPA Fleet</div>
                        <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Motor Pool Operations</div>
                    </div>
                </div>

                <nav className={`flex-1 py-4 space-y-0.5 overflow-y-auto ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                    <div className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>Main</div>
                    {navItems.map(item => <NavItem key={item.href} item={item} currentUrl={url} isDark={isDark} />)}
                    <div className={`px-4 py-2 mt-3 text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>Management</div>
                    {reportItems.map(item => <NavItem key={item.href} item={item} currentUrl={url} isDark={isDark} />)}
                </nav>

                <div className={`p-4 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center text-xs font-bold text-slate-950">
                            {auth?.user?.name?.charAt(0) ?? 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className={`text-xs font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{auth?.user?.name ?? 'Admin'}</div>
                            <div className={`text-[10px] truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{auth?.user?.email ?? ''}</div>
                        </div>
                        <Link href="/logout" method="post" as="button" className={`transition ${isDark ? 'text-slate-500 hover:text-red-400' : 'text-slate-400 hover:text-red-500'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 z-30 transition-colors duration-300 ${isDark ? 'border-white/5 bg-slate-950/80 backdrop-blur' : 'border-slate-200 bg-white/80 backdrop-blur'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <input
                                type="text"
                                placeholder="Search vehicles, drivers..."
                                className={`w-56 pl-9 pr-4 py-2 text-xs rounded-xl transition focus:outline-none ${isDark ? 'bg-white/5 border border-white/10 text-slate-300 placeholder-slate-500 focus:border-cyan-500/50' : 'bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-cyan-500'}`}
                            />
                            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button className={`relative transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] font-bold flex items-center justify-center">3</span>
                        </button>
                        <div className="flex items-center pl-4 border-l" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgb(226, 232, 240)' }}>
                            <Switch />
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className={`flex-1 p-6 overflow-auto transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}