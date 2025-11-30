// src/pages/CheckSymptomsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPolyclinicSymptoms } from "../api/symptomscheck";

export default function CheckSymptomsPage() {
  const { id } = useParams();
  const [poly, setPoly] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPolyclinicSymptoms((id)).then(setPoly);
  }, [id]);

  if (!poly) return <p>Yükleniyor...</p>;

  return (
    <>
      <div style={{
        minHeight: 'calc(100vh - 70px)',
        background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          maxWidth: '700px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🩺</div>
            <h2 style={{
              margin: '0 0 12px 0',
              color: '#333',
              fontSize: '26px',
              fontWeight: '700'
            }}>
              {poly.name}
            </h2>
            <p style={{
              color: '#666',
              fontSize: '16px',
              margin: 0
            }}>
              Bu poliklinik için tipik şikayetler
            </p>
          </div>

          {/* Symptoms List */}
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '30px',
            border: '2px solid #e9ecef'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              color: '#333',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              📋 Yaygın Belirtiler:
            </h3>
            <ul style={{
              margin: 0,
              padding: '0 0 0 20px',
              color: '#555',
              fontSize: '15px',
              lineHeight: '2'
            }}>
              {poly.symptoms.map((s, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Question */}
          <div style={{
            backgroundColor: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <p style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '700',
              color: '#856404'
            }}>
              ⚠️ Bu şikayetlerden en az 3'ü sizde var mı?
            </p>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {/* YES Button */}
            <button
              onClick={() => navigate(`/select-doctor/${poly.id}`)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '16px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#218838';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(40, 167, 69, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#28a745';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
              }}
            >
              <span style={{ fontSize: '20px' }}>✅</span>
              Evet, devam et
            </button>

            {/* NO Button */}
            <button
              onClick={() => navigate(`/polyclinics/${poly.id}/symptom-input`)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '16px 24px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#c82333';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(220, 53, 69, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#dc3545';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)';
              }}
            >
              <span style={{ fontSize: '20px' }}>❌</span>
              Hayır / Emin değilim
            </button>
          </div>

          {/* Info Box */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#e7f3ff',
            border: '1px solid #b3d9ff',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#004085',
            textAlign: 'center'
          }}>
            💡 <strong>İpucu:</strong> Emin değilseniz "Hayır" seçeneğini işaretleyin. 
            Sistemimiz şikayetlerinizi analiz ederek size en uygun polikliniği önerecektir.
          </div>
        </div>
      </div>
    </>
  );
}