import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsPage from "./pages/Terms";
import PrivacyPage from "./pages/Privacy";
import FaqPage from "./pages/Faq";
import RolesPage from "./pages/Roles";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/components/UserContext";
import Auth from "./pages/Auth";
import Test from "./pages/Test";
import ActivityPage from "./pages/Activity";
import NotepadPage from "./pages/Notepad";
import DSAVisualizerPage from "./pages/DSAVisualizer";
import CommunicationTest from "./pages/CommunicationTest";
import HrQuestionsPage from "./pages/HrQuestionsPage";
import MockInterviewPage from "./pages/MockInterviewPage"; // Import the new page
import InterviewSpeakingPractice from "./components/InterviewSpeakingPractice";
import { ThemeProvider } from "next-themes";
import { LoadingProvider } from "@/contexts/LoadingContext";
import LoadingOverlay from "@/components/LoadingOverlay";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <UserProvider>
          <LoadingProvider>
            <BrowserRouter>
              <LoadingOverlay />
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/test" element={<Test />} />
                <Route path="/activity" element={<ActivityPage />} />
                <Route path="/notepad" element={<NotepadPage />} />
                <Route path="/dsa-visualizer" element={<DSAVisualizerPage />} />
                <Route path="/communication-test" element={<CommunicationTest />} />
                <Route path="/hr-prep" element={<HrQuestionsPage />} />
                <Route path="/mock-interview" element={<MockInterviewPage />} />
                <Route path="/interview-speaking-practice" element={<InterviewSpeakingPractice />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/faq" element={<FaqPage />} />
        <Route path="/roles" element={<RolesPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LoadingProvider>
        </UserProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
