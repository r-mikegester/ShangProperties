import React, { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', background: '#222', color: '#fff', padding: '2rem 1rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Admin Panel</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem' }}><a href="/admin/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</a></li>
            <li style={{ marginBottom: '1rem' }}><a href="/admin/users" style={{ color: '#fff', textDecoration: 'none' }}>Users</a></li>
            <li style={{ marginBottom: '1rem' }}><a href="/admin/settings" style={{ color: '#fff', textDecoration: 'none' }}>Settings</a></li>
            {/* Add more links as needed */}
          </ul>
        </nav>
      </aside>
      {/* Main Content Area with Navbar */}
      <main style={{ flex: 1, background: '#f4f4f4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <nav style={{ height: '64px', background: '#fff', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', padding: '0 2rem', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Admin Navbar</div>
          {/* Add navbar actions or user menu here */}
          <div>
            {/* Example: <button>Logout</button> */}
          </div>
        </nav>
        {/* Content below navbar */}
        <div style={{ flex: 1, padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
