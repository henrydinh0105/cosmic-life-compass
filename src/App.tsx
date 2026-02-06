import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import Loading from "./pages/Loading";
import Results from "./pages/Results";
import TuViDemo from "./pages/TuViDemo";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import EmailSubscribers from "./pages/admin/EmailSubscribers";
import QuizAnalytics from "./pages/admin/QuizAnalytics";
import UserRoles from "./pages/admin/UserRoles";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/results" element={<Results />} />
            <Route path="/tuvi" element={<TuViDemo />} />
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/subscribers" element={<EmailSubscribers />} />
            <Route path="/admin/analytics" element={<QuizAnalytics />} />
            <Route path="/admin/roles" element={<UserRoles />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
