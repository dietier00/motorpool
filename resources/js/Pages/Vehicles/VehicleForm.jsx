import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';

const STATUSES = ['active', 'maintenance', 'available'];

export default function VehicleForm({ 
    show = false, 
    vehicle = null, 
    drivers = [],
    onClose = () => {},
    onSuccess = () => {}
}) {
    const isEditing = !!vehicle;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        plate_num: vehicle?.plate_num ?? '',
        name: vehicle?.name ?? '',
        model: vehicle?.model ?? '',
        year: vehicle?.year ? String(vehicle.year) : '',
        status: vehicle?.status ?? 'active',
        driver_id: vehicle?.driver_id ?? '',
        present_in: vehicle?.present_in ?? '',
        present_out: vehicle?.present_out ?? '',
    });

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!show) {
            reset();
        }
    }, [show]);

    // Update form data when editing vehicle changes
    useEffect(() => {
        if (vehicle && show) {
            setData({
                plate_num: vehicle.plate_num ?? '',
                name: vehicle.name ?? '',
                model: vehicle.model ?? '',
                year: vehicle.year ? String(vehicle.year) : '',
                status: vehicle.status ?? 'active',
                driver_id: vehicle.driver_id ?? '',
                present_in: vehicle.present_in ?? '',
                present_out: vehicle.present_out ?? '',
            });
        }
    }, [vehicle, show]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route('vehicles.update', vehicle.id), {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    onSuccess();
                },
            });
        } else {
            post(route('vehicles.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                    onSuccess();
                },
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Plate Number */}
                    <div>
                        <InputLabel htmlFor="plate_num" value="Plate Number" />
                        <TextInput
                            id="plate_num"
                            type="text"
                            value={data.plate_num}
                            onChange={(e) => setData('plate_num', e.target.value)}
                            placeholder="e.g., ABC-1234"
                            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/5 text-slate-600 dark:text-slate-300 placeholder-slate-600 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-0 transition"
                            isFocused={!isEditing}
                        />
                        <InputError message={errors.plate_num} className="mt-1" />
                    </div>

                    {/* Vehicle Name */}
                    <div>
                        <InputLabel htmlFor="name" value="Vehicle Name" />
                        <TextInput
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g., Toyota, Isuzu"
                            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/5 text-slate-600 dark:text-slate-300 placeholder-slate-600 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-0 transition"
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    {/* Model */}
                    <div>
                        <InputLabel htmlFor="model" value="Model" />
                        <TextInput
                            id="model"
                            type="text"
                            value={data.model}
                            onChange={(e) => setData('model', e.target.value)}
                            placeholder="e.g., Innova, Traviz,"
                            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/5 text-slate-600 dark:text-slate-300 placeholder-slate-600 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-0 transition"
                        />
                        <InputError message={errors.model} className="mt-1" />
                    </div>

                    {/* Year & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="year" value="Year" />
                            <TextInput
                                id="year"
                                type="number"
                                value={data.year}
                                onChange={(e) => setData('year', e.target.value)}
                                placeholder="2024"
                                min="1990"
                                max={new Date().getFullYear() + 1}
                                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/5 text-slate-600 dark:text-slate-300 placeholder-slate-600 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-0 transition"
                            />
                            <InputError message={errors.year} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="status" value="Status" />
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/5 text-slate-600 dark:text-slate-300 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-0 transition"
                            >
                                {STATUSES.map(s => (
                                    <option key={s} value={s}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.status} className="mt-1" />
                        </div>
                    </div>

                    {/* Driver Assignment */}
                    <div>
                        <InputLabel htmlFor="driver_id" value="Assign Driver" />
                        <select
                            id="driver_id"
                            value={data.driver_id}
                            onChange={(e) => setData('driver_id', e.target.value)}
                            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/5 text-slate-600 dark:text-slate-300 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-0 transition"
                        >
                            <option value="">None</option>
                            {drivers.map(driver => (
                                <option key={driver.id} value={driver.id}>
                                    {driver.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.driver_id} className="mt-1" />
                    </div>

                    {/* Odometer - Present In & Out */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="present_in" value="Odometer - In" />
                            <TextInput
                                id="present_in"
                                type="number"
                                value={data.present_in}
                                onChange={(e) => setData('present_in', e.target.value)}
                                placeholder="0"
                                min="0"
                                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/5 text-slate-600 dark:text-slate-300 placeholder-slate-600 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-0 transition"
                            />
                            <InputError message={errors.present_in} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="present_out" value="Odometer - Out" />
                            <TextInput
                                id="present_out"
                                type="number"
                                value={data.present_out}
                                onChange={(e) => setData('present_out', e.target.value)}
                                placeholder="0"
                                min="0"
                                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/5 text-slate-600 dark:text-slate-300 placeholder-slate-600 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-0 transition"
                            />
                            <InputError message={errors.present_out} className="mt-1" />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-200/70 dark:border-white/10">
                        <SecondaryButton
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2"
                        >
                            {processing && (
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            )}
                            {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
