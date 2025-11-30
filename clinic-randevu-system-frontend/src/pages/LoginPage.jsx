// // src/pages/LoginPage.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { login } from "../api/auth";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     login(email, password)
//       .then((res) => {
//         // Normalde token'ı localStorage'a yazarız:
//         localStorage.setItem("token", res.access);
//         localStorage.setItem("role", res.role);
//         localStorage.setItem("name", res.name);

//         if (res.role === "patient") navigate("/patient/dashboard");
//         else if (res.role === "doctor") navigate("/doctor/dashboard");
//         else if (res.role === "admin") navigate("/admin/dashboard");
//       })
//       .catch((err) => setError(err.message));
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "20px auto" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
//         {/* H2 Başlık */}
//         <h2>Giriş Yap</h2>
        
//         {/* Buton */}
//         <button onClick={() => navigate("/register")} style={{ height: "fit-content" }}>
//           Kayıt Ol
//         </button>
//       </div>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>E-posta</label>
//           <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
//         </div>
//         <div>
//           <label>Şifre</label>
//           <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
//         </div>
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         <button type="submit">Giriş</button>
//       </form>

//       <p style={{ marginTop: 10 }}>
//         Deneme için: <br />
//         patient@test.com / herhangi şifre <br />
//         doctor@test.com / herhangi şifre <br />
//         admin@test.com / herhangi şifre
//       </p>
//     </div>
//   );
// }
// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../api/auth"; // NOT: api/auth dosyanın var olduğundan emin ol
import { saveAuth } from "../utils/auth";


export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const data = await loginRequest(email, password);

    saveAuth(data);

    if (data.role === "patient") navigate("/patient/dashboard");
    else if (data.role === "doctor") navigate("/doctor/dashboard");
    else if (data.role === "admin") navigate("/admin/dashboard");
    else navigate("/");

  } catch (err) {
      console.error(err);
      setError("Email veya şifre hatalı.");
    }
  };
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  // const navigate = useNavigate();

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   loginRequest(email, password)
  //     .then((res) => {
  //       localStorage.setItem("token", res.access);
  //       localStorage.setItem("role", res.role);
  //       localStorage.setItem("name", res.name);

  //       if (res.role === "patient") navigate("/patient/dashboard");
  //       else if (res.role === "doctor") navigate("/doctor/dashboard");
  //       else if (res.role === "admin") navigate("/admin/dashboard");
  //     })
  //     .catch((err) => setError(err.message));
  // };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center",
      padding: "40px 20px",
      backgroundColor: "#f8f9fa"
    }}>
      
      {/* Logo */}
      <img 
        src="/logo192.png" 
        alt="Logo" 
        style={{ 
          width: "100px", 
          height: "100px",
          marginBottom: "20px"
        }} 
      />

      {/* Bit Trio Başlık */}
      <div style={{ 
        textAlign: "center", 
        fontWeight: "600",
        fontSize: "28px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "8px"
      }}>
        Bit Trio
      </div>

      {/* Alt Başlık */}
      <div style={{
        textAlign: "center",
        fontSize: "16px",
        color: "#5a6c7d",
        marginBottom: "50px",
        fontStyle: "italic"
      }}>
        Clinic Appointment System
      </div>

      {/* Login Form Box */}
      <div style={{ 
        maxWidth: 400, 
        width: "100%",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        
        <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>
          Giriş Yap
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>
              E-posta
            </label>
            <input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
              style={{ 
                width: "100%", 
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px"
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>
              Şifre
            </label>
            <input
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Şifre"
              required
              style={{ 
                width: "100%", 
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px"
              }}
            />
          </div>
         
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
            <button 
              type="submit" 
              style={{ 
                flex: 1, 
                padding: "12px", 
                cursor: "pointer",
                backgroundColor: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500"
              }}
            >
              Giriş
            </button>
           
            <button
              type="button"
              onClick={() => navigate("/register")}
              style={{ 
                flex: 1, 
                padding: "12px", 
                cursor: "pointer", 
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500"
              }}
            >
              Kayıt Ol
            </button>
          </div>
        </form>

        {/* Info Text */}
        <p style={{ 
          marginTop: "25px", 
          fontSize: "14px", 
          color: "#666", 
          textAlign: "center",
          lineHeight: "1.5"
        }}>
          Eğer hesabınız yoksa lütfen <strong>Kayıt Ol</strong> ekranından yeni bir hesap oluşturun.
        </p>

      </div>
    </div>
  );
}