// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockRegister } from '../api/api'; // <-- 1. YENİ SATIR: Import et

export default function RegisterPage() {
  const [isim, setIsim] = useState('');
  const [soyisim, setSoyisim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!isim || !email || !password) {
      setError('İsim, e-posta ve şifre alanları zorunludur.');
      return;
    }
    
    setError('');
    setMessage('');

    // --- 2. YENİ KISIM: Mock API'yi çağır ---
    mockRegister({ isim, soyisim, email, password })
      .then(res => {
        setMessage('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
        setError('');
        // Başarılı kayıttan 2 saniye sonra giriş sayfasına yönlendir
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
    // ... JSX kısmı (form) aynı kalıyor ...
    <div style={{ maxWidth: 400, margin: '20px auto' }}>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>İsim</label>
          <input value={isim} onChange={(e) => setIsim(e.target.value)} type="text" />
        </div>
        <div>
          <label>Soyisim</label>
          <input value={soyisim} onChange={(e) => setSoyisim(e.target.value)} type="text" />
        </div>
        <div>
          <label>E-posta</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </div>
        <div>
          <label>Şifre</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        <button type="submit" style={{ marginTop: '10px' }}>Kayıt Ol</button>
      </form>
      
      <p style={{ marginTop: '15px' }}>
        Zaten bir hesabın var mı? <Link to="/login">Giriş Yap</Link>
      </p>
    </div>
  );
}