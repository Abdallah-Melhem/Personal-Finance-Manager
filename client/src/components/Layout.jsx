import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main">
        {/* Sticky Topbar */}
        <Topbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        {/* Page Body */}
        <main className="flex-grow-1 p-3 p-md-4 fade-in">
          {children}
        </main>

        {/* Modern Dark Footer */}
        <footer className="app-footer text-center">
          <div className="container-fluid">
            <span>FinanceFlow &copy; {new Date().getFullYear()} — Abdallah Melhem</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
