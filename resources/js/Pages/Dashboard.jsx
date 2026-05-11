import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Chart from 'react-apexcharts';

export default function Dashboard() {
    const deliveryChartOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            zoom: { enabled: false },
            background: 'transparent'
        },
        colors: ['#6366f1', '#a855f7'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: '#94a3b8' } }
        },
        yaxis: {
            labels: { style: { colors: '#94a3b8' } }
        },
        grid: {
            borderColor: 'rgba(148, 163, 184, 0.1)',
            strokeDashArray: 4,
        },
        legend: { position: 'top', horizontalAlign: 'right', labels: { colors: '#94a3b8' } },
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] }
        },
        theme: { mode: 'dark' }, // It adapts via custom CSS mostly, but this helps the tooltip
    };
    
    const deliveryChartSeries = [
        { name: 'Trips Completed', data: [31, 40, 28, 51, 42, 109, 100] },
        { name: 'Maintenance', data: [11, 32, 45, 32, 34, 52, 41] }
    ];

    const vehicleStatusOptions = {
        chart: { type: 'donut', background: 'transparent' },
        labels: ['Active', 'In Shop', 'Idle'],
        colors: ['#6366f1', '#f59e0b', '#ef4444'],
        dataLabels: { enabled: false },
        stroke: { show: false },
        legend: { position: 'bottom', labels: { colors: '#94a3b8' } },
        plotOptions: {
            pie: { donut: { size: '75%', labels: { show: true, name: { color: '#94a3b8' }, value: { color: '#f8fafc' }, total: { show: true, color: '#94a3b8' } } } }
        }
    };

    const vehicleStatusSeries = [65, 20, 15];

    return (
        <AuthenticatedLayout header="System Overview">
            <Head title="Overview" />

            <div className="pb-12 text-slate-800 dark:text-slate-200">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    {/* Stat Card 1 */}
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 p-6 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/10">
                                <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-500/20">+3 Action Req</span>
                        </div>
                        <div className="mt-5">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Maintenance Alerts</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">12</p>
                                <p className="text-xs font-medium text-slate-400">vehicles</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 p-6 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/10">
                                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">-8% this week</span>
                        </div>
                        <div className="mt-5">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Fuel Consumption</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">1,240</p>
                                <p className="text-xs font-medium text-slate-400">Liters</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 p-6 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/10">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h9m0-8h4.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16h-4"></path></svg>
                            </div>
                            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-100 dark:border-cyan-500/20">95% Online</span>
                        </div>
                        <div className="mt-5">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Vehicles</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">86</p>
                                <p className="text-xs font-medium text-slate-400">/ 124 total</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 p-6 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/10">
                                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-100 dark:border-amber-500/20">+5 On Shift</span>
                        </div>
                        <div className="mt-5">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Available Drivers</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">42</p>
                                <p className="text-xs font-medium text-slate-400">ready</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Main Chart */}
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 p-6 lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Fleet Utilization</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Trips completed vs maintenance events</p>
                            </div>
                            <select className="bg-slate-50 dark:bg-slate-800 border-none text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 py-2 pl-3 pr-8 focus:ring-2 focus:ring-indigo-500/50 cursor-pointer">
                                <option>This Week</option>
                                <option>Last Week</option>
                                <option>This Month</option>
                            </select>
                        </div>
                        <div className="dark:[&_.apexcharts-tooltip]:bg-slate-800 dark:[&_.apexcharts-tooltip]:border-slate-700 dark:[&_.apexcharts-tooltip-title]:bg-slate-900 dark:[&_.apexcharts-tooltip-title]:border-b-slate-700 pt-2">
                            <Chart
                                options={deliveryChartOptions}
                                series={deliveryChartSeries}
                                type="area"
                                height="320"
                            />
                        </div>
                    </div>

                    {/* Donut Chart */}
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Current Status</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Real-time fleet condition</p>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center items-center mt-4">
                            <Chart
                                options={vehicleStatusOptions}
                                series={vehicleStatusSeries}
                                type="donut"
                                width="100%"
                                height="320"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                    <div className="px-7 py-5 border-b border-slate-100 dark:border-slate-800/60 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Active Trips</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Monitor ongoing operations</p>
                        </div>
                        <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">View All &rarr;</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-7 py-4">Trip ID</th>
                                    <th className="px-7 py-4">Status</th>
                                    <th className="px-7 py-4">Destination</th>
                                    <th className="px-7 py-4">Driver</th>
                                    <th className="px-7 py-4">Est. Arrival</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-7 py-4 font-semibold text-slate-900 dark:text-slate-200">TRP-2049</td>
                                    <td className="px-7 py-4"><span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide">In Transit</span></td>
                                    <td className="px-7 py-4 font-medium">Port of Los Angeles</td>
                                    <td className="px-7 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">JD</div>
                                            <span>John Doe</span>
                                        </div>
                                    </td>
                                    <td className="px-7 py-4">Today, 2:30 PM</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-7 py-4 font-semibold text-slate-900 dark:text-slate-200">TRP-2050</td>
                                    <td className="px-7 py-4"><span className="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide">Loading</span></td>
                                    <td className="px-7 py-4 font-medium">Distribution Center A</td>
                                    <td className="px-7 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">MS</div>
                                            <span>Mike Smith</span>
                                        </div>
                                    </td>
                                    <td className="px-7 py-4">Today, 4:15 PM</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-7 py-4 font-semibold text-slate-900 dark:text-slate-200">TRP-2051</td>
                                    <td className="px-7 py-4"><span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide">Completed</span></td>
                                    <td className="px-7 py-4 font-medium">Regional Hub NW</td>
                                    <td className="px-7 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">RJ</div>
                                            <span>Robert Jones</span>
                                        </div>
                                    </td>
                                    <td className="px-7 py-4">Today, 10:05 AM</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
