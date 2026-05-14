import React from 'react';
import { Head } from '@inertiajs/react';
import ReactApexChart from 'react-apexcharts';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { useTheme } from '../../context/ThemeContext';
import vehicleImage from '../../../../assets/images/scpa1.jpg';
import innovaImage from '../../../../assets/images/innova.png';
import { TrendingDown } from '@hugeicons/core-free-icons';



const vehicleImages = [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?auto=format&fit=crop&w=500&q=80',
];

const resolveVehicleImage = (vehicle) => {
    const rawImage = vehicle?.image_url || vehicle?.image || vehicle?.photo || vehicle?.thumbnail;
    if (rawImage) {
        if (rawImage.startsWith('http')) return rawImage;
        const normalized = rawImage.replace(/^\/?storage\//, '');
        return `/storage/${normalized}`;
    }
    const seed = String(vehicle?.id || vehicle?.plate_num || vehicle?.plate || vehicle?.name || 'default');
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) % vehicleImages.length;
    }
    return vehicleImages[hash] || vehicleImage;
};

const buildFallbackLabels = () => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return d.toLocaleString('en-US', { month: 'short' });
    });
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, note, icon, accent, trend, trendLabel, image, statusLabel }) {
    const accents = {
        blue:   { bg: 'bg-blue-50 dark:bg-blue-500/10', icon: 'text-blue-600 dark:text-blue-400', glow: 'from-blue-400 via-blue-500 to-cyan-500', bar: 'bg-blue-500' },
        green:  { bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: 'text-emerald-600 dark:text-emerald-400', glow: 'from-emerald-400 via-emerald-500 to-teal-500', bar: 'bg-emerald-500' },
        amber:  { bg: 'bg-amber-50 dark:bg-amber-500/10', icon: 'text-amber-600 dark:text-amber-400', glow: 'from-amber-400 via-amber-500 to-orange-500', bar: 'bg-amber-500' },
        slate:  { bg: 'bg-slate-100 dark:bg-slate-700/40', icon: 'text-slate-600 dark:text-slate-300', glow: 'from-slate-400 via-slate-500 to-gray-500', bar: 'bg-slate-500' },
    };
    const a = accents[accent] ?? accents.blue;

    const [visible, setVisible] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const divRef = React.useRef(null);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const bounds = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    };

    if (image) {
        return (
            <div
                ref={divRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                className="group relative overflow-hidden rounded-2xl p-0.5 bg-gray-200 dark:bg-slate-800 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
                {visible && (
                    <div
                        className={`pointer-events-none blur-xl bg-gradient-to-r ${a.glow} size-60 absolute z-0 transition-opacity duration-300`}
                        style={{ top: position.y - 120, left: position.x - 120 }}
                    />
                )}

                <div className="relative z-10 h-full w-full rounded-[14px] overflow-hidden bg-white dark:bg-slate-900 p-5 min-h-[210px]">
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <div className="text-[24px] font-semibold text-slate-800 dark:text-slate-100 tracking-tight">{label}</div>
                            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{note}</div>
                        </div>
                    </div>

                    <div className="relative z-0 mt-2 px-2">
                        <div className="text-4xl font-bold text-green-500 dark:text-white">{value}</div>
                        {trend !== undefined && (
                            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                <span className={`${trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'} font-semibold`}>
                                    {trend >= 0 ? '+' : '-'}{Math.abs(trend)}%
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="pointer-events-none absolute -right-4 -bottom-4 w-[94%] z-0 dark:opacity-65">
                        <img src={image} alt={label} className="h-auto w-full object-contain" />
                    </div>

                    <div className={`absolute bottom-0 left-0 h-0.5 w-full ${a.bar} opacity-40`} />
                </div>
            </div>
        );
    }

    return (
        <div 
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            className={`group relative overflow-hidden rounded-2xl p-0.5 bg-gray-200 dark:bg-slate-800 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
        >
            {visible && (
                <div className={`pointer-events-none blur-xl bg-gradient-to-r ${a.glow} size-60 absolute z-0 transition-opacity duration-300`}
                    style={{ top: position.y - 120, left: position.x - 120 }}
                />
            )}
            
            <div className="relative z-10 h-full w-full rounded-[14px] overflow-hidden bg-white dark:bg-slate-900 p-5 flex flex-col justify-between flex-grow">
                {image && (
                    <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none overflow-hidden rounded-[14px]">
                        <img src={image} alt="" className="h-full w-full object-cover" />
                    </div>
                )}
                {/* Top row */}
            <div className="flex items-start justify-between relative z-10">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.bg}`}>
                    <svg className={`h-5 w-5 ${a.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon} />
                    </svg>
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${trend >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'}`}>
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={trend >= 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                        </svg>
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            {/* Value */}
            <div className="mt-4 font-['Outfit',sans-serif] text-3xl font-bold tracking-tight text-slate-900 dark:text-white relative z-10">
                {value}
            </div>

            {/* Label */}
            <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 relative z-10">
                {label}
            </div>

            {/* Note */}
            {note && (
                <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-500 dark:text-slate-400 relative z-10">
                    {note}
                </div>
            )}

            {/* Accent bar */}
            <div className={`absolute bottom-0 left-0 h-0.5 w-full ${a.bar} opacity-40`} />
            </div>
        </div>
    );
}

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

const statusConfig = {
    available:   { label: 'Available',   cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
    maintenance: { label: 'Maintenance', cls: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
    deployed:    { label: 'Deployed',    cls: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
    default:     { label: 'Unknown',     cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
};

function VehicleCard({ vehicle }) {
    const status = (vehicle.status || '').toLowerCase();
    const sc = statusConfig[status] ?? statusConfig.default;
    const title = [vehicle.name, vehicle.model].filter(Boolean).join(' ') || 'Vehicle Unit';
    const plate = vehicle.plate_num || vehicle.plate || 'N/A';
    const mileage = Number(vehicle.recent_mileage ?? 0).toFixed(0);
    const imageUrl = resolveVehicleImage(vehicle);

    return (
        <div className="flex items-center gap-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-3.5 transition hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm">
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700">
                <img src={imageUrl} alt="Vehicle" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">{title}</span>
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${sc.cls}`}>
                        {sc.label}
                    </span>
                </div>
                <div className="mt-0.5 text-xs text-slate-400 dark:text-slate-500 font-mono">{plate}</div>
                <div className="mt-2 flex gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        {mileage} km
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        In: {vehicle.present_in ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                        Out: {vehicle.present_out ?? 0}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── Activity Item ────────────────────────────────────────────────────────────

const toneStyles = {
    success: { dot: 'bg-emerald-500', icon: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    warning: { dot: 'bg-amber-500',   icon: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    info:    { dot: 'bg-blue-500',    icon: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
};

function ActivityItem({ item, isLast }) {
    const ts = toneStyles[item.tone] ?? toneStyles.info;
    return (
        <div className="relative flex gap-4">
            {/* Timeline line */}
            {!isLast && (
                <div className="absolute left-[18px] top-10 bottom-0 w-px bg-slate-100 dark:bg-slate-800" />
            )}

            {/* Icon */}
            <div className={`relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${ts.icon}`}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
                </svg>
            </div>

            {/* Content */}
            <div className="flex-1 pb-5">
                <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{item.title}</div>
                    <div className="flex-shrink-0 rounded-md bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 font-mono">
                        {item.time}
                    </div>
                </div>
                <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">{item.meta}</div>
            </div>
        </div>
    );
}

// ─── Utilization Bar ──────────────────────────────────────────────────────────

function UtilizationBar({ label, value, max, color }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    const colors = {
        blue:  'bg-blue-500',
        green: 'bg-emerald-500',
        amber: 'bg-amber-500',
        slate: 'bg-slate-400',
    };
    return (
        <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{value} <span className="text-slate-400 font-normal">/ {max}</span></span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                    className={`h-2 rounded-full ${colors[color] ?? colors.blue} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className="mt-1 text-right text-[10px] text-slate-400">{pct}%</div>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardIndex({ stats, vehicles, activities, serviceTrends }) {
    const { isDark } = useTheme();

    // Stats
    const s = stats ?? { total: 48, active: 32, maintenance: 7, available: 9 };
    const utilization = s.total ? Math.round((s.active / s.total) * 100) : 0;

    // Vehicles
    const vehicleData = vehicles?.length
        ? vehicles
        : [
            { id: 1, name: 'Toyota',     model: 'Hilux',    plate_num: 'ABC-1234', recent_mileage: 28.4, present_in: 4, present_out: 2, status: 'available' },
            { id: 2, name: 'Mitsubishi', model: 'L300',     plate_num: 'XYZ-5678', recent_mileage: 15.9, present_in: 3, present_out: 1, status: 'available' },
            { id: 3, name: 'Isuzu',      model: 'N-Series', plate_num: 'DEF-9012', recent_mileage: 22.1, present_in: 5, present_out: 3, status: 'maintenance' },
            { id: 4, name: 'Ford',       model: 'Ranger',   plate_num: 'GHI-3456', recent_mileage: 31.0, present_in: 2, present_out: 4, status: 'deployed' },
        ];

    // Chart data
    const trendLabels = serviceTrends?.labels?.length ? serviceTrends.labels : buildFallbackLabels();
    const buildSeries = (key) => trendLabels.map((_, i) => Number(serviceTrends?.[key]?.[i] ?? Math.floor(Math.random() * 18 + 4)));
    const maintenanceSeries = buildSeries('maintenance');
    const inspectionSeries  = buildSeries('inspection');
    const fuelSeries        = buildSeries('fuel');
    const totalMaintenance  = maintenanceSeries.reduce((a, b) => a + b, 0);
    const totalInspection   = inspectionSeries.reduce((a, b) => a + b, 0);
    const totalFuel         = fuelSeries.reduce((a, b) => a + b, 0);

    // Activities
    const activityFeed = activities?.length ? activities : [
        { title: 'Dispatch cleared',      meta: 'Toyota Hilux · ABC-1234',    time: '08:45 AM', tone: 'success', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { title: 'Vehicle returned',      meta: 'Isuzu N-Series · Gate A',    time: '09:20 AM', tone: 'info',    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { title: 'Maintenance approved',  meta: 'Ford Ranger · Service Bay 2',time: '10:05 AM', tone: 'warning', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
        { title: 'Route reassigned',      meta: 'Mitsubishi L300 · Warehouse', time: '10:45 AM', tone: 'info',   icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { title: 'Fuel refill completed', meta: 'Toyota Hilux · Pump 3',      time: '11:30 AM', tone: 'success', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM1 1h4l2.68 13.39a2 2 0 001.97 1.61h9.72a2 2 0 001.97-1.61L23 6H6' },
    ];

    // Chart options
    const chartColors   = isDark ? '#94a3b8' : '#64748b';
    const gridColor     = isDark ? 'rgba(148,163,184,0.1)' : 'rgba(148,163,184,0.2)';
    const tooltipTheme  = isDark ? 'dark' : 'light';

    const areaOptions = {
        chart: { type: 'area', toolbar: { show: false }, fontFamily: 'Outfit, sans-serif', background: 'transparent' },
        colors: ['#f59e0b', '#3b82f6', '#10b981'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { shade: 'light', type: 'vertical', opacityFrom: 0.4, opacityTo: 0.1 } },
        grid: { borderColor: gridColor, strokeDashArray: 4, xaxis: { lines: { show: false } } },
        xaxis: {
            categories: trendLabels,
            labels: { style: { colors: chartColors, fontSize: '11px', fontFamily: 'Outfit, sans-serif' } },
            axisBorder: { show: false }, axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: chartColors, fontSize: '11px', fontFamily: 'Outfit, sans-serif' },
                formatter: (value) => `₱${value.toFixed(0)}`
            }
        },
        legend: {
            position: 'top', horizontalAlign: 'left', fontSize: '12px', fontFamily: 'Outfit, sans-serif',
            labels: { colors: chartColors },
            markers: { size: 6, shape: 'circle' },
        },
        tooltip: {
            theme: tooltipTheme,
            y: { formatter: (value) => `₱${value.toFixed(2)}` }
        },
    };

    const areaSeries = [
        { name: 'Maintenance Costs', data: maintenanceSeries },
        { name: 'Inspection Costs',  data: inspectionSeries },
        { name: 'Fuel Costs',        data: fuelSeries },
    ];

    // Stat cards config
    const statCards = [
        {
            label: 'Vehicles',
            value: s.total,
            note: 'Total units in fleet',
            image: innovaImage,
        },
        {
            label: 'Fuel Expenses',
            value: `₱${totalFuel.toFixed(0)}`,
            note: 'Total fuel costs in 6 months',
            trend: 8,
            accent: 'green',
            icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM1 1h4l2.68 13.39a2 2 0 001.97 1.61h9.72a2 2 0 001.97-1.61L23 6H6',
        },
        {
            label: 'Available Units',
            value: s.available,
            note: 'Ready for dispatch now',
            trend: -2,
            accent: 'slate',
            icon: 'M5 13l4 4L19 7',
        },
        {
            label: 'Maintenance Queue',
            value: s.maintenance,
            note: 'Units pending service',
            trend: -5,
            accent: 'amber',
            icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        },
    ];

    return (
        <DashboardLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* ── Google Font ─────────────────────────────────────── */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');`}</style>

            <div className="space-y-6" style={{ fontFamily: "'Outfit', sans-serif" }}>



                {/* ── Stat Cards ───────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                    {statCards.map((card, i) => <StatCard key={i} {...card} />)}
                </div>

                {/* ── Chart + Fleet Utilization ────────────────────── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Bar Chart */}
                    <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Service & Fuel Costs</h2>
                                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Operational expenses · last 6 months</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: 'Maintenance', cost: totalMaintenance, cls: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
                                    { label: 'Inspection',  cost: totalInspection,  cls: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
                                    { label: 'Fuel',        cost: totalFuel,        cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
                                ].map(({ label, cost, cls }) => (
                                    <span key={label} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold ${cls}`}>
                                        {label}
                                        <span className="rounded-md bg-white/60 dark:bg-black/20 px-1">₱{cost.toFixed(0)}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <ReactApexChart options={areaOptions} series={areaSeries} type="area" height={248} />
                    </div>

                    {/* Fleet Utilization Summary */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">Fleet Utilization</h2>
                        <p className="mt-0.5 mb-6 text-xs text-slate-400 dark:text-slate-500">Current unit allocation across states</p>

                        <div className="space-y-5">
                            <UtilizationBar label="Active Routes"      value={s.active}      max={s.total} color="blue"  />
                            <UtilizationBar label="Available Units"    value={s.available}   max={s.total} color="green" />
                            <UtilizationBar label="Maintenance Queue"  value={s.maintenance} max={s.total} color="amber" />
                            <UtilizationBar label="Other / Offline"    value={Math.max(0, s.total - s.active - s.available - s.maintenance)} max={s.total} color="slate" />
                        </div>

                        {/* Donut-style summary */}
                        <div className="mt-6 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
                            <div className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-1">Overall Utilization</div>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-slate-900 dark:text-white">{utilization}%</span>
                                <span className="text-xs text-slate-400 dark:text-slate-500 mb-1">of fleet deployed</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                                <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700" style={{ width: `${utilization}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Vehicles + Activity ───────────────────────────── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Vehicle List */}
                    <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Vehicle Fleet</h2>
                                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">All registered units with live status</p>
                            </div>
                            <a
                                href="/vehicles"
                                className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                                View all
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </a>
                        </div>

                        {/* Status tab bar */}
                        <div className="flex gap-3 px-6 pt-4">
                            {['All', 'Available', 'Deployed', 'Maintenance'].map((tab, i) => (
                                <button key={tab} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${i === 0 ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-3 p-6 md:grid-cols-2">
                            {vehicleData.length ? (
                                vehicleData.map(v => <VehicleCard key={v.id || v.plate_num} vehicle={v} />)
                            ) : (
                                <div className="col-span-full rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">No vehicles found</div>
                                    <div className="mt-1 text-xs text-slate-400">All units are currently in use or scheduled for service.</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Activity Feed</h2>
                                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Live depot updates</p>
                            </div>
                            <span className="rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                                ● Live
                            </span>
                        </div>
                        <div className="px-6 py-5">
                            {activityFeed.map((item, i) => (
                                <ActivityItem key={i} item={item} isLast={i === activityFeed.length - 1} />
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-4">
                            <button className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                View full activity log
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Quick Stats Row ────────────────────────────────── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                        {
                            label: 'Total Distance Today',
                            value: `${vehicleData.reduce((sum, v) => sum + Number(v.recent_mileage ?? 0), 0).toFixed(0)} km`,
                            icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
                            badge: 'Routes',
                            color: 'text-blue-600 dark:text-blue-400',
                            badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
                        },
                        {
                            label: 'Service Events (6 mo)',
                            value: totalMaintenance + totalInspection,
                            icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
                            badge: 'Service',
                            color: 'text-amber-600 dark:text-amber-400',
                            badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
                        },
                        {
                            label: 'Fuel Costs (6 mo)',
                            value: `₱${totalFuel.toFixed(0)}`,
                            icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                            badge: 'Fuel',
                            color: 'text-emerald-600 dark:text-emerald-400',
                            badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
                        },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                            <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 ${item.color}`}>
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">{item.label}</div>
                                <div className="text-xl font-bold text-slate-900 dark:text-white">{item.value}</div>
                            </div>
                            <span className={`ml-auto flex-shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${item.badgeColor}`}>
                                {item.badge}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </DashboardLayout>
    );
}