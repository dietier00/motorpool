import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Chart from 'react-apexcharts';

export default function Dashboard() {
    const deliveryChartOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        colors: ['#34568b', '#10b981'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        legend: { position: 'top', horizontalAlign: 'left' },
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [50, 100] }
        }
    };
    
    const deliveryChartSeries = [
        { name: 'Deliveries', data: [31, 40, 28, 51, 42, 109, 100] },
        { name: 'Returns', data: [11, 32, 45, 32, 34, 52, 41] }
    ];

    const vehicleStatusOptions = {
        chart: { type: 'donut' },
        labels: ['Active', 'Maintenance', 'Inactive'],
        colors: ['#3b82f6', '#f59e0b', '#ef4444'],
        dataLabels: { enabled: false },
        legend: { position: 'bottom' },
        plotOptions: {
            pie: { donut: { size: '75%' } }
        }
    };

    const vehicleStatusSeries = [65, 20, 15];

    return (
        <AuthenticatedLayout
            
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-50 dark:bg-slate-950 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 p-6">
                            <div className="flex items-center justify-between">
                                <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                </div>
                                <span className="text-sm font-medium text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-md">+5</span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-gray-500 dark:text-slate-400 text-sm font-medium">Maintenance Alert</h3>
                                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-1">12</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 p-6">
                            <div className="flex items-center justify-between">
                                <div className="h-12 w-12 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-500 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <span className="text-sm font-medium text-green-500 dark:text-green-300 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-md">-12%</span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-gray-500 dark:text-slate-400 text-sm font-medium">Fuel Consumption</h3>
                                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-1">1,240 L</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 p-6">
                            <div className="flex items-center justify-between">
                                <div className="h-12 w-12 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-orange-500 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h9m0-8h4.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16h-4"></path></svg>
                                </div>
                                <span className="text-sm font-medium text-green-500 dark:text-green-300 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-md">+3</span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-gray-500 dark:text-slate-400 text-sm font-medium">Active Vehicles</h3>
                                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-1">86</p>
                            </div>
                        </div>

                        {/* Stat Card 4 */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 p-6">
                            <div className="flex items-center justify-between">
                                <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-500 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                </div>
                                <span className="text-sm font-medium text-green-500 dark:text-green-300 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-md">+5</span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-gray-500 dark:text-slate-400 text-sm font-medium">Available Drivers</h3>
                                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-1">42</p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Main Chart */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 p-6 lg:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">Delivery Performance</h3>
                            </div>
                            <Chart
                                options={deliveryChartOptions}
                                series={deliveryChartSeries}
                                type="area"
                                height="350"
                            />
                        </div>

                        {/* Donut Chart */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">Fleet Status</h3>
                            </div>
                            <div className="flex justify-center mt-6">
                                <Chart
                                    options={vehicleStatusOptions}
                                    series={vehicleStatusSeries}
                                    type="donut"
                                    width="320"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">Recent Shipments</h3>
                            <button className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-500 dark:text-slate-400">
                                <thead className="bg-gray-50 dark:bg-slate-900 text-xs text-gray-700 dark:text-slate-300 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Tracking Number</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-50 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-slate-900/60">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-100">TRK-1234-5678</td>
                                        <td className="px-6 py-4"><span className="bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300 px-2 py-1 rounded-md text-xs font-medium">Delivered</span></td>
                                        <td className="px-6 py-4">Los Angeles, CA</td>
                                        <td className="px-6 py-4">Oct 24, 2023</td>
                                    </tr>
                                    <tr className="border-b border-gray-50 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-slate-900/60">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-100">TRK-9876-5432</td>
                                        <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 px-2 py-1 rounded-md text-xs font-medium">In Transit</span></td>
                                        <td className="px-6 py-4">Chicago, IL</td>
                                        <td className="px-6 py-4">Oct 25, 2023</td>
                                    </tr>
                                    <tr className="border-b border-gray-50 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-slate-900/60">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-100">TRK-4567-8901</td>
                                        <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300 px-2 py-1 rounded-md text-xs font-medium">Pending</span></td>
                                        <td className="px-6 py-4">New York, NY</td>
                                        <td className="px-6 py-4">Oct 26, 2023</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
