
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register_patient } from '../api/registerpatient'; // NOT: mockRegister'ın bu dosyada olduğundan emin ol

export default function RegisterPage() {
  const [isim, setIsim] = useState('');
  const [username, setUsername] = useState(''); // İsmi düzelttik (User_name -> username)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!isim || !email || !password || !username) {
      setError('Tüm alanlar zorunludur.');
      return;
    }
    
    setError('');
    setMessage('');

    // Düzenlenmiş veriyi gönderiyoruz
    register_patient({ isim, username, email, password })
      .then(res => {
        setMessage('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
        setError('');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      })
      .catch(err => {
        setError(err.message);
        setMessage('');
      });
  };

  return (
    <div style={{ maxWidth: 400, margin: '20px auto' }}>
      <h2 style={{ textAlign: "center" }}>Kayıt Ol</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Tam İsim</label>
          <input value={isim} onChange={(e) => setIsim(e.target.value)} type="text" style={{ width: "100%", padding: "8px" }} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Kullanıcı Adı / Soyisim</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" style={{ width: "100%", padding: "8px" }} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>E-posta</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={{ width: "100%", padding: "8px" }} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Şifre</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" style={{ width: "100%", padding: "8px" }} />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        <button type="submit" style={{ width: "100%", marginTop: '10px', padding: "10px", cursor: "pointer" }}>
          Kayıt Ol
        </button>
      </form>
      
      <p style={{ marginTop: '15px', textAlign: "center" }}>
        Zaten bir hesabın var mı? <Link to="/login">Giriş Yap</Link>
      </p>
    </div>
  );
}