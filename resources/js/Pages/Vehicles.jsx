import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Vehicles() {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-slate-100 leading-tight">Vehicles Management</h2>}
        >
            <Head title="Vehicles" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-white/10 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100">Vehicle Fleet</h3>
                            <button className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                + Add Vehicle
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-500/10 dark:to-slate-900 p-4 rounded-xl border border-cyan-100 dark:border-cyan-500/30">
                                <div className="text-cyan-600 dark:text-cyan-300 text-sm font-semibold uppercase tracking-wider mb-1">Total Vehicles</div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-slate-100">124</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-500/10 dark:to-slate-900 p-4 rounded-xl border border-green-100 dark:border-green-500/30">
                                <div className="text-green-600 dark:text-green-300 text-sm font-semibold uppercase tracking-wider mb-1">Active Status</div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-slate-100">98</div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-500/10 dark:to-slate-900 p-4 rounded-xl border border-orange-100 dark:border-orange-500/30">
                                <div className="text-orange-600 dark:text-orange-300 text-sm font-semibold uppercase tracking-wider mb-1">In Maintenance</div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-slate-100">5</div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 dark:bg-slate-900 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider rounded-tl-lg">Vehicle ID</th>
                                        <th className="px-6 py-3 bg-gray-50 dark:bg-slate-900 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Model</th>
                                        <th className="px-6 py-3 bg-gray-50 dark:bg-slate-900 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Plate Number</th>
                                        <th className="px-6 py-3 bg-gray-50 dark:bg-slate-900 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 bg-gray-50 dark:bg-slate-900 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider rounded-tr-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-white/10">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <tr key={item} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/60 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-600 dark:text-cyan-300">#VH-{1000 + item}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-100">Toyota Hilux 2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">ABC-{123 + item}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-300">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-gray-400 hover:text-cyan-600 dark:text-slate-500 dark:hover:text-cyan-300 transition-colors">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}