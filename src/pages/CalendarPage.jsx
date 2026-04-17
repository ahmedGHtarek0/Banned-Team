import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Modal, Input } from '../components/ui';
import { 
  format, 
  startOfWeek, 
  addDays, 
  isSameDay, 
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  startOfToday
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalIcon, 
  Trash2, 
  CheckCircle2, 
  XSquare,
  Building,
  Clock,
  LayoutGrid,
  List,
  CalendarDays
} from 'lucide-react';
import { BOOKING_TYPES, BOOKING_STATUS } from '../data/mockData';

const CalendarPage = () => {
  const { bookings, timeSlots, rooms, isBranchManager, deleteBooking, updateBookingStatus } = useApp();
  const [view, setView] = useState('WEEK'); // DAY, WEEK, MONTH
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]?.id || '');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const monthDays = eachDayOfInterval({ start: startOfWeek(monthStart, { weekStartsOn: 1 }), end: endOfMonth(monthEnd) });

  const getBookingsForDay = (date, roomId) => {
    return bookings.filter(b => 
      b.roomId === (roomId || selectedRoom) && 
      isSameDay(parseISO(b.date), date) && 
      b.status === BOOKING_STATUS.APPROVED
    );
  };

  const getBookingForSlot = (date, slotId) => {
    return bookings.find(b => 
      isSameDay(parseISO(b.date), date) && 
      b.slotId === slotId && 
      b.roomId === selectedRoom &&
      b.status === BOOKING_STATUS.APPROVED
    );
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case BOOKING_TYPES.FIXED_LECTURE: return 'bg-indigo-500 text-white border-indigo-600';
      case BOOKING_TYPES.MULTI_PURPOSE: return 'bg-emerald-500 text-white border-emerald-600';
      case BOOKING_TYPES.EXCEPTIONAL: return 'bg-amber-500 text-white border-amber-600';
      default: return 'bg-slate-500';
    }
  };

  const handleDelete = (id) => {
    if (confirm('Permanently remove this reservation?')) {
      deleteBooking(id);
      setSelectedBooking(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-3">
             <CalendarDays className="text-brand-600" size={32} />
             Master Schedule
          </h1>
          <p className="text-slate-500 font-bold">Comprehensive oversight of all university hall utilization.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setView('DAY')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${view === 'DAY' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400'}`}>DAY</button>
            <button onClick={() => setView('WEEK')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${view === 'WEEK' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400'}`}>WEEK</button>
            <button onClick={() => setView('MONTH')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${view === 'MONTH' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400'}`}>MONTH</button>
          </div>
          <select 
            className="bg-transparent border-none outline-none font-bold text-sm text-slate-700 pr-4 ml-4"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>

      <Card className="p-4 bg-white border-slate-200 shadow-xl rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
             <button onClick={() => {
               if (view === 'DAY') setCurrentDate(addDays(currentDate, -1));
               else if (view === 'WEEK') setCurrentDate(addDays(currentDate, -7));
               else setCurrentDate(subMonths(currentDate, 1));
             }} className="p-2 hover:bg-slate-50 rounded-full border border-slate-200 transition-colors"><ChevronLeft size={20} /></button>
             <h2 className="text-xl font-black text-slate-900 tracking-tight min-w-[200px] text-center">
               {view === 'DAY' ? format(currentDate, 'EEEE, MMM d, yyyy') : 
                view === 'WEEK' ? `${format(weekStart, 'MMM d')} — ${format(addDays(weekStart, 6), 'MMM d, yyyy')}` : 
                format(currentDate, 'MMMM yyyy').toUpperCase()}
             </h2>
             <button onClick={() => {
               if (view === 'DAY') setCurrentDate(addDays(currentDate, 1));
               else if (view === 'WEEK') setCurrentDate(addDays(currentDate, 7));
               else setCurrentDate(addMonths(currentDate, 1));
             }} className="p-2 hover:bg-slate-50 rounded-full border border-slate-200 transition-colors"><ChevronRight size={20} /></button>
           </div>
           
           <div className="flex gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] font-black text-indigo-600">LECTURE</div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-[10px] font-black text-emerald-600">M-PURPOSE</div>
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-lg text-[10px] font-black text-amber-600">EXCEPTIONAL</div>
           </div>
        </div>

        {view === 'DAY' && (
          <div className="space-y-4">
            {timeSlots.map(slot => {
              const booking = getBookingForSlot(currentDate, slot.id);
              return (
                <div key={slot.id} className="flex gap-4 group">
                  <div className="w-24 py-4 text-center">
                    <p className="text-sm font-black text-slate-900">{slot.start}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{slot.end}</p>
                  </div>
                  <div className={`flex-1 rounded-2xl border-2 transition-all p-4 flex items-center justify-between ${booking ? getTypeStyle(booking.type) + ' shadow-lg border-transparent' : 'border-dashed border-slate-100 bg-slate-50/10'}`}>
                    {booking ? (
                      <>
                        <div>
                          <p className="text-[10px] font-black uppercase opacity-60">{booking.type.replace('_',' ')} Hall</p>
                          <h4 className="text-lg font-black uppercase italic tracking-tight">{booking.purpose}</h4>
                        </div>
                        {isBranchManager && (
                          <button onClick={() => handleDelete(booking.id)} className="p-3 bg-black/10 rounded-xl hover:bg-black/20 transition-all">
                             <Trash2 size={20} />
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-slate-300 text-xs font-bold uppercase italic tracking-widest">Available for Reservation</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === 'WEEK' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b border-r border-slate-100 bg-slate-50/50 w-24"></th>
                  {weekDays.map(day => (
                    <th key={day.toString()} className="p-4 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{format(day, 'EEE')}</p>
                      <p className={`text-xl font-black ${isSameDay(day, new Date()) ? 'text-brand-600' : 'text-slate-900'}`}>{format(day, 'd')}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(slot => (
                  <tr key={slot.id}>
                    <td className="p-4 border-r border-b border-slate-50 bg-slate-50/30 text-center">
                      <p className="text-xs font-black text-slate-800">{slot.start}</p>
                      <p className="text-[10px] font-bold text-slate-400 tracking-widest">{slot.end}</p>
                    </td>
                    {weekDays.map(day => {
                      const booking = getBookingForSlot(day, slot.id);
                      return (
                        <td key={day.toString() + slot.id} className="p-1 border-r border-b border-slate-50 h-32 relative group">
                          {booking ? (
                            <div 
                              onClick={() => setSelectedBooking(booking)}
                              className={`h-full w-full rounded-xl p-3 flex flex-col justify-between border-2 transition-all hover:scale-[1.03] cursor-pointer shadow-lg shadow-black/5 ${getTypeStyle(booking.type)}`}
                            >
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black uppercase opacity-60 tracking-tight">{booking.type.split('_')[0]}</span>
                                {isBranchManager && <Trash2 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-200" />}
                              </div>
                              <p className="text-xs font-black leading-tight uppercase line-clamp-3">{booking.purpose}</p>
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-lg border-2 border-dashed border-slate-100 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                              <CalIcon size={14} className="text-slate-300" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'MONTH' && (
          <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
               <div key={d} className="bg-slate-50 p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{d}</div>
             ))}
             {monthDays.map(day => {
               const dayBookings = getBookingsForDay(day);
               return (
                 <div key={day.toString()} className={`min-h-[140px] p-2 bg-white flex flex-col gap-1 transition-colors hover:bg-slate-50 shadow-[inset_0_0_1px_rgba(0,0,0,0.05)] ${!isSameMonth(day, currentDate) ? 'opacity-30' : ''}`}>
                    <span className={`text-xs font-black mb-2 px-2 py-1 rounded-md w-fit ${isSameDay(day, new Date()) ? 'bg-brand-600 text-white' : 'text-slate-900'}`}>{format(day, 'd')}</span>
                    <div className="flex flex-col gap-1 overflow-y-auto max-h-[100px] custom-scrollbar">
                      {dayBookings.map(b => (
                        <div 
                          key={b.id} 
                          onClick={() => setSelectedBooking(b)}
                          className={`px-2 py-1 rounded-lg text-[9px] font-black truncate border-l-4 shadow-sm cursor-pointer hover:translate-x-1 transition-transform ${getTypeStyle(b.type)}`}
                        >
                          {b.purpose.toUpperCase()}
                        </div>
                      ))}
                    </div>
                 </div>
               );
             })}
          </div>
        )}
      </Card>

      <Modal 
        isOpen={!!selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
        title="Reservation Overview"
        footer={
          <div className="flex gap-3 justify-between w-full">
            <div className="flex gap-2">
              {isBranchManager && (
                <Button onClick={() => handleDelete(selectedBooking.id)} className="bg-rose-600 hover:bg-rose-700 flex items-center gap-2 text-xs">
                  <Trash2 size={16} /> Delete Record
                </Button>
              )}
            </div>
            <Button variant="secondary" onClick={() => setSelectedBooking(null)}>Close View</Button>
          </div>
        }
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl text-white ${getTypeStyle(selectedBooking.type)} shadow-2xl shadow-indigo-500/20`}>
               <h3 className="text-2xl font-black uppercase italic tracking-tight">{selectedBooking.purpose}</h3>
               <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">{selectedBooking.type.replace('_',' ')} Hall Utilization</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <CalIcon size={20} className="text-brand-600" />
                    <div><p className="text-[10px] font-black uppercase text-slate-400">Date of Event</p><p className="text-sm font-bold">{format(parseISO(selectedBooking.date), 'PPPP')}</p></div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock size={20} className="text-brand-600" />
                    <div><p className="text-[10px] font-black uppercase text-slate-400">Reserved Period</p><p className="text-sm font-bold">Slot ID: {selectedBooking.slotId}</p></div>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Building size={20} className="text-brand-600" />
                    <div><p className="text-[10px] font-black uppercase text-slate-400">Target Hall</p><p className="text-sm font-bold">{rooms.find(r => r.id === selectedBooking.roomId)?.name}</p></div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 size={20} className="text-green-500" />
                    <div><p className="text-[10px] font-black uppercase text-slate-400">Current Status</p><p className="text-sm font-bold text-green-600 uppercase">{selectedBooking.status}</p></div>
                  </div>
               </div>
            </div>

            {selectedBooking.requestDetails && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 shadow-inner">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Provisioning Requirements</p>
                 <div className="flex flex-wrap gap-2">
                    {selectedBooking.requestDetails.requirements.laptop && <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold">Technical: Laptop</span>}
                    {selectedBooking.requestDetails.requirements.videoConference && <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold">Comm: Video Conf</span>}
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold">Audio: {selectedBooking.requestDetails.requirements.microphones} Mics</span>
                 </div>
                 <div className="pt-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Registered Manager</p>
                    <p className="text-sm font-bold text-slate-700">{selectedBooking.requestDetails.managerName} ({selectedBooking.requestDetails.managerMobile})</p>
                 </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarPage;
