import React, { useState, useRef } from 'react';

const StatsCard = ({ title, value, note, trend, accent, icon }) => {
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
            className="relative w-full h-full rounded-xl p-0.5 bg-gray-200 dark:bg-slate-800 backdrop-blur-md overflow-hidden shadow-lg cursor-pointer transition-transform hover:-translate-y-1"
        >
            {visible && (
                <div className={`pointer-events-none blur-xl bg-gradient-to-r from-${accent}-400 via-${accent}-500 to-${accent}-600 size-60 absolute z-0 transition-opacity duration-300`}
                    style={{ top: position.y - 120, left: position.x - 120 }}
                />
            )}
            <div className="relative z-0 bg-white dark:bg-slate-900 p-4 h-full w-full rounded-[8px] flex flex-col justify-between">
            {/* Card Status Badge*/}
                <div className="absolute top-4 right-2">
                    <span className={'px-2.5.py-1.rounded-lg.text-xs'}>
                        
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
