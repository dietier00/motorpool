import { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DriverForm from '@/Components/DriverForm';
import DeleteConfirmation from '@/Components/DeleteConfirmation';
import DriverCard from '@/Components/DriverCard';

const STATUS_OPTIONS = [
    { value: 'available', label: 'Available', color: 'green' },
    { value: 'on_trip', label: 'On Trip', color: 'blue' },
    { value: 'off_duty', label: 'Off Duty', color: 'gray' },
    { value: 'inactive', label: 'Inactive', color: 'red' },
];

export default function Drivers() {
    const { drivers, filters } = usePage().props;
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [searchValue, setSearchValue] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        
        const params = {};
        if (value) params.search = value;
        if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
        
        router.get(route('drivers.index'), params, { preserveState: true });
    };

    const handleStatusFilter = (e) => {
        const value = e.target.value;
        setStatusFilter(value);
        
        const params = {};
        if (searchValue) params.search = searchValue;
        if (value && value !== 'all') params.status = value;
        
        router.get(route('drivers.index'), params, { preserveState: true });
    };

    const handleOpenAddForm = () => {
        setSelectedDriver(null);
        setShowAddForm(true);
    };

    const handleOpenEditForm = (driver) => {
        setSelectedDriver(driver);
        setShowEditForm(true);
    };

    const handleFormClose = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setSelectedDriver(null);
    };

    const handleOpenDeleteConfirm = (driver) => {
        setSelectedDriver(driver);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        setIsLoading(true);
        router.delete(route('drivers.destroy', selectedDriver.id), {
            onFinish: () => {
                setIsLoading(false);
                setShowDeleteConfirm(false);
                setSelectedDriver(null);
            },
        });
    };

    const getStatusColor = (status) => {
        const statusOption = STATUS_OPTIONS.find(s => s.value === status);
        const colorMap = {
            green: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/30',
            blue: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30',
            gray: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
            red: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30',
        };
        return colorMap[statusOption?.color] || colorMap.gray;
    };

    const getStatusLabel = (status) => {
        const statusOption = STATUS_OPTIONS.find(s => s.value === status);
        return statusOption?.label || status;
    };

    const totalDrivers = drivers.meta?.total || drivers.data?.length || 0;

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-slate-100 leading-tight">Drivers</h2>}
        >
            <Head title="Drivers" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-5">
                    
                    {/* Header with Search and Add Button */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            {/* Search Bar */}
                            <div className="flex bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-white/10 p-1 flex-1 sm:flex-none">
                                <input 
                                    type="text" 
                                    placeholder="Search drivers..." 
                                    value={searchValue}
                                    onChange={handleSearch}
                                    className="border-0 focus:ring-0 text-sm px-3 bg-transparent w-full min-w-[200px] outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                                />
                                <button className="bg-gray-50 text-gray-500 px-3 rounded-md hover:bg-gray-100 transition-colors dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Status Filter */}
                            <select 
                                value={statusFilter}
                                onChange={handleStatusFilter}
                                className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                <option value="all">All Statuses</option>
                                {STATUS_OPTIONS.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button 
                            onClick={handleOpenAddForm}
                            className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                        >
                            + Add Driver
                        </button>
                    </div>

                    {/* Drivers Grid */}
                    {drivers.data && drivers.data.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {drivers.data.map(driver => (
                                <DriverCard 
                                    key={driver.id} 
                                    driver={driver} 
                                    getStatusColor={getStatusColor}
                                    getStatusLabel={getStatusLabel}
                                    handleOpenEditForm={handleOpenEditForm}
                                    handleOpenDeleteConfirm={handleOpenDeleteConfirm}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2h2v-2a11 11 0 00-22 0v2h2v-2z" />
                            </svg>
                            <p className="mt-4 text-gray-500 dark:text-slate-400">No drivers found</p>
                            {(searchValue || statusFilter !== 'all') && (
                                <button 
                                    onClick={() => {
                                        setSearchValue('');
                                        setStatusFilter('all');
                                        router.get(route('drivers.index'), {}, { preserveState: true });
                                    }}
                                    className="mt-4 text-cyan-600 hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200 text-sm font-medium"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {drivers.links && drivers.links.length > 3 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {drivers.links.map((link, index) => (
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-cyan-600 text-white dark:bg-cyan-500'
                                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span 
                                        key={index}
                                        className="px-3 py-2 text-gray-400 dark:text-slate-500 text-sm"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Driver Form Modal */}
            <DriverForm
                isOpen={showAddForm}
                onClose={handleFormClose}
                driver={null}
                title="Add New Driver"
            />

            {/* Edit Driver Form Modal */}
            {selectedDriver && (
                <DriverForm
                    isOpen={showEditForm}
                    onClose={handleFormClose}
                    driver={selectedDriver}
                    title="Edit Driver"
                />
            )}

            {/* Delete Confirmation Modal */}
            {selectedDriver && (
                <DeleteConfirmation
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Driver"
                    message={`Are you sure you want to delete ${selectedDriver.name}? This action cannot be undone.`}
                    isLoading={isLoading}
                />
            )}
        </AuthenticatedLayout>
    );
}