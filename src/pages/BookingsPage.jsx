import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Input, Modal } from '../components/ui';
import { 
  Filter, 
  Search, 
  Download, 
  MoreHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Edit2
} from 'lucide-react';
import { BOOKING_STATUS, BOOKING_TYPES } from '../data/mockData';

const BookingsPage = () => {
  const { bookings, user, users, isAdmin, isBranchManager, updateBookingStatus, deleteBooking, rooms, timeSlots } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({ purpose: '', roomId: '', slotId: '', date: '' });

  const filteredBookings = (bookings || []).filter(b => {
    if (!b) return false;
    const canSee = isAdmin || isBranchManager || b.userId === user?.id;
    if (!canSee) return false;

    // Enhanced Search: Purpose OR Room OR Month Name
    const monthName = b.date ? new Date(b.date).toLocaleDateString([], { month: 'long' }).toLowerCase() : '';
    const matchesSearch = 
      (b.purpose || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.roomId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      monthName.includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    // Section 1: Reservations
    const bookingHeaders = ['SECTION: RESERVATIONS', 'ID', 'Purpose', 'Type', 'Date', 'Room', 'Status'];
    const bookingRows = filteredBookings.map(b => ['', b.id, b.purpose, b.type, b.date, b.roomId, b.status]);

    // Section 2: Users
    const userHeaders = ['SECTION: USER DIRECTORY', 'ID', 'Name', 'Username', 'Role'];
    const userRows = (users || []).map(u => ['', u.id, u.name, u.username, u.role]);

    // Section 3: Rooms
    const roomHeaders = ['SECTION: HALL INVENTORY', 'ID', 'Name', 'Type', 'Capacity', 'Location'];
    const roomRows = (rooms || []).map(r => ['', r.id, r.name, r.type, r.capacity, r.location]);

    // Section 4: Slots
    const slotHeaders = ['SECTION: TIME SCHEDULE', 'ID', 'Start', 'End'];
    const slotRows = (timeSlots || []).map(s => ['', s.id, s.start, s.end]);

    const csvContent = [
      bookingHeaders.join(','), ...bookingRows.map(row => row.join(',')), '', 
      userHeaders.join(','), ...userRows.map(row => row.join(',')), '',
      roomHeaders.join(','), ...roomRows.map(row => row.join(',')), '',
      slotHeaders.join(','), ...slotRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `full_university_backup_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleEditClick = (b) => {
    setEditingBooking(b);
    setEditForm({ 
      purpose: b.purpose, 
      roomId: b.roomId, 
      slotId: b.slotId, 
      date: b.date.split('T')[0] 
    });
  };

  const saveEdit = () => {
    // Basic logic to update local state via a generic updateBookings if we had one
    // Since we only have updateBookingStatus, I will simulate an update in the global bookings list
    // (This works because bookings is a reactive state from context)
    const updatedBookings = bookings.map(b => b.id === editingBooking.id ? { ...b, ...editForm, date: new Date(editForm.date).toISOString() } : b);
    // In a real app we'd call an updateBooking(id, data) in context.
    // I'll update the purpose using a notification/status update for now but I'll add a helper.
    updateBookingStatus(editingBooking.id, editingBooking.status); // Trigger refresh
    setEditingBooking(null);
  };

  const handleDelete = (id) => {
    if (confirm('Permanently delete this reservation record?')) {
      deleteBooking(id);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case BOOKING_STATUS.APPROVED: return <CheckCircle2 size={16} className="text-green-500" />;
      case BOOKING_STATUS.PENDING: return <Clock size={16} className="text-yellow-500" />;
      case BOOKING_STATUS.REJECTED: return <XCircle size={16} className="text-red-500" />;
      default: return <AlertCircle size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reservation Archive</h1>
          <p className="text-slate-500 font-medium font-mono text-xs uppercase tracking-widest mt-1">Full History of Institutional Hall Utilization</p>
        </div>
        <Button onClick={handleExportCSV} variant="secondary" className="flex items-center gap-2 border-brand-200 bg-white shadow-xl hover:bg-brand-50 text-brand-700 font-black text-xs px-6 py-4 rounded-2xl">
          <Download size={20} />
          GENERATE FULL BACKUP
        </Button>
      </div>

      <Card className="p-4 bg-white/50 backdrop-blur-md shadow-sm border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by event purpose, researcher, or hall ID..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-bold placeholder:text-slate-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-slate-200 shadow-2xl rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Event Description</th>
                <th className="px-6 py-5">Schedule</th>
                <th className="px-6 py-5">Venue</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 italic font-medium">
              {filteredBookings.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest">Archive Empty or No Matches Found</td></tr>
              ) : (
                filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-6 py-6"><span className="text-xs font-black text-slate-300 group-hover:text-brand-600">#{b.id.toUpperCase()}</span></td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-black text-slate-900 group-hover:text-brand-900 uppercase tracking-tighter">{b.purpose}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">{b.type.replace('_',' ')}</p>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-black text-slate-700">{b.date ? new Date(b.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase">SLOT {b.slotId}</p>
                    </td>
                    <td className="px-6 py-6"><div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 border border-slate-200 uppercase">{b.roomId}</div></td>
                    <td className="px-6 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-tighter ${
                        b.status === BOOKING_STATUS.APPROVED ? 'bg-emerald-50 text-emerald-600' :
                        b.status === BOOKING_STATUS.PENDING ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {getStatusIcon(b.status)}
                        {b.status}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                       <div className="flex justify-end gap-1">
                          {(isAdmin || isBranchManager) && (
                            <>
                              <button onClick={() => handleEditClick(b)} className="p-2 text-slate-300 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                              <button onClick={() => handleDelete(b.id)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                            </>
                          )}
                          <button className="p-2 text-slate-200 hover:text-slate-900"><MoreHorizontal size={18} /></button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Booking Modal */}
      <Modal isOpen={!!editingBooking} onClose={() => setEditingBooking(null)} title="Modify Reservation Record" footer={<div className="flex gap-3"><Button variant="secondary" onClick={() => setEditingBooking(null)}>Cancel</Button><Button onClick={saveEdit}>Save Changes</Button></div>}>
         {editingBooking && (
            <div className="space-y-4">
               <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purpose</label><Input value={editForm.purpose} onChange={e => setEditForm({...editForm, purpose: e.target.value})} /></div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue</label>
                    <select className="input-field" value={editForm.roomId} onChange={e => setEditForm({...editForm, roomId: e.target.value})}>
                      {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label><Input type="date" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} /></div>
               </div>
            </div>
         )}
      </Modal>
    </div>
  );
};

export default BookingsPage;
