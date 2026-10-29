import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from '../../api/authApi';

const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5001/api");

const CheckinCheckout = () => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const [bookings, setBookings] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [showPaymentWarning, setShowPaymentWarning] = useState(false);
  const [activeTab, setActiveTab] = useState("checkin");
  const [qrModal, setQrModal] = useState({ show: false, qrCode: '', booking: null });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = today.toLocaleDateString("en-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    try {
      const res = await api.get(`${API_URL}/bookings/all`, { headers });
      setBookings(res.data);
    } catch (err) { console.error(err); }
  };

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // CHECK-IN: confirmed ya pending (cash) + checkInDate = today
const checkInList = bookings.filter(
    (b) =>
      ["confirmed", "pending"].includes(b.bookingStatus) &&
      isSameDay(new Date(b.checkInDate), today)
  );

  // CHECK-OUT: checked_in + checkOutDate = today ONLY
  const checkOutList = bookings.filter((b) => {
    const coDate = new Date(b.checkOutDate);
    coDate.setHours(0, 0, 0, 0);
    return b.bookingStatus === "checked_in" && isSameDay(coDate, today);
  });

  // OCCUPIED: checked_in status — currently in hotel
  const occupiedList = bookings.filter(
    (b) => b.bookingStatus === "checked_in"
  );

  const paymentBadge = (status) => (
    <span className={`badge ${status === "paid" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
      {status}
    </span>
  );

  // CHECK-IN — confirmed/pending → checked_in + room occupied (dedicated API)
  const handleCheckIn = async (booking) => {
    const bookingId = typeof booking === 'string' ? booking : booking._id;
    const payment = typeof booking === 'string'
      ? bookings.find(b => b._id === bookingId)?.paymentStatus
      : booking?.paymentStatus;

    try {
      if (payment && payment !== 'paid') {
        const ok = window.confirm(
          'Payment is still pending for this guest.\n\nMark as paid and check in now?'
        );
        if (!ok) return;
        await api.put(`${API_URL}/bookings/${bookingId}/payment`, {}, { headers });
      }
      await api.put(`${API_URL}/bookings/${bookingId}/check-in`, {}, { headers });
      loadBookings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Check-in failed.');
    }
  };

  // CHECK-OUT — checked_in → checked_out → complete (room → cleaning → available)
  const handleCheckout = async () => {
    try {
      const bookingId = selectedBooking._id;
      if (paymentStatus === 'paid' && selectedBooking.paymentStatus !== 'paid') {
        await api.put(`${API_URL}/bookings/${bookingId}/payment`, {}, { headers });
      }
      await api.put(`${API_URL}/bookings/${bookingId}/check-out`, {}, { headers });
      await api.put(`${API_URL}/bookings/${bookingId}/complete`, {}, { headers });
      setShowCheckoutModal(false);
      loadBookings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Check-out failed.');
    }
  };
const handleGenerateQR = async (booking) => {
    try {
      const res = await api.get(`${API_URL}/bookings/${booking._id}/qr`, { headers });
      setQrModal({ show: true, qrCode: res.data.qrCode, booking });
    } catch (err) {
      console.error(err);
    }
  };
  const BookingRow = ({ b, showCheckout = false }) => {
    const checkIn = new Date(b.checkInDate).toLocaleDateString("en-PK");
    const checkOut = new Date(b.checkOutDate).toLocaleDateString("en-PK");
    const nights = Math.ceil(
      (new Date(b.checkOutDate) - new Date(b.checkInDate)) / (1000 * 60 * 60 * 24)
    );

    return (
      <tr>
        <td>
          <div className="fw-semibold">{b.guestName || b.userId?.name || "Guest"}</div>
        </td>
        <td><small>{b.guestPhone || b.userId?.phone || "—"}</small></td>
        <td>
          <span className="badge bg-primary-subtle text-primary">
            {b.roomId ? `Room ${b.roomId.roomNumber} (${b.roomId.type})` : "—"}
          </span>
        </td>
        <td><span className={showCheckout ? "" : "text-success fw-medium"}>{checkIn}</span></td>
        <td><span className={showCheckout ? "text-warning fw-medium" : ""}>{checkOut}</span></td>
        {!showCheckout && <td>{nights} night(s)</td>}
        <td className="fw-semibold">PKR {Number(b.totalAmount).toLocaleString()}</td>
        <td>{paymentBadge(b.paymentStatus)}</td>
        {!showCheckout && (
          <td><small className="text-muted">{b.specialRequests || "—"}</small></td>
        )}
       {!showCheckout && (
          <td>
            <div className="d-flex gap-1">
              <button className="btn btn-success btn-sm" onClick={() => handleCheckIn(b)}>
                <i className="ri-login-box-line me-1"></i>
                {b.paymentStatus === 'paid' ? 'Check-in' : 'Pay & Check-in'}
              </button>
              {/* <button className="btn btn-info btn-sm" onClick={() => handleGenerateQR(b)} title="Generate QR">
                <i className="ri-qr-code-line"></i>
              </button> */}
            </div>
          </td>
        )}
        {showCheckout && (
          <td>
            <button className="btn btn-warning btn-sm"
              onClick={() => {
                setSelectedBooking(b);
                setPaymentStatus(b.paymentStatus);
                if (b.paymentStatus !== 'paid') {
                  setShowPaymentWarning(true);
                } else {
                  setShowCheckoutModal(true);
                }
              }}>
              <i className="ri-logout-box-line me-1"></i>Check-out
            </button>
          </td>
        )}
      </tr>
    );
  };

  const OccupiedRow = ({ b }) => {
    const checkIn = new Date(b.checkInDate).toLocaleDateString("en-PK");
    const checkOut = new Date(b.checkOutDate).toLocaleDateString("en-PK");
    const coDate = new Date(b.checkOutDate);
    coDate.setHours(0, 0, 0, 0);
    const nightsLeft = Math.ceil((coDate - today) / (1000 * 60 * 60 * 24));

    return (
      <tr>
        <td><div className="fw-semibold">{b.guestName || b.userId?.name || "Guest"}</div></td>
        <td><small>{b.guestPhone || b.userId?.phone || "—"}</small></td>
        <td>
          <span className="badge bg-primary-subtle text-primary">
            {b.roomId ? `Room ${b.roomId.roomNumber} (${b.roomId.type})` : "—"}
          </span>
        </td>
        <td>{checkIn}</td>
        <td>{checkOut}</td>
        <td>
          <span className={`badge ${nightsLeft <= 1 ? "bg-danger-subtle text-danger" : "bg-info-subtle text-info"}`}>
            {nightsLeft <= 0 ? "Due today" : `${nightsLeft} night(s) left`}
          </span>
        </td>
        <td className="fw-semibold">PKR {Number(b.totalAmount).toLocaleString()}</td>
        <td>{paymentBadge(b.paymentStatus)}</td>
      </tr>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">Check-in / Check-out</h4>
            <span className="text-muted fs-14">{todayStr}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb-3">
        {[
          { label: "Today's Check-ins", value: checkInList.length, icon: "bx bx-log-in", color: "success" },
          { label: "Today's Check-outs", value: checkOutList.length, icon: "bx bx-log-out", color: "warning" },
          { label: "Currently Occupied", value: occupiedList.length, icon: "bx bx-hotel", color: "info" },
        ].map((s, i) => (
          <div className="col-md-4" key={i}>
            <div className="card card-animate">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="avatar-sm flex-shrink-0">
                    <span className={`avatar-title bg-${s.color}-subtle rounded fs-3`}>
                      <i className={`${s.icon} text-${s.color}`}></i>
                    </span>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <p className="text-uppercase fw-medium text-muted mb-1 fs-12">{s.label}</p>
                    <h4 className="mb-0 fw-semibold">{s.value}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
            {[
              { key: "checkin", label: "Check-in Today", count: checkInList.length, color: "success" },
              { key: "checkout", label: "Check-out Today", count: checkOutList.length, color: "warning" },
              { key: "occupied", label: "Currently Occupied", count: occupiedList.length, color: "info" },
            ].map((tab) => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                  <span className={`badge bg-${tab.color} ms-1`}>{tab.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-body">

          {/* CHECK-IN TAB */}
          {activeTab === "checkin" && (
            <>
              <p className="text-muted mb-3">
                <i className="ri-information-line me-1"></i>
                Guests whose check-in date is <strong>today</strong>. Click Check-in when guest arrives.
              </p>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Guest</th><th>Phone</th><th>Room</th>
                      <th>Check In</th><th>Check Out</th><th>Nights</th>
                      <th>Amount</th><th>Payment</th><th>Request</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkInList.length === 0 ? (
                      <tr><td colSpan="10" className="text-center py-4 text-muted">
                        <i className="ri-calendar-check-line fs-24 d-block mb-2 opacity-50"></i>
                        No check-ins scheduled for today
                      </td></tr>
                    ) : checkInList.map((b) => <BookingRow key={b._id} b={b} />)}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* CHECK-OUT TAB */}
          {activeTab === "checkout" && (
            <>
              <p className="text-muted mb-3">
                <i className="ri-information-line me-1"></i>
                Guests whose check-out date is <strong>today</strong> and have already checked in.
              </p>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Guest</th><th>Phone</th><th>Room</th>
                      <th>Check In</th><th>Check Out</th>
                      <th>Amount</th><th>Payment</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkOutList.length === 0 ? (
                      <tr><td colSpan="8" className="text-center py-4 text-muted">
                        <i className="ri-logout-box-line fs-24 d-block mb-2 opacity-50"></i>
                        No check-outs scheduled for today
                      </td></tr>
                    ) : checkOutList.map((b) => <BookingRow key={b._id} b={b} showCheckout={true} />)}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* OCCUPIED TAB */}
          {activeTab === "occupied" && (
            <>
              <p className="text-muted mb-3">
                <i className="ri-information-line me-1"></i>
                Guests currently checked in and staying in the hotel.
              </p>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Guest</th><th>Phone</th><th>Room</th>
                      <th>Check In</th><th>Check Out</th>
                      <th>Nights Left</th><th>Amount</th><th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {occupiedList.length === 0 ? (
                      <tr><td colSpan="8" className="text-center py-4 text-muted">
                        <i className="ri-hotel-bed-line fs-24 d-block mb-2 opacity-50"></i>
                        No guests currently staying
                      </td></tr>
                    ) : occupiedList.map((b) => <OccupiedRow key={b._id} b={b} />)}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {showCheckoutModal && selectedBooking && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-warning-subtle">
                <h5 className="modal-title">
                  <i className="ri-logout-box-line me-2 text-warning"></i>Confirm Check-out
                </h5>
                <button className="btn-close" onClick={() => setShowCheckoutModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="p-3 bg-light rounded mb-3">
                  <div className="row g-2">
                    <div className="col-6">
                      <p className="text-muted mb-1 fs-12">Guest</p>
                      <h6>{selectedBooking.guestName || selectedBooking.userId?.name || 'Guest'}</h6>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 fs-12">Phone</p>
                      <h6>{selectedBooking.userId?.phone || "—"}</h6>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 fs-12">Room</p>
                      <h6>{selectedBooking.roomId ? `Room ${selectedBooking.roomId.roomNumber}` : "—"}</h6>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 fs-12">Total Amount</p>
                      <h5 className="text-success mb-0">PKR {Number(selectedBooking.totalAmount).toLocaleString()}</h5>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Payment Status</label>
                  <select className="form-select" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                    <option value="paid">Paid ✅</option>
                    <option value="unpaid">Unpaid ❌</option>
                  </select>
                </div>
                <div className="alert alert-warning mb-0">
                  <i className="ri-alert-line me-2"></i>
                  Room will be automatically marked as <strong>Available</strong> after check-out.
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-light" onClick={() => setShowCheckoutModal(false)}>Cancel</button>
               <button className="btn btn-warning"
                  onClick={handleCheckout}>
                  <i className="ri-logout-box-line me-1"></i>Confirm Check-out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* PAYMENT WARNING MODAL */}
      {showPaymentWarning && selectedBooking && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="ri-error-warning-line me-2"></i>Payment Required
                </h5>
                <button className="btn-close btn-close-white" onClick={() => setShowPaymentWarning(false)}></button>
              </div>
              <div className="modal-body text-center py-4">
                <div className="mb-3">
                  <i className="ri-secure-payment-line text-danger" style={{ fontSize: "3rem" }}></i>
                </div>
                <h5 className="fw-bold mb-2">Checkout Not Allowed</h5>
                <p className="text-muted mb-3">
                  Guest <strong>{selectedBooking.userId?.name || selectedBooking.guestName || "Guest"}</strong> has a pending payment of{" "}
                  <strong className="text-danger">PKR {Number(selectedBooking.totalAmount).toLocaleString()}</strong>.
                </p>
                <div className="alert alert-warning text-start">
                  <i className="ri-information-line me-2"></i>
                  Collect payment and mark as <strong>Paid</strong> on Payments (or Bookings), then check out again.
                </div>
              </div>
              <div className="modal-footer justify-content-center gap-2">
                <button className="btn btn-light px-4" onClick={() => setShowPaymentWarning(false)}>
                  Close
                </button>
                <Link className="btn btn-primary px-4" to="/admin/payments" onClick={() => setShowPaymentWarning(false)}>
                  Go to Payments
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* QR CODE MODAL */}
      {qrModal.show && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="ri-qr-code-line me-2"></i>Digital Check-in QR
                </h5>
                <button className="btn-close" onClick={() => setQrModal({ show: false, qrCode: '', booking: null })}></button>
              </div>
              <div className="modal-body text-center py-4">
                <p className="text-muted mb-3">
                  Guest ko yeh QR code scan karke self check-in karne do
                </p>
                {qrModal.qrCode && (
                  <img src={qrModal.qrCode} alt="QR Code" style={{ width: 220, height: 220 }} />
                )}
                <div className="mt-3">
                  <div className="fw-semibold">{qrModal.booking?.guestName || qrModal.booking?.userId?.name}</div>
                  <small className="text-muted">Room {qrModal.booking?.roomId?.roomNumber} — {new Date(qrModal.booking?.checkInDate).toLocaleDateString('en-PK')}</small>
                </div>
                <div className="alert alert-info mt-3 text-start">
                  <i className="ri-information-line me-1"></i>
                  Guest should go to their profile page → click the <strong>"Self Check-in"</strong> button on the booking card
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-light" onClick={() => setQrModal({ show: false, qrCode: '', booking: null })}>Close</button>
                <button className="btn btn-success" onClick={() => {
                  const link = document.createElement('a');
                  link.download = `checkin-qr-${qrModal.booking?._id}.png`;
                  link.href = qrModal.qrCode;
                  link.click();
                }}>
                  <i className="ri-download-line me-1"></i>Download QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckinCheckout;