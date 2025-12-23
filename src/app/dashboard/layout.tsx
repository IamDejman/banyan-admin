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
  const [adminName, setAdminName] = useState<string>('');


  // Handle mobile and tablet detection
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      // Mobile: < 768px, Tablet: 768px - 1024px, Desktop: > 1024px
      const isMobileOrTablet = width < 1024;
      setIsMobile(isMobileOrTablet);
      
      if (width >= 1024) {
        // Desktop: sidebar always open
        setIsSidebarOpen(true);
      } else {
        // Mobile/Tablet: sidebar closed by default
        setIsSidebarOpen(false);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobile, isSidebarOpen]);

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
    const userData = cookie().getCookie('userData');
    // console.log(token, "token__11");
    // console.log(JSON.parse(userData || '{}'), "userData__");
    setAdminName(JSON.parse(userData || '{}')?.first_name + ' ' + JSON.parse(userData || '{}')?.last_name);

    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <nav className="w-full h-14 flex items-center justify-between bg-white border-b px-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button - visible on mobile and tablet */}
          <button
            className="p-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation lg:hidden"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
          
          {/* Desktop Sidebar Toggle - only visible on desktop */}
          <button
            className="hidden lg:block p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={isSidebarOpen}
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          <div className="flex items-center gap-2">
            <BanyanLogo size={32} className="text-primary" />
            <span className="font-bold text-lg tracking-tight hidden sm:inline">Banyan Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="font-medium text-sm hidden sm:block">{adminName}</span>
          <button
            className="p-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
            onClick={handleLogoutClick}
            aria-label="Logout"
          >
            <LogOut size={20} className="text-gray-700" />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 pt-14 relative">
        {/* Desktop Sidebar - always visible on desktop */}
        <div className={`hidden lg:block transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } flex-shrink-0 relative`}>
          <Sidebar collapsed={!isSidebarOpen} />
        </div>

        {/* Mobile/Tablet Sidebar - slide-out drawer */}
        {isMobile && (
          <>
            {/* Overlay */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
                onClick={closeSidebar}
                aria-hidden="true"
              />
            )}

            {/* Drawer */}
            <div
              className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden pt-14 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <Sidebar collapsed={false} onItemClick={closeSidebar} />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0 w-full">
          <main 
            className="p-4 sm:p-6 h-full overflow-y-auto" 
            onClick={isMobile ? closeSidebar : undefined}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
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
                className="flex-1 sm:flex-none text-white"
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