import { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import ReactApexChart from 'react-apexcharts';

// ── Helpers ───────────────────────────────────────────────────
const fmt   = (n) => Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const TYPES = ['diesel', 'gasoline', 'premium'];

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon, label, value, unit, sub, color }) {
    const colors = {
        blue:   'bg-blue-500/10 text-blue-400',
        amber:  'bg-amber-500/10 text-amber-400',
        green:  'bg-emerald-500/10 text-emerald-400',
        red:    'bg-red-500/10 text-red-400',
    };
    return (
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white">
                {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{label}</div>
            {sub && <div className="text-xs text-slate-600 mt-0.5">{sub}</div>}
        </div>
    );
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ message, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
    return (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-slate-900 px-5 py-3 shadow-xl text-sm text-emerald-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {message}
            <button onClick={onClose} className="ml-2 text-slate-500 hover:text-white">✕</button>
        </div>
    );
}

// ── Shared Field Component ────────────────────────────────────
// Moved outside to prevent re-mounting and losing focus
const Field = ({ label, name, type = 'text', placeholder, data, setData, errors }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</label>
        <input 
            type={type} 
            value={data[name] ?? ''} 
            onChange={e => setData(name, e.target.value)}
            placeholder={placeholder}
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition" 
        />
        {errors[name] && <p className="text-xs text-red-400">{errors[name]}</p>}
    </div>
);

// ── Fuel Form Modal ───────────────────────────────────────────
function FuelModal({ show, onClose, editLog, vehicles }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        vehicle_id: '', 
        driver_id: '', 
        date: new Date().toISOString().slice(0, 10),
        odometer_reading: '', 
        liters: '', 
        price_per_liter: '', 
        fuel_type: 'diesel',
        station: '', 
        notes: '',
    });

    useEffect(() => {
        if (!show) reset();
    }, [show]);

    useEffect(() => {
        if (editLog && show) {
            setData({
                vehicle_id:       editLog.vehicle_id ?? '',
                driver_id:        editLog.driver_id ?? '',
                date:             editLog.date ?? '',
                odometer_reading: editLog.odometer_reading ?? '',
                liters:           editLog.liters ?? '',
                price_per_liter:  editLog.price_per_liter ?? '',
                fuel_type:        editLog.fuel_type ?? 'diesel',
                station:          editLog.station ?? '',
                notes:            editLog.notes ?? '',
            });
        }
    }, [editLog, show]);

    if (!show) return null;

    const totalCost = (parseFloat(data.liters) || 0) * (parseFloat(data.price_per_liter) || 0);

    const submit = (e) => {
        e.preventDefault();
        const opts = { 
            preserveScroll: true,
            onSuccess: () => {
                if (!editLog) reset();
                onClose();
            }
        };
        editLog ? put(route('fuel.update', editLog.id), opts)
                : post(route('fuel.store'), opts);
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                    <div>
                        <h2 className="text-base font-semibold text-white">
                            {editLog ? 'Edit Fuel Log' : 'Add Fuel Log'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Record a fuel fill-up</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Vehicle</label>
                        <select value={data.vehicle_id} onChange={e => setData('vehicle_id', e.target.value)}
                            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/60 transition">
                            <option value="">Select vehicle</option>
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.plate_num} — {v.name} {v.model}
                                </option>
                            ))}
                        </select>
                        {errors.vehicle_id && <p className="text-xs text-red-400">{errors.vehicle_id}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Date" name="date" type="date" data={data} setData={setData} errors={errors} />
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Fuel Type</label>
                            <select value={data.fuel_type} onChange={e => setData('fuel_type', e.target.value)}
                                className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/60 transition">
                                {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                            </select>
                        </div>
                        <Field label="Odometer Reading (km)" name="odometer_reading" type="number" placeholder="e.g. 45200" data={data} setData={setData} errors={errors} />
                        <Field label="Liters Filled" name="liters" type="number" placeholder="e.g. 40.5" data={data} setData={setData} errors={errors} />
                        <Field label="Price per Liter (₱)" name="price_per_liter" type="number" placeholder="e.g. 60.50" data={data} setData={setData} errors={errors} />
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Total Cost</label>
                            <div className="rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2 text-sm text-cyan-400 font-semibold">
                                ₱{fmt(totalCost)}
                            </div>
                        </div>
                    </div>

                    <Field label="Gas Station" name="station" placeholder="e.g. Petron EDSA" data={data} setData={setData} errors={errors} />
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Notes</label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)}
                            rows={2} placeholder="Optional notes..."
                            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition resize-none" />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-white/10 text-sm text-slate-400 hover:text-white transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing}
                            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold text-sm hover:opacity-90 transition disabled:opacity-50">
                            {processing ? 'Saving…' : (editLog ? 'Update Log' : 'Add Log')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Restock Modal ─────────────────────────────────────────────
function RestockModal({ show, onClose, fuelStock }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        liters: '', price_per_liter: '',
    });

    useEffect(() => {
        if (!show) reset();
    }, [show]);

    if (!show || !fuelStock) return null;

    const totalCost = (parseFloat(data.liters) || 0) * (parseFloat(data.price_per_liter) || 0);

    const submit = (e) => {
        e.preventDefault();
        post(route('fuel-stocks.restock', fuelStock.id), {
            onSuccess: onClose,
            preserveScroll: true,
        });
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                    <div>
                        <h2 className="text-base font-semibold text-white">
                            Restock {fuelStock.fuel_type.charAt(0).toUpperCase() + fuelStock.fuel_type.slice(1)}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Add fuel to inventory</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Liters to Add</label>
                        <input type="number" step="0.01" value={data.liters} onChange={e => setData('liters', e.target.value)}
                            placeholder="e.g. 500.00"
                            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition" />
                        {errors.liters && <p className="text-xs text-red-400">{errors.liters}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Price per Liter (₱)</label>
                        <input type="number" step="0.01" value={data.price_per_liter} onChange={e => setData('price_per_liter', e.target.value)}
                            placeholder="e.g. 55.00"
                            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition" />
                        {errors.price_per_liter && <p className="text-xs text-red-400">{errors.price_per_liter}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Total Cost</label>
                        <div className="rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2 text-sm text-cyan-400 font-semibold">
                            ₱{fmt(totalCost)}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-white/10 text-sm text-slate-400 hover:text-white transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing}
                            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold text-sm hover:opacity-90 transition disabled:opacity-50">
                            {processing ? 'Restocking…' : 'Restock'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function FuelIndex({ logs, vehicles, filters, stats, monthly, vehicle_efficiency, fleet_avg_eff, fuel_stocks }) {
    const { flash } = usePage().props;
    const [toast, setToast]       = useState(null);
    const [modal, setModal]       = useState(false);
    const [editLog, setEditLog]   = useState(null);
    const [restockModal, setRestockModal] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [vehicleId, setVehicleId] = useState(filters?.vehicle_id ?? '');
    const [fuelType, setFuelType] = useState(filters?.fuel_type ?? '');
    const [from, setFrom]         = useState(filters?.from ?? '');
    const [to, setTo]             = useState(filters?.to ?? '');

    useEffect(() => { if (flash?.success) setToast(flash.success); }, [flash]);

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(route('fuel.index'), { vehicle_id: vehicleId, fuel_type: fuelType, from, to }, {
                preserveState: true, replace: true,
            });
        }, 400);
        return () => clearTimeout(t);
    }, [vehicleId, fuelType, from, to]);

    const handleDelete = (log) => {
        if (!confirm(`Delete fuel log for ${log.vehicle?.plate_num} on ${log.date}?`)) return;
        router.delete(route('fuel.destroy', log.id), { preserveScroll: true });
    };

    // ── Chart configs ─────────────────────────────────────────
    const months     = monthly.map(m => m.month);
    const litersData = monthly.map(m => parseFloat(m.total_liters).toFixed(1));
    const costData   = monthly.map(m => parseFloat(m.total_cost).toFixed(2));
    const effData    = monthly.map(m => parseFloat(m.avg_efficiency || 0).toFixed(2));

    const barOpts = {
        chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
        colors: ['#06b6d4', '#10b981'],
        plotOptions: { bar: { borderRadius: 4, columnWidth: '50%', grouped: true } },
        dataLabels: { enabled: false },
        xaxis: { categories: months, labels: { style: { colors: '#475569', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: [
            { labels: { style: { colors: '#475569', fontSize: '11px' }, formatter: v => `${v}L` } },
            { opposite: true, labels: { style: { colors: '#475569', fontSize: '11px' }, formatter: v => `₱${v}` } },
        ],
        grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
        legend: { labels: { colors: '#94a3b8' } },
        tooltip: { theme: 'dark' },
    };

    const lineOpts = {
        chart: { type: 'line', background: 'transparent', toolbar: { show: false } },
        colors: ['#f59e0b'],
        stroke: { curve: 'smooth', width: 2.5 },
        markers: { size: 4 },
        dataLabels: { enabled: false },
        xaxis: { categories: months, labels: { style: { colors: '#475569', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { colors: '#475569', fontSize: '11px' }, formatter: v => `${v} km/L` } },
        grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
        annotations: {
            yaxis: [{
                y: fleet_avg_eff,
                borderColor: '#ef4444',
                strokeDashArray: 4,
                label: { text: `Fleet avg: ${fleet_avg_eff} km/L`, style: { color: '#ef4444', background: 'transparent', fontSize: '10px' } },
            }],
        },
        tooltip: { theme: 'dark' },
    };

    const fuelTypeCount  = ['diesel', 'gasoline', 'premium'].map(t => logs.data.filter(l => l.fuel_type === t).length);
    const donutOpts = {
        chart: { type: 'donut', background: 'transparent' },
        colors: ['#06b6d4', '#10b981', '#f59e0b'],
        labels: ['Diesel', 'Gasoline', 'Premium'],
        dataLabels: { enabled: false },
        legend: { position: 'bottom', labels: { colors: '#94a3b8' } },
        stroke: { colors: ['#0f172a'] },
        tooltip: { theme: 'dark' },
    };

    const fuelTypeStyle = {
        diesel:   'bg-cyan-500/10 text-cyan-400',
        gasoline: 'bg-emerald-500/10 text-emerald-400',
        premium:  'bg-amber-500/10 text-amber-400',
    };

    return (
        <DashboardLayout title="Fuel Management">
            <Head title="Fuel Management" />
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
            <FuelModal
                show={modal}
                onClose={() => { setModal(false); setEditLog(null); }}
                editLog={editLog}
                vehicles={vehicles}
            />
            <RestockModal
                show={restockModal}
                onClose={() => { setRestockModal(false); setSelectedStock(null); }}
                fuelStock={selectedStock}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold text-white">Fuel Management</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Track consumption, costs and efficiency</p>
                </div>
                <button onClick={() => setModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold text-sm hover:opacity-90 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Log Fill-up
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard color="blue" label="Total Liters"
                    value={fmt(stats.total_liters)} unit="L"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>}
                />
                <StatCard color="amber" label="Total Fuel Cost"
                    value={`₱${fmt(stats.total_cost)}`} unit=""
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                />
                <StatCard color="green" label="Avg Efficiency"
                    value={stats.avg_efficiency} unit="km/L"
                    sub="fleet average"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>}
                />
                <StatCard color="red" label="Avg Cost / km"
                    value={`₱${stats.avg_cost_per_km}`} unit="/km"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>}
                />
            </div>

            {/* Fuel Stocks */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 mb-6">
                <h2 className="text-sm font-semibold text-white mb-3">Fuel Stocks</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {fuel_stocks.map(stock => (
                        <div key={stock.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${fuelTypeStyle[stock.fuel_type]}`}>
                                    {stock.fuel_type}
                                </span>
                                {stock.is_low && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 font-semibold">
                                        Low Stock
                                    </span>
                                )}
                            </div>
                            <div className="text-lg font-bold text-white mb-1">
                                {fmt(stock.current_stock)} L
                            </div>
                            <div className="text-xs text-slate-500 mb-2">
                                Threshold: {fmt(stock.threshold)} L
                            </div>
                            {stock.restock_cost_to_threshold && (
                                <div className="text-xs text-slate-400 mb-2">
                                    Restock to {fmt(stock.threshold * 2)}L: ₱{fmt(stock.restock_cost_to_threshold)}
                                </div>
                            )}
                            <button onClick={() => { setSelectedStock(stock); setRestockModal(true); }}
                                className="w-full px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold text-xs hover:opacity-90 transition">
                                Restock
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                    <h2 className="text-sm font-semibold text-white mb-1">Monthly Fuel Usage & Cost</h2>
                    <p className="text-xs text-slate-500 mb-3">Liters consumed vs total spend — last 6 months</p>
                    <ReactApexChart options={barOpts}
                        series={[{ name: 'Liters', data: litersData }, { name: 'Cost (₱)', data: costData }]}
                        type="bar" height={220} />
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                    <h2 className="text-sm font-semibold text-white mb-1">Fuel Type Breakdown</h2>
                    <p className="text-xs text-slate-500 mb-2">Fill-ups by fuel type</p>
                    <ReactApexChart options={donutOpts} series={fuelTypeCount} type="donut" height={240} />
                </div>
            </div>

            {/* Efficiency Trend & Per-Vehicle Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                    <h2 className="text-sm font-semibold text-white mb-1">Fleet Efficiency Trend</h2>
                    <p className="text-xs text-slate-500 mb-3">Average km/L per month — red line = fleet average</p>
                    <ReactApexChart options={lineOpts}
                        series={[{ name: 'Efficiency (km/L)', data: effData }]}
                        type="line" height={200} />
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                    <h2 className="text-sm font-semibold text-white mb-1">Per-Vehicle Efficiency</h2>
                    <p className="text-xs text-slate-500 mb-3">
                        Fleet avg: <span className="text-amber-400 font-semibold">{fleet_avg_eff} km/L</span>
                    </p>
                    <div className="space-y-2 overflow-y-auto max-h-48">
                        {vehicle_efficiency.map((v, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <span className="text-slate-400 truncate max-w-28">{v.vehicle}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-semibold">{v.avg_eff} km/L</span>
                                    {v.is_low && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 font-semibold">
                                            Low
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                <select value={vehicleId} onChange={e => setVehicleId(e.target.value)}
                    className="px-3 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:border-cyan-500/50 transition">
                    <option value="">All vehicles</option>
                    {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.plate_num} — {v.name}</option>
                    ))}
                </select>
                <select value={fuelType} onChange={e => setFuelType(e.target.value)}
                    className="px-3 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:border-cyan-500/50 transition">
                    <option value="">All fuel types</option>
                    {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
                <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                    className="px-3 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:border-cyan-500/50 transition" />
                <input type="date" value={to} onChange={e => setTo(e.target.value)}
                    className="px-3 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:border-cyan-500/50 transition" />
            </div>

            {/* Fuel Log Table */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['Date', 'Vehicle', 'Fuel Type', 'Liters', 'Price/L', 'Total Cost', 'Odometer', 'km Driven', 'Efficiency', 'Station', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {logs.data.length === 0 ? (
                                <tr><td colSpan={11} className="text-center py-12 text-slate-500 text-sm">
                                    No fuel logs found. Log your first fill-up!
                                </td></tr>
                            ) : logs.data.map(log => (
                                <tr key={log.id} className="hover:bg-white/[0.02] transition group">
                                    <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{log.date}</td>
                                    <td className="px-4 py-3 font-semibold text-cyan-300 whitespace-nowrap">
                                        {log.vehicle?.plate_num}
                                        <span className="text-slate-500 font-normal ml-1">{log.vehicle?.name}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${fuelTypeStyle[log.fuel_type]}`}>
                                            {log.fuel_type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">{fmt(log.liters)} L</td>
                                    <td className="px-4 py-3 text-slate-400">₱{fmt(log.price_per_liter)}</td>
                                    <td className="px-4 py-3 text-amber-400 font-semibold">₱{fmt(log.total_cost)}</td>
                                    <td className="px-4 py-3 text-slate-400">{fmt(log.odometer_reading)} km</td>
                                    <td className="px-4 py-3 text-slate-400">
                                        {log.km_driven ? `${fmt(log.km_driven)} km` : <span className="text-slate-600">—</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        {log.efficiency ? (
                                            <span className={`font-semibold ${parseFloat(log.efficiency) < fleet_avg_eff * 0.85 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {log.efficiency} km/L
                                                {parseFloat(log.efficiency) < fleet_avg_eff * 0.85 && (
                                                    <span className="ml-1 text-[10px] text-red-400">↓ low</span>
                                                )}
                                            </span>
                                        ) : <span className="text-slate-600">—</span>}
                                    </td>
                                    <td className="px-4 py-3 text-slate-400">{log.station || '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition">
                                            <button onClick={() => { setEditLog(log); setModal(true); }}
                                                className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition" title="Edit">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                </svg>
                                            </button>
                                            <button onClick={() => handleDelete(log)}
                                                className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition" title="Delete">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
                        <p className="text-xs text-slate-500">
                            Showing {logs.from}–{logs.to} of {logs.total} records
                        </p>
                        <div className="flex gap-1.5">
                            {logs.links.map((link, i) => (
                                <button key={i}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition ${link.active ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'border border-white/10 text-slate-400 hover:text-white disabled:opacity-30'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}