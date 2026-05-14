import React, { useState, useRef } from 'react';

const DriverCard = ({ driver, getStatusColor, getStatusLabel, handleOpenEditForm, handleOpenDeleteConfirm }) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const divRef = useRef(null);

    const handleMouseMove = (e) => {
        const bounds = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    };

    return (
        <div 
            ref={divRef} 
            onMouseMove={handleMouseMove} 
            onMouseEnter={() => setVisible(true)} 
            onMouseLeave={() => setVisible(false)}
            className="relative w-full h-[28rem] rounded-xl p-0.5 bg-gray-200 dark:bg-slate-800 backdrop-blur-md overflow-hidden shadow-lg cursor-pointer transition-transform hover:-translate-y-1"
        >
            {visible && (
                <div className="pointer-events-none blur-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 size-60 absolute z-0 transition-opacity duration-300"
                    style={{ top: position.y - 120, left: position.x - 120 }}
                />
            )}

            <div className="relative z-10 bg-white dark:bg-slate-900 p-6 h-full w-full rounded-[8px] flex flex-col items-center flex-grow text-center">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(driver.status)}`}>
                        {getStatusLabel(driver.status)}
                    </span>
                </div>

                {/* Profile Avatar */}
                {driver.image ? (
                    <img 
                        src={`/storage/${driver.image}`} 
                        alt={`${driver.name}'s profile`} 
                        className="w-24 h-24 rounded-full shadow-md my-4 mt-8 object-cover border-2 border-white dark:border-slate-800" 
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300 flex items-center justify-center font-bold text-4xl shadow-md my-4 mt-8">
                        {driver.name.charAt(0).toUpperCase()}
                    </div>
                )}
                
                {/* Driver Info */}
                <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-1">{driver.name}</h2>
                <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium mb-4">{driver.license_number}</p>
                
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 px-4">
                    Phone: <a href={`tel:${driver.cp_number}`} className="hover:text-cyan-600 dark:hover:text-cyan-300">{driver.cp_number}</a><br/>
                    Joined Since {new Date(driver.created_at).toLocaleDateString()}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full mt-auto pt-4 border-t border-gray-100 dark:border-white/10">
                    <button 
                        onClick={() => handleOpenEditForm(driver)}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold py-2 rounded-lg transition-colors border border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => handleOpenDeleteConfirm(driver)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold py-2 rounded-lg transition-colors border border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30 dark:hover:bg-red-500/20"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DriverCard;
