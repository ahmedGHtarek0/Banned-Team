import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, X, Shield, Calendar as CalendarIcon, Clock, Building, UserCircle, MessageSquare, Search } from 'lucide-react';
import { Button, Card, Modal, Input } from '../components/ui';
import { BOOKING_STATUS } from '../data/mockData';
import { format } from 'date-fns';
import BookingModal from '../components/BookingModal';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="p-6 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 transition-transform group-hover:scale-110 ${color}`}>
      <Icon size={96} />
    </div>
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color.replace('text-', 'bg-').replace('-600', '-50')} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  const { user, isAdmin, isBranchManager, bookings, updateBookingStatus, rooms, pendingRooms, approveRoom, rejectRoom, pendingDeletions, approveDeletion, rejectDeletion } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, bookingId: null });
  const [rejectForm, setRejectForm] = useState({ reason: '', suggestion: '' });
  const navigate = useNavigate();

  const pendingBookings = bookings.filter(b => b.status === BOOKING_STATUS.PENDING);
  const approvedBookings = bookings.filter(b => b.status === BOOKING_STATUS.APPROVED);
  const upcomingToday = approvedBookings.filter(b => {
    const d = new Date(b.date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const handleDeclineClick = (id) => {
    setRejectModal({ isOpen: true, bookingId: id });
  };

  const handleConfirmReject = () => {
    updateBookingStatus(rejectModal.bookingId, BOOKING_STATUS.REJECTED, rejectForm.reason, rejectForm.suggestion);
    setRejectModal({ isOpen: false, bookingId: null });
    setRejectForm({ reason: '', suggestion: '' });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Console</h1>
          <p className="text-slate-500 font-bold mt-1">Institutional resource management and oversight.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl shadow-brand-500/20">
          <CalendarIcon size={20} />
          Create Reservation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Halls" value={rooms.length} icon={Building} color="text-brand-600" />
        <StatCard title="Daily Traffic" value={upcomingToday.length} icon={Clock} color="text-blue-600" />
        <StatCard title="Action Required" value={pendingBookings.length + (isBranchManager ? pendingRooms.length + pendingDeletions.length : 0)} icon={Shield} color="text-amber-600" />
        <StatCard title="Authorized Staff" value="24" icon={UserCircle} color="text-indigo-600" />
      </div>

      {isBranchManager && pendingDeletions.length > 0 && (
        <Card className="border-rose-200 bg-rose-50/20">
          <div className="p-6 border-b border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trash2 className="text-rose-600" size={24} />
              <h3 className="font-bold text-rose-900 uppercase tracking-widest text-xs">Hall Deletion Requests (Authorization Required)</h3>
            </div>
          </div>
          <div className="divide-y divide-rose-100">
            {pendingDeletions.map(room => (
              <div key={room.id} className="p-6 flex items-center justify-between hover:bg-white transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900">{room.name}</p>
                  <p className="text-xs text-rose-600 font-black uppercase tracking-widest">Type: {room.type} • Status: Pending Permanent Removal</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveDeletion(room.id)} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-md">Confirm Delete</button>
                  <button onClick={() => rejectDeletion(room.id)} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">Keep Hall</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {isBranchManager && pendingRooms.length > 0 && (
        <Card className="border-brand-200 bg-brand-50/20">
          <div className="p-6 border-b border-brand-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="text-brand-600" size={24} />
              <h3 className="font-bold text-brand-900 uppercase tracking-widest text-xs">Hall Proposals for Approval</h3>
            </div>
          </div>
          <div className="divide-y divide-brand-100">
            {pendingRooms.map(room => (
              <div key={room.id} className="p-6 flex items-center justify-between hover:bg-white transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900">{room.name}</p>
                  <p className="text-xs text-brand-600 font-black uppercase tracking-widest">{room.type} • Capacity: {room.capacity} • {room.location}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveRoom(room.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-md">Approve</button>
                  <button onClick={() => rejectRoom(room.id)} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {(isAdmin || isBranchManager) && (
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <Clock className="text-brand-600" size={20} />
              <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Awaiting Authorization</h3>
            </div>
            <button onClick={() => navigate('/bookings')} className="text-xs font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest">Expand Queue</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-black">Purpose & Faculty</th>
                  <th className="px-6 py-4 font-black">Location</th>
                  <th className="px-6 py-4 font-black">Schedule</th>
                  <th className="px-6 py-4 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingBookings.length === 0 ? (
                  <tr><td colSpan="4" className="p-12 text-center text-slate-400 font-bold">Queue clear. All requests processed.</td></tr>
                ) : (
                  pendingBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">{b.purpose}</p>
                        <p className="text-xs text-slate-500 font-medium">Req ID: {b.id}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-600">
                        {rooms.find(r => r.id === b.roomId)?.name}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">
                          {b.date ? format(new Date(b.date), 'MMM dd') : 'No Date'}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Period {b.slotId.replace('s','')}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => updateBookingStatus(b.id, BOOKING_STATUS.APPROVED)}
                            className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            <Check size={20} />
                          </button>
                          <button 
                            onClick={() => handleDeclineClick(b.id)}
                            className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <CalendarIcon className="text-brand-600" size={20} />
            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Request History Archive</h3>
          </div>
          <button onClick={() => navigate('/bookings')} className="text-xs font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest">Detailed View</button>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-100">
              {(bookings || []).filter(Boolean).slice(0, 10).map(b => (
                <tr key={b.id} className="hover:bg-slate-50/50 group transition-all">
                  <td className="px-6 py-4 w-12">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      b.status === BOOKING_STATUS.APPROVED ? 'bg-emerald-100 text-emerald-600' : 
                      b.status === BOOKING_STATUS.REJECTED ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {b.status === BOOKING_STATUS.APPROVED ? <Check size={16} /> : 
                       b.status === BOOKING_STATUS.REJECTED ? <X size={16} /> : <Clock size={16} />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{b.purpose}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {b.date ? format(new Date(b.date), 'EEEE, MMMM dd') : 'Unscheduled'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                      b.status === BOOKING_STATUS.APPROVED ? 'bg-emerald-50 text-emerald-700' : 
                      b.status === BOOKING_STATUS.REJECTED ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-brand-600 opacity-0 group-hover:opacity-100 transition-all">
                      <Search size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Rejection Modal */}
      <Modal 
        isOpen={rejectModal.isOpen} 
        onClose={() => setRejectModal({ ...rejectModal, isOpen: false })}
        title="Reject Reservation"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setRejectModal({ ...rejectModal, isOpen: false })}>Cancel</Button>
            <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleConfirmReject}>Confirm Rejection</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-4">
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-900">Provide Feedback</p>
              <p className="text-xs text-rose-700">Please explain why this request is being declined. You can also suggest an alternative room.</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason for Rejection</label>
            <textarea 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all min-h-[100px]"
              placeholder="e.g. Schedule overlap with maintenance..."
              value={rejectForm.reason}
              onChange={(e) => setRejectForm({ ...rejectForm, reason: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggested Alternative Room</label>
            <select 
              className="input-field"
              value={rejectForm.suggestion}
              onChange={(e) => setRejectForm({ ...rejectForm, suggestion: e.target.value })}
            >
              <option value="">No specific suggestion</option>
              {rooms.map(r => (
                <option key={r.id} value={r.name}>{r.name} ({r.location})</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
