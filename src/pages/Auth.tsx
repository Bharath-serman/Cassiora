
import AuthForm from "@/components/AuthForm";
import { useUser } from "@/components/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { profile, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users back to home
    if (!loading && profile) {
      navigate("/");
    }
  }, [profile, loading, navigate]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <AuthForm />
    </div>
  );
}
