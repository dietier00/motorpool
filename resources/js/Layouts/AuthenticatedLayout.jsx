import DashboardLayout from './DashboardLayout';

export default function AuthenticatedLayout({ header, children }) {
    let title = 'Dashboard';
    if (header && header.props && header.props.children) {
        title = header.props.children;
    } else if (typeof header === 'string') {
        title = header;
    }

    return (
        <DashboardLayout title={title}>
            {children}
        </DashboardLayout>
    );
}
