import { useState, useEffect, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import Modal from '@/Components/Modal';
import VehicleForm from './VehicleForm';
import { QRCodeSVG } from 'qrcode.react';

const STATUSES = ['active', 'maintenance', 'available'];

const statusStyle = {
    active:      'bg-emerald-500/10 text-emerald-400',
    maintenance: 'bg-amber-500/10 text-amber-400',
    available:   'bg-cyan-500/10 text-cyan-400',
};

const skeletonRows = Array.from({ length: 6 });

// ── Toast Component ──────────────────────────────────────────
function Toast({ message, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-white dark:bg-slate-900 px-5 py-3 shadow-xl text-sm text-emerald-400 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {message}
            <button onClick={onClose} className="ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>
    );
}

// ── Skeleton Bar ─────────────────────────────────────────────
function SkeletonBar({ className = '' }) {
    return (
        <div className={`h-3 rounded-full bg-gradient-to-r from-white/5 via-white/20 to-white/5 bg-[length:200%_100%] animate-shimmer ${className}`} />
    );
}

// ── Vehicle Details Modal ───────────────────────────────────
function VehicleDetailsModal({ vehicle, onClose }) {
    if (!vehicle) return null;

    const statusText = (vehicle.status ?? 'available').charAt(0).toUpperCase() + (vehicle.status ?? 'available').slice(1);
    const driverName = vehicle.driver?.name ?? vehicle.driver ?? '—';
    const mileageText = vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString()} km` : '—';
    const odometerIn = vehicle.present_in ? `${Number(vehicle.present_in).toLocaleString()} km` : '—';
    const odometerOut = vehicle.present_out ? `${Number(vehicle.present_out).toLocaleString()} km` : '—';

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">

                <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Vehicle Information</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {vehicle.plate_num} — {vehicle.name} {vehicle.model}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition text-lg leading-none"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-6 py-6 space-y-5">
                    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-emerald-500/10 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">Fleet Unit</p>
                                <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{vehicle.plate_num}</h3>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{vehicle.name} {vehicle.model}</p>
                            </div>
                            <span className="inline-flex w-fit items-center rounded-full border border-slate-200/70 dark:border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                                {statusText}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <DetailCard label="Plate Number" value={vehicle.plate_num} tone="cyan" />
                        <DetailCard label="Vehicle Name" value={`${vehicle.name} ${vehicle.model}`} />
                        <DetailCard label="Year" value={vehicle.year} />
                        <DetailCard label="Status" value={statusText} tone="emerald" />
                        <DetailCard label="Driver" value={driverName} tone="amber" />
                        <DetailCard label="Mileage" value={mileageText} />
                        <DetailCard label="Odometer In" value={odometerIn} />
                        <DetailCard label="Odometer Out" value={odometerOut} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-slate-200/70 dark:border-white/10 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-white/20 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Delete Confirmation Modal ─────────────────────────────────
function DeleteConfirmModal({ target, onClose, onConfirm, isLoading }) {
    return (
        <Modal show={!!target} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-500/10 rounded-full mb-4">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white text-center">Delete vehicle?</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400 text-center">
                    {target?.plate_num} — {target?.name} {target?.model}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 text-center">
                    This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end mt-6">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg border border-slate-200/70 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-white/20 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                        )}
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
}

function QRModal({ vehicle, onClose }) {
    if (!vehicle) return null;

    const qrUrl = `${window.location.origin}/vehicle/${vehicle.id}/scan`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">

                <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">QR Code</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {vehicle.plate_num} — {vehicle.name} {vehicle.model}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition text-lg leading-none"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-6 py-6 flex flex-col items-center gap-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-200/50">
                        <QRCodeSVG value={qrUrl} size={200} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                        Scan this QR code to view vehicle information
                    </p>
                    <div className="text-xs text-slate-400 dark:text-slate-500 break-all text-center">
                        {qrUrl}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main Vehicles Page ────────────────────────────────────────
export default function VehiclesIndex({ vehicles, drivers, filters }) {
    const { flash } = usePage().props;
    const [toast, setToast]               = useState(null);
    const [modalOpen, setModalOpen]       = useState(false);
    const [editVehicle, setEditVehicle]   = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting]     = useState(false);
    const [search, setSearch]             = useState(filters?.search ?? '');
    const [status, setStatus]             = useState(filters?.status ?? '');
    const [isLoading, setIsLoading]       = useState(false);
    const [isBooting, setIsBooting]       = useState(true);
    const [qrTarget, setQrTarget]         = useState(null);  // ✅ QR target state
    const didMount = useRef(false);

    // Flash messages → toast
    useEffect(() => {
        if (flash?.success) setToast(flash.success);
    }, [flash]);

    // Boot skeleton delay
    useEffect(() => {
        const t = setTimeout(() => setIsBooting(false), 200);
        return () => clearTimeout(t);
    }, []);

    // Inertia navigation loading state
    useEffect(() => {
        const removeStart = router.on('start', (e) => {
            if (e?.detail?.visit?.method === 'get') setIsLoading(true);
        });
        const removeFinish = router.on('finish', (e) => {
            if (e?.detail?.visit?.method === 'get') setIsLoading(false);
        });
        return () => { removeStart(); removeFinish(); };
    }, []);

    // Debounced search / status filter
    useEffect(() => {
        if (!didMount.current) { didMount.current = true; return; }
        const t = setTimeout(() => {
            router.get(route('vehicles.index'), { search, status }, {
                preserveState: true, replace: true, preserveScroll: true,
            });
        }, 350);
        return () => clearTimeout(t);
    }, [search, status]);

    const showSkeleton    = isBooting || isLoading;
    const vehicleRows     = vehicles?.data ?? [];
    const paginationLinks = vehicles?.links ?? [];

    const openAdd    = ()  => { setEditVehicle(null); setModalOpen(true); };
    const openEdit   = (v) => { setEditVehicle(v); setModalOpen(true); };
    const closeModal = ()  => { setModalOpen(false); setEditVehicle(null); };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        router.delete(route('vehicles.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => { setDeleteTarget(null); setIsDeleting(false); },
            onError:   () => { setIsDeleting(false); },
        });
    };

    const handleFormSuccess = () => setToast('Vehicle saved successfully!');

    // TABLE HEADERS — 9 columns total
    const TABLE_HEADERS = [
        'Plate No.', 'Name / Model', 'Year', 'Driver',
        'Mileage', 'Odometer In', 'Odometer Out', 'Status', 'Actions',
    ];

    return (
        <DashboardLayout title="Vehicles">
            <Head title="Vehicles" />

            {/* ── Toast ── */}
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}

            {/* ── Modals ── */}
            <VehicleForm
                show={modalOpen}
                vehicle={editVehicle}
                drivers={drivers}
                onClose={closeModal}
                onSuccess={handleFormSuccess}
            />
            <DeleteConfirmModal
                target={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
            />

            <QRModal
                vehicle={qrTarget}
                onClose={() => setQrTarget(null)}
            />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Vehicles</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {vehicles?.total ?? 0} total vehicles in fleet
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold text-sm hover:from-cyan-400 hover:to-emerald-400 transition"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Vehicle
                </button>
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative flex-1 min-w-48">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 dark:text-slate-400"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search plate, name, model..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white/5 border border-slate-200/70 dark:border-white/10 text-slate-600 dark:text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition"
                    />
                </div>
                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="px-3 py-2.5 text-sm rounded-xl bg-white/5 border border-slate-200/70 dark:border-white/10 text-slate-600 dark:text-slate-300 focus:outline-none focus:border-cyan-500/50 transition"
                >
                    <option value="">All statuses</option>
                    {STATUSES.map(s => (
                        <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* ── Table ── */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                {TABLE_HEADERS.map(h => (
                                    <th key={h}
                                        className="text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">

                            {/* Skeleton rows */}
                            {showSkeleton ? (
                                skeletonRows.map((_, i) => (
                                    <tr key={`sk-${i}`} className="animate-fade-in">
                                        <td className="px-4 py-3"><SkeletonBar className="w-24" /></td>
                                        <td className="px-4 py-3"><SkeletonBar className="w-40" /></td>
                                        <td className="px-4 py-3"><SkeletonBar className="w-12" /></td>
                                        <td className="px-4 py-3"><SkeletonBar className="w-32" /></td>
                                        <td className="px-4 py-3"><SkeletonBar className="w-20" /></td>
                                        <td className="px-4 py-3"><SkeletonBar className="w-20" /></td>
                                        <td className="px-4 py-3"><SkeletonBar className="w-20" /></td>
                                        <td className="px-4 py-3"><SkeletonBar className="w-16" /></td>
                                        <td className="px-4 py-3"><SkeletonBar className="w-20" /></td>
                                    </tr>
                                ))

                            /* Empty state */
                            ) : vehicleRows.length === 0 ? (
                                <tr>
                                    {/* ✅ colSpan fixed to 9 (matches TABLE_HEADERS length) */}
                                    <td colSpan={9} className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm">
                                        <svg className="w-10 h-10 mx-auto mb-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"/>
                                        </svg>
                                        No vehicles found. Try adjusting your filters.
                                    </td>
                                </tr>

                            /* Data rows */
                            ) : vehicleRows.map(v => (
                                <tr key={v.id} className="hover:bg-white/[0.02] transition group">

                                    {/* Plate No. */}
                                    <td className="px-4 py-3 font-semibold text-cyan-300 whitespace-nowrap">
                                        {v.plate_num}
                                    </td>

                                    {/* Name / Model */}
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                        {v.name} {v.model}
                                    </td>

                                    {/* Year */}
                                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 dark:text-slate-400">
                                        {v.year}
                                    </td>

                                    {/* Driver */}
                                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 dark:text-slate-400">
                                        {v.driver?.name ?? <span className="text-slate-600">—</span>}
                                    </td>

                                    {/* ✅ Mileage — was missing */}
                                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 dark:text-slate-400">
                                        {v.mileage
                                            ? <span>{Number(v.mileage).toLocaleString()} km</span>
                                            : <span className="text-slate-600">—</span>
                                        }
                                    </td>

                                    {/* Odometer In */}
                                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 dark:text-slate-400">
                                        {v.present_in
                                            ? <span>{Number(v.present_in).toLocaleString()} km</span>
                                            : <span className="text-slate-600">—</span>
                                        }
                                    </td>

                                    {/* Odometer Out */}
                                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 dark:text-slate-400">
                                        {v.present_out
                                            ? <span>{Number(v.present_out).toLocaleString()} km</span>
                                            : <span className="text-slate-600">—</span>
                                        }
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[v.status] ?? 'bg-slate-500/10 text-slate-500 dark:text-slate-400 dark:text-slate-400'}`}>
                                            {v.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition">

                                            {/* ✅ QR Code button — was missing */}
                                            <button
                                                onClick={() => setQrTarget(v)}
                                                className="p-1.5 rounded-lg border border-slate-200/70 dark:border-white/10 text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition"
                                                title="Generate QR Code"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                                                </svg>
                                            </button>

                                            {/* Edit button */}
                                            <button
                                                onClick={() => openEdit(v)}
                                                className="p-1.5 rounded-lg border border-slate-200/70 dark:border-white/10 text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition"
                                                title="Edit vehicle"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                </svg>
                                            </button>

                                            {/* Delete button */}
                                            <button
                                                onClick={() => setDeleteTarget(v)}
                                                className="p-1.5 rounded-lg border border-slate-200/70 dark:border-white/10 text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-red-400 hover:border-red-500/30 transition"
                                                title="Delete vehicle"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                </svg>
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                {(vehicles?.last_page ?? 0) > 1 && (
                    <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Showing {vehicles?.from ?? 0}–{vehicles?.to ?? 0} of {vehicles?.total ?? 0} vehicles
                        </p>
                        <div className="flex gap-1.5">
                            {paginationLinks.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url, {}, {
                                        preserveState: true, preserveScroll: true,
                                    })}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition
                                        ${link.active
                                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                            : 'border border-slate-200/70 dark:border-white/10 text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-white/20 disabled:opacity-30'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}