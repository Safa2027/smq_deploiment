import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ResetPswd = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Reset password request started");
  console.log("Email:", email);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/reset-password/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    console.log("HTTP status:", response.status);
    console.log("Response ok:", response.ok);

    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      console.log("Reset failed");
      alert(data.detail || "Reset failed");
      return;
    }

    console.log("Reset success");
    alert("Password reset email sent");

  } catch (err) {
    console.log("Error during reset:", err);
    alert("Server error");
  }
};
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">

      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2F4157] via-[#567C8E] to-[#A2C1D1]" />

      {/* OPTIONAL BLUR CIRCLES */}
      <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      {/* RESET CARD */}
      <div className="relative z-10 w-[90%] max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 flex flex-col items-center">

        {/* BACK BUTTON */}
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 text-[#2F4157] hover:scale-110 transition"
        >
          <ChevronLeft size={24} />
        </button>

        {/* LOGO */}
       <img src={logo} alt="logo" className="w-28 mb-4" />

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-[#2F4157] text-center">
          Mot de passe oublié ?
        </h2>

        <p className="text-sm text-[#567C8E] text-center mb-6 mt-2 px-4">
          Entrez votre adresse e-mail et nous vous enverrons un nouveau mot de passe.
        </p>

        {/* FORM */}
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-[#567C8E] text-[#1f2c3d] rounded-xl outline-none bg-white focus:ring-2 focus:ring-[#A2C1D1]"
              required
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-3 bg-[#2F4157] text-white font-semibold rounded-xl hover:bg-[#1f2c3d] transition"
          >
            Envoyer le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
};