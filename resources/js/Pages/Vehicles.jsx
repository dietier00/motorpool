import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Vehicles() {
    return (
        <AuthenticatedLayout header="Fleet Details">
            <Head title="Vehicles" />

            <div className="pb-12 text-slate-800 dark:text-slate-200">
                {/* Stats Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Fleet</div>
                            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">124</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active & Working</div>
                            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">98</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">In Maintenance</div>
                            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">5</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                    <div className="px-7 py-6 border-b border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Vehicles Directory</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all registered company vehicles</p>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <input type="text" placeholder="Search vehicles..." className="w-full pl-10 pr-4 py-2 text-sm rounded-xl transition focus:outline-none bg-slate-50 dark:bg-slate-800 border-none text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50" />
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-500/20 whitespace-nowrap">
                                + Add Vehicle
                            </button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-7 py-4">Vehicle ID</th>
                                    <th className="px-7 py-4">Model & Specifics</th>
                                    <th className="px-7 py-4">Plate Number</th>
                                    <th className="px-7 py-4">Status</th>
                                    <th className="px-7 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-7 py-4 font-bold text-indigo-600 dark:text-indigo-400">#VH-{1000 + item}</td>
                                        <td className="px-7 py-4">
                                            <div className="font-semibold text-slate-900 dark:text-slate-200">Toyota Hilux 2023</div>
                                            <div className="text-[11px] text-slate-400 mt-0.5">Millage: {12040 + (item * 432)} km</div>
                                        </td>
                                        <td className="px-7 py-4 font-medium tracking-wide">ABC-{123 + item}</td>
                                        <td className="px-7 py-4">
                                            <span className="px-2.5 py-1 inline-flex text-[11px] font-bold uppercase tracking-wide rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-7 py-4 text-right font-medium">
                                            <button className="text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}