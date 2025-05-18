
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, User, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-brand-blue">Garinhca.com</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-brand-blue transition-colors">Home</Link>
            <Link to="/tenders" className="font-medium hover:text-brand-blue transition-colors">Tenders</Link>
            <Link to="/about" className="font-medium hover:text-brand-blue transition-colors">About</Link>
            <Link to="/contact" className="font-medium hover:text-brand-blue transition-colors">Contact</Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User size={18} />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Link to="/dashboard" className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  {user?.role === 'tender_poster' && (
                    <DropdownMenuItem>
                      <Link to="/post-tender" className="w-full">Post Tender</Link>
                    </DropdownMenuItem>
                  )}
                  {(user?.role === 'admin' || user?.role === 'super_admin') && (
                    <DropdownMenuItem>
                      <Link to="/admin" className="w-full">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link to="/login" className="flex items-center gap-2">
                    <LogIn size={18} />
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3">
            <Link to="/" className="block py-2 hover:text-brand-blue">Home</Link>
            <Link to="/tenders" className="block py-2 hover:text-brand-blue">Tenders</Link>
            <Link to="/about" className="block py-2 hover:text-brand-blue">About</Link>
            <Link to="/contact" className="block py-2 hover:text-brand-blue">Contact</Link>
            
            <div className="pt-2 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link to="/dashboard" className="block py-2 hover:text-brand-blue">Dashboard</Link>
                  <Link to="/profile" className="block py-2 hover:text-brand-blue">Profile</Link>
                  {user?.role === 'tender_poster' && (
                    <Link to="/post-tender" className="block py-2 hover:text-brand-blue">Post Tender</Link>
                  )}
                  {(user?.role === 'admin' || user?.role === 'super_admin') && (
                    <Link to="/admin" className="block py-2 hover:text-brand-blue">Admin Panel</Link>
                  )}
                  <Button variant="outline" className="w-full" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
