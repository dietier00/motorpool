import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Maintenance() {
    const { vehicles = [], records = [] } = usePage().props;

    const logs = records.length > 0 ? records.map(r => ({
        id: r.id,
        vehicle: r.vehicle_id ? `Vehicle #${r.vehicle_id}` : 'Unknown',
        type: 'Service',
        date: r.created_at ?? null,
        cost: r.cost ?? null,
        status: 'Completed',
        mechanic: r.mechanic ?? '—',
    })) : [
        { id: 1, vehicle: 'Toyota Hilux (ABC-124)', type: 'Oil Change', date: '2023-10-15', cost: '$120.00', status: 'Completed', mechanic: 'AutoFix Pro' },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-slate-100 leading-tight">Maintenance Logs</h2>}
        >
            <Head title="Maintenance" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">Next Scheduled Maintenance</h3>
                            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{vehicles[0] ? `${vehicles[0].name} (${vehicles[0].plate_num ?? ''})` : 'No upcoming'}</p>
                            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-300 px-3 py-1.5 rounded-md w-fit">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Due in 3 Days
                            </div>
                        </div>
                        <button className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                            Schedule Service
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-white/10">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-slate-900/60 flex justify-between items-center">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-slate-100">Recent Service Records</h3>
                            <div className="flex gap-2 text-sm">
                                <select className="border-gray-200 rounded-md text-gray-600 text-sm focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                                    <option>All Types</option>
                                    <option>Repair</option>
                                    <option>Routine</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                                <thead className="bg-white dark:bg-slate-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Vehicle</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Service Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Mechanic/Shop</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Cost</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-100 dark:divide-white/10">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/60 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{log.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{log.vehicle}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-slate-300">{log.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{log.mechanic}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{log.cost}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    log.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-300' :
                                                    log.status === 'Scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-300'
                                                }`}>
                                                    {log.status}
                                                </span>
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