import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, Home, Boxes, Presentation, FolderOpen, Globe, Users, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const publicNavigation = [
    { name: 'Tableros Públicos', href: '/public', icon: Globe },
  ];

  const authenticatedNavigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Componentes', href: '/components', icon: Boxes },
    { name: 'Editor', href: '/editor', icon: Presentation },
    { name: 'Mis Tableros', href: '/boards', icon: FolderOpen },
    { name: 'Usuarios', href: '/users', icon: Users },
    { name: 'Tableros Públicos', href: '/public', icon: Globe },
  ];

  const navigation = user ? authenticatedNavigation : publicNavigation;
  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to={user ? "/" : "/public"}>
                <h1 className="text-xl font-bold text-primary cursor-pointer">
                  InfraDraw
                </h1>
              </Link>
              
              <nav className="hidden md:flex space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{user.username}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </Button>
                </>
              ) : (
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;