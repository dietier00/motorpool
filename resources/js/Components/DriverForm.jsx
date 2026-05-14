import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';

const STATUS_OPTIONS = [
    { value: 'available', label: 'Available' },
    { value: 'on_trip', label: 'On Trip' },
    { value: 'off_duty', label: 'Off Duty' },
    { value: 'inactive', label: 'Inactive' },
];

export default function DriverForm({ isOpen, onClose, driver, title }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: driver?.name || '',
        license_number: driver?.license_number || '',
        cp_number: driver?.cp_number || '',
        status: driver?.status || 'available',
        image: null,
        _method: driver ? 'put' : 'post',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (driver) {
            post(route('drivers.update', driver.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('drivers.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 rounded-lg shadow-lg max-w-md w-full">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Driver Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            placeholder="John Doe"
                        />
                        {errors.name && (
                            <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* License Number Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            License Number
                        </label>
                        <input
                            type="text"
                            value={data.license_number}
                            onChange={(e) => setData('license_number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            placeholder="DL-123456"
                        />
                        {errors.license_number && (
                            <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.license_number}</p>
                        )}
                    </div>

                    {/* Phone Number Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={data.cp_number}
                            onChange={(e) => setData('cp_number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            placeholder="+1 234-567-8901"
                        />
                        {errors.cp_number && (
                            <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.cp_number}</p>
                        )}
                    </div>

                    {/* Status Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Status
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                            {STATUS_OPTIONS.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        {errors.status && (
                            <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.status}</p>
                        )}
                    </div>

                    {/* Image Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('image', e.target.files[0])}
                            className="w-full px-3 py-2 border border-gray-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                        {errors.image && (
                            <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.image}</p>
                        )}
                        {driver?.image && !data.image && (
                            <p className="text-xs text-gray-500 mt-2">Current image will be kept if no new image is selected.</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 px-4 py-2 text-white bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Saving...' : driver ? 'Update Driver' : 'Add Driver'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
