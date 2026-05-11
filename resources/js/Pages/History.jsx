import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function History() {
    const { trips: tripsProp } = usePage().props;
    const trips = Array.isArray(tripsProp) ? tripsProp : tripsProp?.data ?? [];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-slate-100 leading-tight">Trip & Assignment History</h2>}
        >
            <Head title="History" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm sm:rounded-xl border border-gray-100 dark:border-white/10">
                        
                        {/* Filters */}
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-slate-900/60 flex flex-wrap gap-4 items-end">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">Date Range</label>
                                <input type="date" className="border-gray-300 dark:border-slate-700 rounded-md text-sm focus:ring-cyan-500 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100" />
                            </div>
                            <span className="text-gray-400 dark:text-slate-500 mb-2">to</span>
                            <div className="flex flex-col gap-1">
                                <input type="date" className="border-gray-300 dark:border-slate-700 rounded-md text-sm focus:ring-cyan-500 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100" />
                            </div>

                            <div className="flex flex-col gap-1 ml-auto">
                                <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">Search Details</label>
                                <div className="flex">
                                    <input type="text" placeholder="Driver, Vehicle, ID..." className="border-gray-300 dark:border-slate-700 rounded-l-md text-sm focus:ring-cyan-500 py-2 w-64 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500" />
                                    <button className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white px-4 rounded-r-md transition-colors">
                                        Filter
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* List */}
                        <div className="divide-y divide-gray-100 dark:divide-white/10">
                            {trips.map((trip) => (
                                <div key={trip.id} className="p-6 hover:bg-gray-50/80 dark:hover:bg-slate-900/60 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-lg font-bold text-gray-900 dark:text-slate-100">{trip.purpose}</h4>
                                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                                                        {trip.id}
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-sm text-gray-500 dark:text-slate-400 flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        {trip.driver}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                        </svg>
                                                        {trip.vehicle}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">{trip.distance} Distance</div>
                                            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                                {trip.start ?? 'N/A'} &rarr; {trip.end ?? 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination mockup */}
                        <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-slate-900 flex justify-between items-center text-sm text-gray-500 dark:text-slate-400">
                            <span>Showing 1 to 3 of 45 entries</span>
                            <div className="flex gap-1">
                                <button className="px-3 py-1 border border-gray-200 dark:border-slate-700 rounded text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50">Prev</button>
                                <button className="px-3 py-1 border border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/40 rounded font-medium">1</button>
                                <button className="px-3 py-1 border border-gray-200 dark:border-slate-700 rounded hover:bg-gray-50 dark:hover:bg-slate-800">2</button>
                                <button className="px-3 py-1 border border-gray-200 dark:border-slate-700 rounded hover:bg-gray-50 dark:hover:bg-slate-800">3</button>
                                <button className="px-3 py-1 border border-gray-200 dark:border-slate-700 rounded hover:bg-gray-50 dark:hover:bg-slate-800">Next</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}