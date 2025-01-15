import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FileText, Send, LayoutDashboard, LogOut } from 'lucide-react';

function Layout() {
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours in seconds
  
  useEffect(() => {
    // Check if there's already an expiration time in localStorage
    
   

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    window.location.href = '/login';
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-800">Document Manager</h1>
          </div>
          <nav className="mt-6">
            <Link
              to="/dashboard"
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                location.pathname === '/dashboard' ? 'bg-gray-100' : ''
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link
              to="/receipts"
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                location.pathname === '/receipts' ? 'bg-gray-100' : ''
              }`}
            >
              <FileText className="w-5 h-5 mr-3" />
              Receipts
            </Link>
            <Link
              to="/dispatches"
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                location.pathname === '/dispatches' ? 'bg-gray-100' : ''
              }`}
            >
              <Send className="w-5 h-5 mr-3" />
              Dispatches
            </Link>
          </nav>
          <div className="absolute bottom-0 w-64 p-6">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-red-600"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          <div style={{ textAlign: 'left', fontSize: '12px', margin: '10px 0', color: 'red' }}>
              Session expires in: {formatTime(timeLeft)}
          </div>
          <div>
             <label className="px-4 py-0 text-sm font-medium text-center text-white bg-indigo-200 border border-transparent rounded-md hover:bg-indigo-700">Developed by Z A Khan</label>
          </div>
          </div>

          </div>
        

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;