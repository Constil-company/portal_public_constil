import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar/navbar';
import Sidebar from './sidebar/sidebar';
import { useState } from 'react';

const NAVBAR_HEIGHT = 'h-[72px]';

const Layout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <header className={`fixed top-0 left-0 right-0 z-50 overflow-hidden ${NAVBAR_HEIGHT}`}>
        <Navbar isWelcomePage={false} onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      </header>

      <div className="flex flex-1 pt-[72px] overflow-hidden">
        {mobileSidebarOpen && (
          <div className="fixed top-[72px] left-0 right-0 bottom-0 z-40 xl:hidden bg-black/50 h-[calc(100vh-72px)]">
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        <aside className="hidden xl:block w-64 h-full bg-white overflow-hidden">
          <Sidebar />
        </aside>

        <main className="flex-1 h-full overflow-y-auto p-4 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
