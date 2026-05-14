import { useEffect, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const STATUS_OPTIONS = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' },
];

const STATUS_BADGES = {
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300',
    in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-300',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-300',
};

const formatDate = (value) => {
    if (!value) {
        return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
};

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') {
        return '—';
    }
    const number = Number(value);
    if (Number.isNaN(number)) {
        return value;
    }
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2,
    }).format(number);
};

const normalizeDateInput = (value) => {
    if (!value) {
        return '';
    }
    if (typeof value === 'string') {
        return value.slice(0, 10);
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    return date.toISOString().slice(0, 10);
};

function MaintenanceForm({ show, onClose = () => {}, record, vehicles = [], onSuccess = () => {} }) {
    const isEditing = !!record;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        vehicle_id: record?.vehicle_id ?? '',
        service_type: record?.service_type ?? '',
        service_date: normalizeDateInput(record?.service_date),
        status: record?.status ?? 'scheduled',
        mechanic: record?.mechanic ?? '',
        cost: record?.cost ?? '',
        next_due_date: normalizeDateInput(record?.next_due_date),
    });

    useEffect(() => {
        if (!show) {
            reset();
        }
    }, [show, reset]);

    useEffect(() => {
        if (record && show) {
            setData({
                vehicle_id: record.vehicle_id ?? '',
                service_type: record.service_type ?? '',
                service_date: normalizeDateInput(record.service_date),
                status: record.status ?? 'scheduled',
                mechanic: record.mechanic ?? '',
                cost: record.cost ?? '',
                next_due_date: normalizeDateInput(record.next_due_date),
            });
        }
    }, [record, show, setData]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const action = isEditing ? put : post;
        const routeName = isEditing
            ? route('maintenance.update', record.id)
            : route('maintenance.store');

        action(routeName, {
            preserveScroll: true,
            onSuccess: () => {
                if (!isEditing) {
                    reset();
                }
                onSuccess();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {isEditing ? 'Edit Maintenance' : 'Schedule Maintenance'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Log service work and keep vehicle status in sync.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <InputLabel value="Vehicle" />
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                            value={data.vehicle_id}
                            onChange={(event) => setData('vehicle_id', event.target.value)}
                        >
                            <option value="">Select vehicle</option>
                            {vehicles.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.id}>
                                    {vehicle.name} {vehicle.model} ({vehicle.plate_num})
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.vehicle_id} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel value="Service Type" />
                        <TextInput
                            className="mt-1 block w-full"
                            value={data.service_type}
                            onChange={(event) => setData('service_type', event.target.value)}
                            placeholder="Oil Change"
                        />
                        <InputError message={errors.service_type} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel value="Service Date" />
                        <TextInput
                            type="date"
                            className="mt-1 block w-full"
                            value={data.service_date}
                            onChange={(event) => setData('service_date', event.target.value)}
                        />
                        <InputError message={errors.service_date} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel value="Status" />
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                            value={data.status}
                            onChange={(event) => setData('status', event.target.value)}
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.status} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel value="Mechanic or Shop" />
                        <TextInput
                            className="mt-1 block w-full"
                            value={data.mechanic}
                            onChange={(event) => setData('mechanic', event.target.value)}
                            placeholder="AutoFix Pro"
                        />
                        <InputError message={errors.mechanic} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel value="Cost" />
                        <TextInput
                            type="number"
                            step="0.01"
                            min="0"
                            className="mt-1 block w-full"
                            value={data.cost}
                            onChange={(event) => setData('cost', event.target.value)}
                            placeholder="0.00"
                        />
                        <InputError message={errors.cost} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel value="Next Due Date (optional)" />
                        <TextInput
                            type="date"
                            className="mt-1 block w-full"
                            value={data.next_due_date}
                            onChange={(event) => setData('next_due_date', event.target.value)}
                        />
                        <InputError message={errors.next_due_date} className="mt-1" />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 dark:border-white/10 dark:text-slate-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 rounded-lg bg-cyan-600 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:opacity-50 dark:bg-cyan-500 dark:hover:bg-cyan-400"
                    >
                        {processing ? 'Saving...' : 'Save Maintenance'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function DeleteConfirmModal({ target, onClose, onConfirm, isLoading }) {
    return (
        <Modal show={!!target} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-500/10 rounded-full mb-4">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 text-center">Delete maintenance record?</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center">
                    This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end mt-6">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-slate-600 hover:text-slate-900 hover:border-gray-300 transition disabled:opacity-50 dark:border-white/10 dark:text-slate-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default function Maintenance() {
    const { vehicles = [], records = [] } = usePage().props;
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    const recordMap = useMemo(() => {
        return records.reduce((acc, record) => {
            acc[record.id] = record;
            return acc;
        }, {});
    }, [records]);

    const logs = useMemo(() => {
        return records.map((record) => {
            const vehicleLabel = record.vehicle
                ? `${record.vehicle.name} ${record.vehicle.model} (${record.vehicle.plate_num})`
                : record.vehicle_id
                    ? `Vehicle #${record.vehicle_id}`
                    : 'Unknown vehicle';

            return {
                id: record.id,
                vehicle: vehicleLabel,
                type: record.service_type ?? 'Service',
                date: record.service_date,
                mechanic: record.mechanic ?? '—',
                cost: record.cost,
                status: record.status ?? 'scheduled',
                nextDue: record.next_due_date,
            };
        });
    }, [records]);

    const filteredLogs = logs.filter((log) => {
        if (statusFilter === 'all') {
            return true;
        }
        return log.status === statusFilter;
    });

    const nextMaintenance = useMemo(() => {
        const upcoming = records
            .filter((record) => record.service_date && record.status !== 'completed')
            .map((record) => ({
                ...record,
                parsedDate: new Date(record.service_date),
            }))
            .filter((record) => !Number.isNaN(record.parsedDate.getTime()))
            .sort((a, b) => a.parsedDate - b.parsedDate);

        return upcoming[0] ?? null;
    }, [records]);

    const dueInfo = useMemo(() => {
        if (!nextMaintenance?.service_date) {
            return {
                label: 'No upcoming maintenance',
                className: 'text-slate-600 bg-slate-100 dark:bg-white/10 dark:text-slate-300',
            };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(nextMaintenance.service_date);
        dueDate.setHours(0, 0, 0, 0);

        const diffDays = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            return {
                label: 'Due today',
                className: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-300',
            };
        }

        if (diffDays > 0) {
            return {
                label: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`,
                className: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-300',
            };
        }

        const overdueDays = Math.abs(diffDays);
        return {
            label: `Overdue by ${overdueDays} day${overdueDays === 1 ? '' : 's'}`,
            className: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-300',
        };
    }, [nextMaintenance]);

    const handleCreate = () => {
        setEditingRecord(null);
        setIsFormOpen(true);
    };

    const handleEdit = (recordId) => {
        setEditingRecord(recordMap[recordId] ?? null);
        setIsFormOpen(true);
    };

    const handleDelete = (recordId) => {
        setDeleteTarget(recordMap[recordId] ?? null);
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }
        setIsDeleting(true);
        router.delete(route('maintenance.destroy', deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    const nextVehicleLabel = nextMaintenance?.vehicle
        ? `${nextMaintenance.vehicle.name} ${nextMaintenance.vehicle.model} (${nextMaintenance.vehicle.plate_num})`
        : nextMaintenance?.vehicle_id
            ? `Vehicle #${nextMaintenance.vehicle_id}`
            : 'No upcoming';

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-slate-100 leading-tight">Maintenance Logs</h2>}
        >
            <Head title="Maintenance" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">Next Scheduled Maintenance</h3>
                            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{nextVehicleLabel}</p>
                            <div className={`mt-3 flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md w-fit ${dueInfo.className}`}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {dueInfo.label}
                            </div>
                            {nextMaintenance?.service_type ? (
                                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    Service: {nextMaintenance.service_type}
                                </div>
                            ) : null}
                        </div>
                        <button
                            onClick={handleCreate}
                            className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            Schedule Service
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-white/10">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-slate-900/60 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-slate-100">Recent Service Records</h3>
                            <div className="flex gap-2 text-sm">
                                <select
                                    value={statusFilter}
                                    onChange={(event) => setStatusFilter(event.target.value)}
                                    className="border-gray-200 rounded-md text-gray-600 text-sm focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                >
                                    <option value="all">All Statuses</option>
                                    {STATUS_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
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
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Next Due</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-100 dark:divide-white/10">
                                    {filteredLogs.length ? (
                                        filteredLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/60 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{formatDate(log.date)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{log.vehicle}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-slate-300">{log.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{log.mechanic}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{formatCurrency(log.cost)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{formatDate(log.nextDue)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_BADGES[log.status] ?? STATUS_BADGES.scheduled}`}>
                                                        {STATUS_OPTIONS.find((option) => option.value === log.status)?.label ?? log.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    <button
                                                        onClick={() => handleEdit(log.id)}
                                                        className="text-cyan-600 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200 font-semibold mr-3"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(log.id)}
                                                        className="text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200 font-semibold"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-slate-400">
                                                No maintenance records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <MaintenanceForm
                show={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                record={editingRecord}
                vehicles={vehicles}
                onSuccess={() => setEditingRecord(null)}
            />

            <DeleteConfirmModal
                target={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
            />
        </AuthenticatedLayout>
    );
}