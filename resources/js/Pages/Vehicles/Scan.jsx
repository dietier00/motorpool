import { Head } from '@inertiajs/react';

const statusStyle = {
    active:      { bg: '#d1fae5', color: '#065f46', label: 'Active' },
    maintenance: { bg: '#fef3c7', color: '#92400e', label: 'In Maintenance' },
    available:   { bg: '#cffafe', color: '#155e75', label: 'Available' },
};

function InfoRow({ label, value, highlight }) {
    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0', borderBottom: '1px solid #f1f5f9'
        }}>
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</span>
            <span style={{
                fontSize: 14, color: highlight ? '#0e7490' : '#1e293b',
                fontWeight: highlight ? 700 : 500, letterSpacing: highlight ? '0.05em' : 0
            }}>{value || '—'}</span>
        </div>
    );
}

export default function VehicleScan({ vehicle }) {
    const status = statusStyle[vehicle.status] ?? statusStyle.available;
    const printPage = () => window.print();

    return (
        <>
            <Head title={`${vehicle.plate_number} — Vehicle Info`} />

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { margin: 0; }
                    .card { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
                }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            `}</style>

            <div style={{
                minHeight: '100vh', background: '#f8fafc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px 16px'
            }}>
                <div className="card" style={{
                    background: '#fff', borderRadius: 20, width: '100%', maxWidth: 440,
                    boxShadow: '0 4px 32px rgba(0,0,0,0.10)', overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        padding: '28px 24px', textAlign: 'center'
                    }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 52, height: 52, borderRadius: 14,
                            background: 'rgba(6,182,212,0.15)', marginBottom: 14
                        }}>
                            <svg width="26" height="26" fill="none" stroke="#22d3ee" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"/>
                            </svg>
                        </div>
                        <div style={{
                            fontSize: 26, fontWeight: 700, color: '#fff',
                            letterSpacing: '0.08em', marginBottom: 6
                        }}>
                            {vehicle.plate_number}
                        </div>
                        <div style={{ fontSize: 14, color: '#94a3b8' }}>
                            {vehicle.make} {vehicle.model} · {vehicle.year}
                        </div>
                        <div style={{ marginTop: 14 }}>
                            <span style={{
                                display: 'inline-block', background: status.bg, color: status.color,
                                fontSize: 12, fontWeight: 600, padding: '4px 14px',
                                borderRadius: 20, letterSpacing: '0.04em'
                            }}>
                                {status.label}
                            </span>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div style={{ padding: '20px 24px' }}>
                        <div style={{
                            fontSize: 10, fontWeight: 600, color: '#94a3b8',
                            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4
                        }}>
                            Vehicle Information
                        </div>

                        <InfoRow label="Plate No."    value={vehicle.plate_number} highlight />
                        <InfoRow label="Make / Model" value={`${vehicle.make} ${vehicle.model}`} />
                        <InfoRow label="Year"         value={vehicle.year} />
                        <InfoRow label="Color"        value={vehicle.color} />
                        <InfoRow label="Type"         value={vehicle.type} />
                        <InfoRow label="Owner"        value={vehicle.owner_name} />
                        <InfoRow label="Driver"       value={vehicle.driver} />

                        <div style={{
                            fontSize: 10, fontWeight: 600, color: '#94a3b8',
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            marginTop: 20, marginBottom: 4
                        }}>
                            Odometer & Mileage
                        </div>

                        <InfoRow label="Odometer In"  value={vehicle.odometer_in ? `${Number(vehicle.odometer_in).toLocaleString()} km` : null} />
                        <InfoRow label="Odometer Out" value={vehicle.odometer_out ? `${Number(vehicle.odometer_out).toLocaleString()} km` : null} />
                        <InfoRow label="Total Mileage" value={vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString()} km` : null} />
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '16px 24px', borderTop: '1px solid #f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>
                            SCPA Motor Pool · Fleet Operations
                        </div>
                        <button
                            onClick={printPage}
                            className="no-print"
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                background: '#0f172a', color: '#22d3ee',
                                border: 'none', borderRadius: 8, padding: '8px 14px',
                                fontSize: 12, fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                            </svg>
                            Print / Save PDF
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}