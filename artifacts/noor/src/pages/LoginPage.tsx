import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLogin } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login, isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const loginMutation = useLogin();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      void navigate("/home", { replace: true });
    }
  }, [isLoggedIn, isLoading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    loginMutation.mutate(
      { data: { email, password } },
      {
        onSuccess: (data) => {
          login(data.token);
          navigate("/home");
        },
        onError: (error) => {
          setErrorMsg(error.message || "Failed to login. Please try again.");
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-6 animate-fade-in">

      {/* Back to landing */}
      <div className="absolute top-4 left-4">
        <Link to="/" className="flex items-center gap-1 text-[var(--muted)] hover:text-[var(--green)] text-sm transition-colors">
          ← Home
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="font-amiri text-6xl text-[var(--gold)] mb-2">نور</h1>
        <h2 className="font-cinzel text-3xl tracking-widest text-[var(--green)]">NOOR</h2>
        <p className="text-[var(--muted)] text-sm mt-2">Remember Allah. Every day.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        {errorMsg && <div className="text-red-400 text-sm text-center">{errorMsg}</div>}
        
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[var(--surface)] border-[var(--border)] text-[var(--text)] rounded-xl py-6 px-4"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-[var(--surface)] border-[var(--border)] text-[var(--text)] rounded-xl py-6 px-4"
        />
        
        <Button 
          type="submit" 
          disabled={loginMutation.isPending}
          className="w-full bg-[var(--green)] hover:bg-[var(--green)]/90 text-white rounded-xl py-6 mt-4 font-semibold text-lg"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Link to="/register" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors text-sm">
          Don't have an account? <span className="text-[var(--green)]">Register</span>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
