import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';

const BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5001/api");

const QRScanner = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/user-login');
      return;
    }

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText) => {
        // QR scan ho gaya — scanner stop karo
        await scanner.stop();
        setScanning(false);
        handleScanSuccess(decodedText);
      },
      () => {} // scan errors ignore karo (continuous scanning ke dauran normal hai)
    ).catch((err) => {
      setError('Camera access denied. Please allow camera permission.');
      console.error(err);
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [user]);

  const handleScanSuccess = async (decodedText) => {
    try {
      const qrData = JSON.parse(decodedText);

      if (qrData.action !== 'CHECK_IN') {
        setError('Invalid QR code.');
        return;
      }

      const res = await axios.post(`${BASE_URL}/bookings/qr-checkin`,
        { bookingId: qrData.bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult({ success: true, message: res.data.message, booking: res.data.booking, qrData });
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || 'Check-in failed. Invalid or expired QR code.'
      });
    }
  };

  const restartScan = () => {
    setResult(null);
    setError('');
    setScanning(true);
    window.location.reload();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1a1510', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#c9a96e', fontFamily: "'Cormorant Garamond', serif", fontSize: 32, marginBottom: 4 }}>
          📱 Scan to Check-in
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
          Scan the QR code provided at the reception desk
        </p>
      </div>

      {!result && scanning && (
        <div style={{ width: '100%', maxWidth: 400, borderRadius: 20, overflow: 'hidden', border: '2px solid #c9a96e' }}>
          <div id="qr-reader" style={{ width: '100%' }}></div>
        </div>
      )}

      {error && (
        <div style={{ background: '#3a1a1a', border: '1px solid #e74c3c', borderRadius: 12, padding: 20, marginTop: 20, maxWidth: 400, textAlign: 'center' }}>
          <p style={{ color: '#e74c3c', margin: 0 }}>{error}</p>
          <button onClick={restartScan} style={{
            marginTop: 12, background: '#c9a96e', color: '#fff', border: 'none',
            borderRadius: 50, padding: '10px 24px', cursor: 'pointer'
          }}>Try Again</button>
        </div>
      )}

      {result && (
        <div style={{
          background: '#fff', borderRadius: 20, padding: '40px 30px',
          maxWidth: 400, width: '100%', textAlign: 'center'
        }}>
          <div style={{
            width: 70, height: 70, borderRadius: '50%', margin: '0 auto 20px',
            background: result.success ? 'linear-gradient(135deg,#c9a96e,#a67c40)' : '#e74c3c',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, color: '#fff', fontWeight: 700
          }}>
            {result.success ? '✓' : '✕'}
          </div>
          <h3 style={{ fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>
            {result.success ? 'Check-in Successful!' : 'Check-in Failed'}
          </h3>
          <p style={{ color: '#666', marginBottom: 24 }}>{result.message}</p>

          {result.success && result.qrData && (
            <div style={{ background: '#fdf8f2', borderRadius: 12, padding: '14px 18px', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                <span style={{ color: '#888' }}>Room</span>
                <strong>{result.qrData.roomNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                <span style={{ color: '#888' }}>Guest</span>
                <strong>{result.qrData.guestName}</strong>
              </div>
            </div>
          )}

          <button onClick={() => navigate('/profile')} style={{
            background: 'linear-gradient(135deg,#c9a96e,#a67c40)', color: '#fff',
            border: 'none', borderRadius: 50, padding: '12px 32px',
            fontWeight: 600, cursor: 'pointer', width: '100%'
          }}>
            Go to My Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;