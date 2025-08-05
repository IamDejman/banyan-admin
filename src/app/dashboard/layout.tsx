'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { BanyanLogo } from '@/components/ui/banyan-logo';
import { Menu, LogOut, X, AlertTriangle } from 'lucide-react';
import cookie from '../utils/cookie';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const adminName = JSON.parse(cookie().getCookie('userData') || '{}')?.first_name + ' ' + JSON.parse(cookie().getCookie('userData') || '{}')?.last_name;

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');

    // Clear any user data
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');

    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('registrationData');
    cookie().deleteCookie('token');
    cookie().deleteCookie('user');

    // Close modal and redirect to login page
    setShowLogoutModal(false);
    router.push('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    const token = cookie().getCookie('token');
    // const userData = cookie().getCookie('userData');
    // console.log(token, "token__11");
    // console.log(JSON.parse(userData || '{}'), "userData__");

    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <nav className="w-full h-14 flex items-center justify-between bg-white border-b px-4 fixed top-0 left-0 z-50">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen && isMobile ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <BanyanLogo size={32} className="text-primary" />
            <span className="font-bold text-lg tracking-tight">Banyan Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="font-medium text-sm hidden sm:block">{adminName}</span>
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={handleLogoutClick}
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${isSidebarOpen
          ? 'w-64'
          : isMobile
            ? 'w-0'
            : 'w-20'
          } flex-shrink-0 relative`}>
          <Sidebar collapsed={!isSidebarOpen} />
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <main className="p-4 sm:p-6" onClick={closeSidebar}>{children}</main>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Confirm Logout</h3>
                <p className="text-sm text-muted-foreground">Are you sure you want to logout?</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={cancelLogout}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex-1 sm:flex-none"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 