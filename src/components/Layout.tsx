import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  User,
  Home,
  Boxes,
  Presentation,
  FolderOpen,
  Globe,
  Users,
  GitBranch,
  GitBranchPlus,
  FileDigit,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Componentes", href: "/components", icon: Boxes },
    { name: "Editor de Tableros", href: "/editor", icon: Presentation },
    { name: "Mis Tableros", href: "/boards", icon: FolderOpen },
    {
      name: "Editor de Diagramas",
      href: "/sequence-editor",
      icon: GitBranchPlus,
    },
    {
      name: "Mis Diagramas de Secuencia",
      href: "/sequence-diagrams",
      icon: FileDigit,
    },
    { name: "Tableros Públicos", href: "/public", icon: Globe },
    { name: "Diagramas Públicos", href: "/public-sequences", icon: GitBranch },
    { name: "Usuarios", href: "/users", icon: Users },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-primary">InfraDraw</h1>

              {user && (
                <nav className="hidden md:flex space-x-4">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>

            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user.username}</span>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </div>
            )}
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

export default Layout;
