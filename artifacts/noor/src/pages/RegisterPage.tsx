import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRegister } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login, isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const registerMutation = useRegister();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      void navigate("/home", { replace: true });
    }
  }, [isLoggedIn, isLoading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    registerMutation.mutate(
      { data: { name, email, password } },
      {
        onSuccess: (data) => {
          login(data.token);
          navigate("/onboarding");
        },
        onError: (error) => {
          setErrorMsg(error.message || "Failed to register. Please try again.");
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
        <h2 className="font-cinzel text-2xl tracking-widest text-[var(--green)]">DEENAPP</h2>
        <p className="text-[var(--muted)] text-sm mt-2">Remember Allah. Every day.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        {errorMsg && <div className="text-red-400 text-sm text-center">{errorMsg}</div>}
        
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-[var(--surface)] border-[var(--border)] text-[var(--text)] rounded-xl py-6 px-4"
        />
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
          disabled={registerMutation.isPending}
          className="w-full bg-[var(--green)] hover:bg-[var(--green)]/90 text-white rounded-xl py-6 mt-4 font-semibold text-lg"
        >
          {registerMutation.isPending ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-8">
        <Link to="/login" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors text-sm">
          Already have an account? <span className="text-[var(--green)]">Sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
