import { Head } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import ReactApexChart from 'react-apexcharts';

// --- Stat Card Component ---
function StatCard({ label, value, badge, badgeType, icon, iconBg }) {
    const badgeColors = {
        success: 'bg-emerald-500/10 text-emerald-400',
        warning: 'bg-amber-500/10 text-amber-400',
        info:    'bg-cyan-500/10 text-cyan-400',
        danger:  'bg-red-500/10 text-red-400',
    };
    return (
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:bg-white/[0.05] transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                    {icon}
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColors[badgeType]}`}>
                    {badge}
                </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
        </div>
    );
}

// --- Recent Vehicles Table ---
function VehicleTable({ vehicles }) {
    const statusStyle = {
        Active:      'bg-emerald-500/10 text-emerald-400',
        Maintenance: 'bg-amber-500/10 text-amber-400',
        Available:   'bg-cyan-500/10 text-cyan-400',
        Inactive:    'bg-slate-500/10 text-slate-400',
    };
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-white/5">
                        {['Plate No.', 'Make / Model', 'Year', 'Driver', 'Last Trip', 'Status'].map(h => (
                            <th key={h} className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider pb-3 pr-4">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                    {vehicles.map((v, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition">
                            <td className="py-3 pr-4 font-semibold text-cyan-300">{v.plate}</td>
                            <td className="py-3 pr-4 text-slate-300">{v.make}</td>
                            <td className="py-3 pr-4 text-slate-400">{v.year}</td>
                            <td className="py-3 pr-4 text-slate-400">{v.driver || '—'}</td>
                            <td className="py-3 pr-4 text-slate-500 text-xs">{v.lastTrip}</td>
                            <td className="py-3">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[v.status]}`}>
                                    {v.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// --- Main Dashboard ---
export default function DashboardIndex({ stats, vehicles, monthlyActivity, fuelData }) {

    // Default/sample data if not passed from Laravel
    const defaultStats = stats ?? { total: 48, active: 32, maintenance: 7, available: 9 };
    const defaultVehicles = vehicles ?? [
        { plate: 'ABC-1234', make: 'Toyota Hilux', year: 2021, driver: 'Juan Dela Cruz', lastTrip: 'Today, 8:30 AM', status: 'Active' },
        { plate: 'XYZ-5678', make: 'Mitsubishi L300', year: 2019, driver: 'Pedro Santos', lastTrip: 'Today, 7:15 AM', status: 'Active' },
        { plate: 'DEF-9012', make: 'Isuzu Crosswind', year: 2018, driver: null, lastTrip: 'Yesterday', status: 'Maintenance' },
        { plate: 'GHI-3456', make: 'Ford Ranger', year: 2022, driver: null, lastTrip: 'May 4', status: 'Available' },
        { plate: 'JKL-7890', make: 'Nissan Urvan', year: 2020, driver: 'Maria Santos', lastTrip: 'Today, 9:00 AM', status: 'Active' },
    ];

    // ApexCharts — Bar Chart (Monthly Activity)
    const barOptions = {
        chart: { type: 'bar', background: 'transparent', toolbar: { show: false }, fontFamily: 'inherit' },
        colors: ['#06b6d4'],
        plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } },
        dataLabels: { enabled: false },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: { style: { colors: '#475569', fontSize: '11px' } },
            axisBorder: { show: false }, axisTicks: { show: false },
        },
        yaxis: { labels: { style: { colors: '#475569', fontSize: '11px' } } },
        grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
        tooltip: { theme: 'dark' },
    };
    const barSeries = [{ name: 'Trips', data: monthlyActivity ?? [18, 25, 22, 30, 28, 35, 32, 40, 36, 42, 30, 45] }];

    // ApexCharts — Donut Chart (Vehicle Status)
    const donutOptions = {
        chart: { type: 'donut', background: 'transparent', fontFamily: 'inherit' },
        colors: ['#06b6d4', '#f59e0b', '#475569', '#ef4444'],
        labels: ['Active', 'Maintenance', 'Available', 'Inactive'],
        legend: { position: 'bottom', labels: { colors: '#94a3b8' }, fontSize: '12px' },
        dataLabels: { enabled: false },
        plotOptions: { pie: { donut: { size: '65%', labels: {
            show: true,
            total: { show: true, label: 'Total', color: '#94a3b8', formatter: () => defaultStats.total }
        }}}},
        tooltip: { theme: 'dark' },
        stroke: { colors: ['#0f172a'] },
    };
    const donutSeries = [defaultStats.active, defaultStats.maintenance, defaultStats.available, defaultStats.total - defaultStats.active - defaultStats.maintenance - defaultStats.available];

    // ApexCharts — Area Chart (Fuel Consumption)
    const areaOptions = {
        chart: { type: 'area', background: 'transparent', toolbar: { show: false }, fontFamily: 'inherit' },
        colors: ['#10b981', '#06b6d4'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0, stops: [0, 100] } },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            labels: { style: { colors: '#475569', fontSize: '11px' } },
            axisBorder: { show: false }, axisTicks: { show: false },
        },
        yaxis: { labels: { style: { colors: '#475569', fontSize: '11px' }, formatter: v => `${v}L` } },
        grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
        legend: { labels: { colors: '#94a3b8' }, fontSize: '12px' },
        tooltip: { theme: 'dark' },
    };
    const areaSeries = [
        { name: 'Fuel Used', data: fuelData?.used ?? [120, 145, 132, 160, 148, 90, 75] },
        { name: 'Fuel Budget', data: fuelData?.budget ?? [150, 150, 150, 150, 150, 120, 100] },
    ];

    return (
        <DashboardLayout title="Fleet Operations Dashboard">
            <Head title="Dashboard" />

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Vehicles" value={defaultStats.total} badge="Fleet"
                    badgeType="info" iconBg="bg-cyan-500/10"
                    icon={<svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"/></svg>}
                />
                <StatCard label="Active Vehicles" value={defaultStats.active} badge="+4 this week"
                    badgeType="success" iconBg="bg-emerald-500/10"
                    icon={<svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                />
                <StatCard label="In Maintenance" value={defaultStats.maintenance} badge="Needs attention"
                    badgeType="warning" iconBg="bg-amber-500/10"
                    icon={<svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>}
                />
                <StatCard label="Available" value={defaultStats.available} badge="Ready to deploy"
                    badgeType="info" iconBg="bg-slate-500/10"
                    icon={<svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7"/></svg>}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

                {/* Bar Chart */}
                <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm font-semibold text-white">Monthly Fleet Activity</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Total trips per month — 2025</p>
                        </div>
                    </div>
                    <ReactApexChart options={barOptions} series={barSeries} type="bar" height={220} />
                </div>

                {/* Donut Chart */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                    <h2 className="text-sm font-semibold text-white mb-1">Vehicle Status</h2>
                    <p className="text-xs text-slate-500 mb-2">Current fleet breakdown</p>
                    <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height={240} />
                </div>
            </div>

            {/* Charts Row 2 + Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

                {/* Area Chart */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                    <h2 className="text-sm font-semibold text-white mb-1">Fuel Consumption</h2>
                    <p className="text-xs text-slate-500 mb-2">This week (Liters)</p>
                    <ReactApexChart options={areaOptions} series={areaSeries} type="area" height={200} />
                </div>

                {/* Vehicle Table */}
                <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm font-semibold text-white">Recent Vehicles</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Latest fleet activity</p>
                        </div>
                        <a href="/vehicles" className="text-xs text-cyan-400 hover:text-cyan-300 transition">
                            View all →
                        </a>
                    </div>
                    <VehicleTable vehicles={defaultVehicles} />
                </div>
            </div>
        </DashboardLayout>
    );
}