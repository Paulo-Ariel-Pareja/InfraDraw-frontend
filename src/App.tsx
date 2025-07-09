import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import PublicLayout from "@/components/PublicLayout";
import LoginForm from "@/components/LoginForm";
import Dashboard from "@/pages/Dashboard";
import Components from "@/pages/Components";
import Editor from "@/pages/Editor";
import Boards from "@/pages/Boards";
import PublicBoards from "@/pages/PublicBoards";
import PublicSequenceDiagrams from "@/pages/PublicSequenceDiagrams";
import PublicSequenceDiagram from "@/pages/PublicSequenceDiagram";
import Users from "@/pages/Users";
import SequenceDiagrams from "@/pages/SequenceDiagrams";
import SequenceEditor from "@/pages/SequenceEditor";
import NotFound from "@/pages/NotFound";
import PublicDiagram from "./pages/PublicDiagram";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/components"
        element={
          <ProtectedRoute>
            <Components />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editor"
        element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editor/:id"
        element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/boards"
        element={
          <ProtectedRoute>
            <Boards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sequence-diagrams"
        element={
          <ProtectedRoute>
            <SequenceDiagrams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sequence-editor"
        element={
          <ProtectedRoute>
            <SequenceEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sequence-editor/:id"
        element={
          <ProtectedRoute>
            <SequenceEditor />
          </ProtectedRoute>
        }
      />

      {/* Ruta pública para tableros públicos */}
      <Route
        path="/public"
        element={
          <PublicLayout>
            <PublicBoards />
          </PublicLayout>
        }
      />

      {/* Ruta pública para diagramas de secuencia públicos */}
      <Route
        path="/public-sequences"
        element={
          <PublicLayout>
            <PublicSequenceDiagrams />
          </PublicLayout>
        }
      />

      <Route path="/public-diagram/:id" element={<PublicDiagram />} />
      <Route path="/public-sequence/:id" element={<PublicSequenceDiagram />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
