// src/pages/PatientDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatientAppointmentsMock } from '../api/api'; // Mock fonksiyonu import ettik

export default function PatientDashboardPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState({ name: '', role: '' });

  useEffect(() => {
    // 1. LocalStorage'dan kullanıcı bilgilerini al
    const storedName = localStorage.getItem('name');
    const storedRole = localStorage.getItem('role');
    
    // Eğer giriş yapılmamışsa login'e at (Güvenlik)
    if (!storedRole || storedRole !== 'patient') {
      navigate('/login');
      return;
    }

    setUser({
      name: storedName || 'İsimsiz Hasta',
      role: storedRole
    });

    // 2. Mock randevuları getir
    getPatientAppointmentsMock().then(data => {
      setAppointments(data);
    });
  }, [navigate]);

  return (
    <div style={{ 
      height: '80vh',       // Sayfa yüksekliği (Navbar hariç alan gibi düşünelim)
      position: 'relative', // İçindeki absolute elemanlar buna göre hizalanacak
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'  // Yatayda ortala
    }}>

      {/* --- SOL ÜST KÖŞE: Kullanıcı Bilgileri --- */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        border: '1px solid #ccc', 
        padding: '15px', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        textAlign: 'left',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h4 style={{ margin: 0, color: '#333' }}>{user.name}</h4>
        <small style={{ color: '#666' }}>Rol: {user.role}</small> <br/>
        {/* Kullanıcı adını ayrıca tutuyorsan buraya ekleyebilirsin */}
        <small style={{ color: '#666' }}>Kullanıcı ID: #12345</small>
      </div>


      {/* --- ORTA ÜST: Randevu Al Butonu --- */}
      <div style={{ marginTop: '100px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Yeni bir randevu mu planlıyorsunuz?</h2>
        <button 
          onClick={() => navigate('/polyclinics')}
          style={{ 
            padding: '15px 40px', 
            fontSize: '18px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '30px', 
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }}
          // Basit bir hover efekti için (opsiyonel)
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Randevu Al
        </button>
      </div>


      {/* --- ALT KISIM: Randevu Listesi --- */}
      {/* marginTop: 'auto' diyerek bu kutuyu en alta itiyoruz */}
      <div style={{ 
        marginTop: 'auto', 
        width: '100%', 
        maxWidth: '800px',
        backgroundColor: '#fff',
        borderTop: '2px solid #eee',
        paddingTop: '20px'
      }}>
        <h3 style={{ textAlign: 'center', color: '#444' }}>Randevularım</h3>
        
        {appointments.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Henüz bir randevunuz bulunmamaktadır.</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {appointments.map((app) => (
              <div key={app.id} style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                borderRadius: '8px', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fafafa'
              }}>
                <div>
                  <strong style={{ fontSize: '1.1em', color: '#007bff' }}>{app.polyclinic}</strong>
                  <div style={{ color: '#555' }}>{app.doctor}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold' }}>{app.date}</div>
                  <div style={{ color: '#888' }}>{app.time}</div>
                  <span style={{ 
                    fontSize: '0.8em', 
                    padding: '4px 8px', 
                    backgroundColor: '#d4edda', 
                    color: '#155724', 
                    borderRadius: '12px' 
                  }}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}