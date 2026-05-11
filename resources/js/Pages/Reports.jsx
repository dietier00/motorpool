import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Chart from 'react-apexcharts';

export default function Reports() {
    const { mileage = null, stats = {} } = usePage().props;

    const mileageOptions = {
        chart: { type: 'area', height: 350, toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
        colors: ['#0891b2'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: { categories: mileage?.categories ?? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
        yaxis: { title: { text: 'Distance (km)' } },
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [50, 100] } }
    };
    const mileageSeries = mileage?.series?.map((s, i) => ({ name: `Series ${i+1}`, data: s })) ?? [{ name: 'Fleet Mileage', data: [1200, 1900, 1500, 2200, 2800, 2100] }];

    const expenseOptions = {
        chart: { type: 'bar', height: 350, toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
        colors: ['#3b82f6', '#f59e0b'],
        plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: { categories: ['Q1', 'Q2', 'Q3', 'Q4'] },
        yaxis: { title: { text: '$ (thousands)' } },
        fill: { opacity: 1 },
        tooltip: { y: { formatter: function (val) { return "$ " + val + "k" } } }
    };
    const expenseSeries = [
        { name: 'Fuel Costs', data: [44, 55, 57, 56] },
        { name: 'Maintenance', data: [13, 23, 20, 8] }
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-slate-100 leading-tight">Analytics & Reports</h2>}
        >
            <Head title="Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-6 flex justify-end">
                        <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-slate-900 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Report PDF
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/10">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">Fleet Mileage Over Time</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Total distance covered by all active vehicles.</p>
                            <div className="mt-4">
                                <Chart options={mileageOptions} series={mileageSeries} type="area" height={300} />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/10">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">Operational Expenses</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Quarterly breakdown of fuel vs maintenance costs.</p>
                            <div className="mt-4">
                                <Chart options={expenseOptions} series={expenseSeries} type="bar" height={300} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}