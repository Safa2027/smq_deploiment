import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://127.0.0.1:8000/api";

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────

export const LogIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      console.log("LOGIN RESPONSE:", data);

      // ───── SAVE TOKENS ─────
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // ───── SAVE USER INFO ─────
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("ROLE SAVED:", data.user.role);
      console.log("EMAIL SAVED:", data.user.email);

      // ───── SAVE IN CONTEXT ─────
      login(data.user);

      // ───── REDIRECT ─────
      navigate("/dashboard");

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Server error. Check backend or CORS.");
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2F4157] via-[#567C8E] to-[#A2C1D1]" />
      <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      {/* CARD */}
      <div className="relative z-10 w-[90%] max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 flex flex-col items-center">

        <img src={logo} alt="logo" className="w-28 mb-4" />

        <h2 className="text-3xl font-bold text-[#2F4157] text-center">
          Bienvenue
        </h2>

        <p className="text-sm text-[#567C8E] text-center mb-6 mt-2">
          Connectez-vous à votre espace SMQ ESI
        </p>

        {error && (
          <div className="w-full mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-center">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center gap-4"
        >
          {/* EMAIL */}
          <div className="w-full">
            <label className="text-sm text-[#2F4157] font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full mt-1 px-4 py-3 border border-[#567C8E] text-[#1f2c3d] rounded-xl outline-none bg-white focus:ring-2 focus:ring-[#A2C1D1]"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="w-full">
            <label className="text-sm text-[#2F4157] font-medium">
              Mot de passe
            </label>

            <input
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full mt-1 px-4 py-3 border border-[#567C8E] text-[#1f2c3d] rounded-xl outline-none bg-white focus:ring-2 focus:ring-[#A2C1D1]"
              required
            />

            <button
              type="button"
              onClick={() => navigate("/reset-password")}
              className="text-sm text-[#2F4157] mt-2 hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-[#2F4157] text-white font-semibold rounded-xl hover:bg-[#1f2c3d] transition"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// RESET PASSWORD
// ─────────────────────────────────────────────

export const ResetPswd = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Reset demandé pour :", email);

    setSent(true);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2F4157] via-[#567C8E] to-[#A2C1D1]" />
      <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      {/* CARD */}
      <div className="relative z-10 w-[90%] max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 flex flex-col items-center">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 text-[#2F4157] hover:scale-110 transition"
        >
          <ChevronLeft size={24} />
        </button>

        <img src={logo} alt="logo" className="w-28 mb-4" />

        <h2 className="text-3xl font-bold text-[#2F4157] text-center">
          Mot de passe oublié ?
        </h2>

        <p className="text-sm text-[#567C8E] text-center mb-6 mt-2 px-4">
          Entrez votre adresse e-mail et nous vous enverrons un nouveau mot de passe.
        </p>

        {sent ? (
          <div className="w-full text-center text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            Un email a été envoyé à <strong>{email}</strong>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center gap-4"
          >
            <div className="w-full">
              <label className="text-sm text-[#2F4157] font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-3 border border-[#567C8E] text-[#1f2c3d] rounded-xl outline-none bg-white focus:ring-2 focus:ring-[#A2C1D1]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2F4157] text-white font-semibold rounded-xl hover:bg-[#1f2c3d] transition"
            >
              Envoyer
            </button>
          </form>
        )}
      </div>
    </div>
  );
};