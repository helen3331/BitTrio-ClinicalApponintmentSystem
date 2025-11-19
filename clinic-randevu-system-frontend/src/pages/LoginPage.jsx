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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth"; // NOT: api/auth dosyanın var olduğundan emin ol

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password)
      .then((res) => {
        localStorage.setItem("token", res.access);
        localStorage.setItem("role", res.role);
        localStorage.setItem("name", res.name);

        if (res.role === "patient") navigate("/patient/dashboard");
        else if (res.role === "doctor") navigate("/doctor/dashboard");
        else if (res.role === "admin") navigate("/admin/dashboard");
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto" }}>
      {/* Başlık tek başına kalsın */}
      <h2 style={{ textAlign: "center" }}>Giriş Yap</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>E-posta</label>
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            type="email" 
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Şifre</label>
          <input 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* --- YENİ BUTON GRUBU --- */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          {/* Giriş Butonu */}
          <button type="submit" style={{ flex: 1, padding: "10px", cursor: "pointer" }}>
            Giriş
          </button>
          
          {/* Kayıt Ol Butonu */}
          <button 
            type="button" 
            onClick={() => navigate("/register")} 
            style={{ flex: 1, padding: "10px", cursor: "pointer", backgroundColor: "#f0f0f0" }}
          >
            Kayıt Ol
          </button>
        </div>
      </form>

      
    </div>
  );
}
