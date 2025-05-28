// components/NavigationBar.tsx

import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router';

const NavigationBar: React.FC = () => {
  return (
    <nav className="w-full px-8 py-4 bg-white border rounded-full sticky mt-8">
      <div className="flex items-center justify-between mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          <span className="sr-only">Ditto</span>
          {/* Replace with your logo image if needed */}
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </Link>

        {/* Navigation Links and Login/Get Started - Combined and Moved Left */}
        <div className="flex items-center space-x-4 justify-center">
          <div className="hidden space-x-8 lg:flex px-8">
            <Link to="/app/agents/explore" className="text-gray-700 hover:text-black">
              Agents
            </Link>
            <Link to="/app/dashboard" className="text-gray-700 hover:text-black">
              Dashboards
            </Link>
            <Link to="/app/home/dashboard" className="text-gray-700 hover:text-black">
              Platform {/*Replaced Solutions with Platform to match image*/}
            </Link>
            <Link to="/" className="text-gray-700 hover:text-black">
              Company {/*Added Company to match image*/}
            </Link>
            <Link to="/" className="text-gray-700 hover:text-black">
              Resources
            </Link>
            <Link to="/" className="text-gray-700 hover:text-black">
              Docs
            </Link>
          </div>

          {/* Login/Get Started - Now closer to the links */}
          <Link to="/signin" className="text-gray-700 hover:text-black">
            Log In
          </Link>
          <Button asChild>
            <Link to="/app/home/dashboard">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;