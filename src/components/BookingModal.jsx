import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, Button, Input } from './ui';
import { BOOKING_TYPES, ROLES, BOOKING_STATUS } from '../data/mockData';
import { addHours, isBefore, startOfToday } from 'date-fns';
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

const BookingModal = ({ isOpen, onClose }) => {
  const { user, rooms, timeSlots, addBooking, isSecretary, isEmployee, isAdmin, isBranchManager } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conflictData, setConflictData] = useState(null);
  
  const [formData, setFormData] = useState({
    roomId: '',
    slotId: '',
    date: '',
    type: BOOKING_TYPES.MULTI_PURPOSE,
    purpose: '',
    managerName: user?.name || '',
    managerTitle: '',
    managerMobile: '',
    microphones: 0,
    laptop: false,
    videoConference: false
  });

  // Reset error/loading when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
      setLoading(false);
      setConflictData(null);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setConflictData(null);

    // Basic validation
    if (!formData.roomId || !formData.slotId || !formData.date || !formData.purpose) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const bookingDate = new Date(formData.date);
    const now = new Date();
    
    // RBAC Rule Enforcement
    if (!isBranchManager) {
      if (isEmployee) {
        const minDate = addHours(now, 24);
        if (isBefore(bookingDate, minDate)) {
          setError('Employees must book at least 24 hours in advance.');
          setLoading(false);
          return;
        }
      }

      if (isSecretary) {
        const minDate = addHours(now, 48);
        if (isBefore(bookingDate, minDate)) {
          setError('Secretaries must book at least 48 hours in advance.');
          setLoading(false);
          return;
        }
        if (formData.type !== BOOKING_TYPES.MULTI_PURPOSE) {
          setError('Secretaries can only book Multi-Purpose rooms.');
          setLoading(false);
          return;
        }
      }
    }

    const bookingPayload = {
      userId: user.id,
      roomId: formData.roomId,
      date: new Date(formData.date).toISOString(),
      slotId: formData.slotId,
      type: formData.type,
      purpose: formData.purpose,
      status: isAdmin ? BOOKING_STATUS.APPROVED : BOOKING_STATUS.PENDING,
      requestDetails: formData.type === BOOKING_TYPES.MULTI_PURPOSE ? {
        managerName: formData.managerName,
        managerTitle: formData.managerTitle,
        managerMobile: formData.managerMobile,
        requirements: {
          microphones: formData.microphones,
          laptop: formData.laptop,
          videoConference: formData.videoConference
        }
      } : null
    };

    // Simulate server processing
    setTimeout(() => {
      const result = addBooking(bookingPayload);
      
      if (result.success) {
        setLoading(false);
        onClose();
        setFormData({ ...formData, purpose: '', roomId: '', date: '', slotId: '' });
      } else {
        setLoading(false);
        if (result.suggestions) {
          setConflictData(result);
        } else {
          setError(result.message || 'Operation failed. Please try again.');
        }
      }
    }, 800);
  };

  const handleApplySuggestion = (suggestionId) => {
    setFormData({ ...formData, roomId: suggestionId });
    setConflictData(null);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Institutional Room Reservation"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Validating...
              </span>
            ) : 'Submit Request'}
          </Button>
        </div>
      }
    >
      <form className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-3 animate-shake">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {conflictData && (
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-yellow-800 font-bold text-sm">
              <AlertTriangle size={16} />
              Conflict Detected
            </div>
            <p className="text-xs text-yellow-700">The selected hall is taken. Suggested alternatives:</p>
            <div className="flex flex-col gap-2">
              {conflictData.suggestions.map(room => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => handleApplySuggestion(room.id)}
                  className="flex items-center justify-between p-3 bg-white border border-yellow-200 rounded-lg hover:border-yellow-400 transition-colors text-left group"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">{room.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{room.location}</p>
                  </div>
                  <CheckCircle2 size={16} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Event Type</label>
            <select 
              className="input-field"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              disabled={isSecretary || loading}
            >
              {isSecretary ? (
                <option value={BOOKING_TYPES.MULTI_PURPOSE}>Multi-Purpose</option>
              ) : (
                <>
                  <option value={BOOKING_TYPES.MULTI_PURPOSE}>Multi-Purpose</option>
                  <option value={BOOKING_TYPES.FIXED_LECTURE}>Lecture Hall</option>
                  {(isAdmin || isBranchManager) && <option value={BOOKING_TYPES.EXCEPTIONAL}>Exceptional Event</option>}
                </>
              )}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Target Hall</label>
            <select 
              className="input-field"
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              required
              disabled={loading}
            >
              <option value="">Select Hall...</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Date</label>
            <Input 
              type="date" 
              min={startOfToday().toISOString().split('T')[0]}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Time Slot</label>
            <select 
              className="input-field"
              value={formData.slotId}
              onChange={(e) => setFormData({ ...formData, slotId: e.target.value })}
              required
              disabled={loading}
            >
              <option value="">Choose Slot...</option>
              {timeSlots.map(s => (
                <option key={s.id} value={s.id}>{s.start} - {s.end}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Purpose of Utilization</label>
          <Input 
            placeholder="e.g. Masterclass in Web Security" 
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        {formData.type === BOOKING_TYPES.MULTI_PURPOSE && (
          <div className="pt-4 mt-4 border-t border-slate-100 space-y-4 animate-fade-in bg-slate-50/50 p-4 rounded-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Manager Name</label>
                <Input value={formData.managerName} onChange={(e) => setFormData({ ...formData, managerName: e.target.value })} disabled={loading} className="bg-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Contact</label>
                <Input value={formData.managerMobile} onChange={(e) => setFormData({ ...formData, managerMobile: e.target.value })} disabled={loading} className="bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <label className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-brand-300 transition-colors shadow-sm">
                <input type="checkbox" checked={formData.laptop} onChange={(e) => setFormData({ ...formData, laptop: e.target.checked })} className="mb-2" disabled={loading} />
                <span className="text-[10px] font-bold text-slate-600">Laptop</span>
              </label>
              <label className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-brand-300 transition-colors shadow-sm">
                <input type="checkbox" checked={formData.videoConference} onChange={(e) => setFormData({ ...formData, videoConference: e.target.checked })} className="mb-2" disabled={loading} />
                <span className="text-[10px] font-bold text-slate-600">V-Conf</span>
              </label>
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                 <input type="number" min="0" value={formData.microphones} onChange={(e) => setFormData({ ...formData, microphones: e.target.value })} className="w-10 text-center bg-transparent font-bold text-sm outline-none" disabled={loading} />
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Mics</span>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default BookingModal;
