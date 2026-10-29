import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/authApi';
import { connectSocket } from '../../services/socketService';

const STATUS_META = {
  available:   { bg: 'rgba(26,126,77,0.08)',  border: 'rgba(26,126,77,0.28)',  text: '#1a7e4d', icon: 'ri-door-open-line' },
  occupied:    { bg: 'rgba(184,148,88,0.12)', border: 'rgba(184,148,88,0.35)', text: '#8a6a2f', icon: 'ri-hotel-bed-line' },
  cleaning:    { bg: 'rgba(47,111,143,0.1)',  border: 'rgba(47,111,143,0.3)',  text: '#2f6f8f', icon: 'ri-sparkling-2-line' },
  maintenance: { bg: 'rgba(185,74,74,0.1)',   border: 'rgba(185,74,74,0.3)',   text: '#b94a4a', icon: 'ri-tools-line' },
  reserved:    { bg: 'rgba(111,66,193,0.1)',  border: 'rgba(111,66,193,0.28)', text: '#6f42c1', icon: 'ri-bookmark-3-line' },
};

const FILTERS = [
  { key: 'all',         label: 'All Rooms',   icon: 'ri-grid-line', bg: 'rgba(23,23,23,0.04)', border: 'rgba(23,23,23,0.12)', text: '#171717' },
  { key: 'available',   label: 'Available',   ...STATUS_META.available },
  { key: 'occupied',    label: 'Occupied',    ...STATUS_META.occupied },
  { key: 'cleaning',    label: 'Cleaning',    ...STATUS_META.cleaning },
  { key: 'maintenance', label: 'Maintenance', ...STATUS_META.maintenance },
  { key: 'reserved',    label: 'Reserved',    ...STATUS_META.reserved },
];

const LiveRoomDashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    api.get('/rooms', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setRooms(res.data || []);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setRooms([]);
      setLoading(false);
    });

    const socket = connectSocket();
    socket.on('room_status_updated', (data) => {
      setRooms(prev => prev.map(room =>
        room._id === data.roomId
          ? { ...room, status: data.status }
          : room
      ));
      setLastUpdated(new Date().toLocaleTimeString());
    });

    return () => {
      socket.off('room_status_updated');
    };
  }, []);

  const counts = {
    all: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
    reserved: rooms.filter(r => r.status === 'reserved').length,
  };

  const openRooms = (statusKey) => {
    if (statusKey === 'all') {
      navigate('/admin/rooms');
      return;
    }
    navigate(`/admin/rooms?status=${encodeURIComponent(statusKey)}`);
  };

  if (loading) return (
    <div className="text-center py-4">
      <div className="spinner-border text-success"></div>
      <p className="mt-2 text-muted mb-0">Loading rooms...</p>
    </div>
  );

  return (
    <div className="ls-live-rooms">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h5 className="mb-0 fw-semibold" style={{ fontFamily: 'var(--ls-font-serif)' }}>
            Live Room Status
          </h5>
          {lastUpdated ? (
            <small className="text-muted">Updated {lastUpdated}</small>
          ) : (
            <small className="text-muted">Click a status to open Manage Rooms</small>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success-subtle text-success px-3 py-2">
            <span className="ls-live-dot me-1" aria-hidden="true" /> LIVE
          </span>
          <Link to="/admin/rooms" className="btn btn-sm btn-dark">
            View all rooms
            <i className="ri-arrow-right-line ms-1" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="ls-room-filters">
        {FILTERS.map((item) => (
          <button
            type="button"
            key={item.key}
            className="ls-room-filter"
            style={{
              background: item.bg,
              borderColor: item.border,
              color: item.text,
            }}
            onClick={() => openRooms(item.key)}
            title={`Open ${item.label} in Manage Rooms`}
          >
            <span className="ls-room-filter__icon" aria-hidden="true">
              <i className={item.icon} />
            </span>
            <span className="ls-room-filter__count">{counts[item.key] || 0}</span>
            <span className="ls-room-filter__label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LiveRoomDashboard;
