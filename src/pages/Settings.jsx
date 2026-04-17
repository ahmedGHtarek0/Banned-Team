import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Input, Modal } from '../components/ui';
import { 
  Building2, 
  Clock, 
  ShieldAlert, 
  Save, 
  Plus, 
  Trash2,
  Moon,
  Sun,
  UserCircle,
  CheckCircle2,
  Users,
  ShieldCheck
} from 'lucide-react';
import { ROLES } from '../data/mockData';

const Settings = () => {
  const { 
    rooms, 
    timeSlots, 
    setTimeSlots, 
    addRoom, 
    removeRoom, 
    addTimeSlot, 
    pendingUsers, 
    approveUser, 
    users, 
    delegateAdminRole, 
    revokeDelegation,
    saveToDisk,
    isAdmin,
    isBranchManager,
    pendingRooms,
    approveRoom,
    rejectRoom
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('rooms');
  const [saveStatus, setSaveStatus] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  const [roomForm, setRoomForm] = useState({ name: '', capacity: 50, type: 'LECTURE', location: '' });
  const [slotForm, setSlotForm] = useState({ start: '', end: '' });

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (roomForm.name) {
      addRoom(roomForm);
      setIsRoomModalOpen(false);
      setRoomForm({ name: '', capacity: 50, type: 'LECTURE', location: '' });
    }
  };

  const handleCreateSlot = (e) => {
    e.preventDefault();
    if (slotForm.start && slotForm.end) {
      addTimeSlot(slotForm);
      setIsSlotModalOpen(false);
      setSlotForm({ start: '', end: '' });
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const handleBulkPromote = () => {
    if (selectedUsers.length === 0) return;
    if (confirm(`Promote ${selectedUsers.length} users to Admin level?`)) {
      selectedUsers.forEach(id => delegateAdminRole(id));
      setSelectedUsers([]);
      alert('Users promoted successfully!');
    }
  };

  const handleManualSave = () => {
    saveToDisk();
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-brand-600" size={32} />
            Institutional Master Console
          </h1>
          <p className="text-slate-500 font-medium font-mono text-xs uppercase tracking-widest mt-1">Global Configuration & Identity Management</p>
        </div>
        <Button onClick={handleManualSave} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">
          <Save size={20} />
          Save Application State
        </Button>
      </div>

      <div className="flex bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm w-fit">
        {['rooms', 'slots', 'users', 'enrollment'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            {tab === 'rooms' ? 'Campus Inventory' : tab === 'slots' ? 'Scheduling' : tab === 'users' ? 'Staff Directory' : 'Enrollment'}
          </button>
        ))}
      </div>

      {activeTab === 'rooms' && (
        <Card className="animate-fade-in divide-y divide-slate-100">
          <div className="p-6 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <Building2 className="text-brand-600" size={24} />
              <h3 className="font-bold text-slate-900">Hall Inventory</h3>
            </div>
            <Button onClick={() => setIsRoomModalOpen(true)} className="flex items-center gap-2">
              <Plus size={18} />
              Add Room
            </Button>
          </div>
          <div className="overflow-x-auto p-0">
            <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-3">Hall Name</th>
                    <th className="px-6 py-3">Capacity</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rooms.map(room => (
                  <tr key={room.id} className="hover:bg-slate-50/30 group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{room.name}</p>
                      <p className={`text-[10px] font-black uppercase tracking-tighter ${room.type === 'LECTURE' ? 'text-indigo-500' : 'text-emerald-500'}`}>{room.type}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{room.capacity} Seats</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-400">{room.location}</td>
                    <td className="px-6 py-4 text-right">
                      {/* Akram can only delete Lecture halls directly. MP needs Faisel approval logic in context. */}
                      <button onClick={() => removeRoom(room.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-all transform hover:scale-110">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {rooms.length === 0 && <tr><td colSpan="4" className="p-12 text-center text-slate-300 italic font-bold">No halls registered in the live inventory yet.</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Pending Proposals Section (Only for Faisel oversight) */}
          {isBranchManager && (useApp().pendingRooms || []).length > 0 && (
            <div className="mt-8 border-t-4 border-amber-200 bg-amber-50/10">
               <div className="p-4 bg-amber-50 text-amber-800 flex items-center gap-2">
                  <ShieldAlert size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Institutional Authorization (Proposals from Akram)</span>
               </div>
               <table className="w-full text-left">
                  <tbody className="divide-y divide-amber-100">
                    {useApp().pendingRooms.map(r => (
                      <tr key={r.id} className="bg-white/50 hover:bg-white transition-colors">
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold text-slate-800">{r.name}</p>
                           <p className="text-[10px] font-black text-amber-600 uppercase">PROPOSED {r.type}</p>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{r.capacity} Seats</td>
                        <td className="px-6 py-4 text-right pr-6">
                           <div className="flex gap-2 justify-end">
                              <Button onClick={() => approveRoom(r.id)} className="bg-emerald-600 hover:bg-emerald-700 text-[10px] px-3 py-1.5 h-auto uppercase font-black">Approve Hall</Button>
                              <Button onClick={() => rejectRoom(r.id)} variant="secondary" className="text-[10px] px-3 py-1.5 h-auto uppercase font-black border-rose-200 text-rose-600">Reject</Button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'slots' && (
        <Card className="animate-fade-in border-indigo-100 shadow-2xl">
           <div className="p-6 border-b border-indigo-50 flex justify-between items-center bg-indigo-50/20">
              <div className="flex items-center gap-3">
                <Clock className="text-indigo-600" size={24} />
                <div>
                   <h3 className="font-bold text-slate-900">Institutional Scheduling</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global University Time Slots</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setTimeSlots([
                  { id: 's1', start: '08:00', end: '10:00' },
                  { id: 's2', start: '10:00', end: '12:00' },
                  { id: 's3', start: '12:00', end: '14:00' },
                  { id: 's4', start: '14:00', end: '16:00' },
                  { id: 's5', start: '16:00', end: '18:00' }
                ])} variant="secondary" className="flex items-center gap-2 text-[10px] font-black uppercase">
                  <Sun size={14} /> Standard
                </Button>
                <Button onClick={() => setTimeSlots([
                  { id: 'r1', start: '09:00', end: '09:55' },
                  { id: 'r2', start: '10:00', end: '10:55' },
                  { id: 'r3', start: '11:00', end: '11:55' },
                  { id: 'r4', start: '12:00', end: '12:55' },
                  { id: 'r5', start: '13:00', end: '13:55' },
                  { id: 'r6', start: '14:00', end: '14:55' }
                ])} className="bg-indigo-600 flex items-center gap-2 text-[10px] font-black uppercase">
                  <Moon size={14} /> Ramadan Mode
                </Button>
                <Button onClick={() => setIsSlotModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-[10px] font-black uppercase ml-2">
                  <Plus size={14} /> Custom Slot
                </Button>
              </div>
           </div>
           <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/30">
              {timeSlots.map(slot => (
                <div key={slot.id} className="p-6 bg-white border border-slate-200 rounded-3xl flex flex-col gap-2 relative group hover:border-indigo-400 transition-all hover:shadow-lg shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Interval</span>
                  <span className="text-xl font-black text-slate-900 italic tracking-tighter">{slot.start} — {slot.end}</span>
                  <button onClick={() => setTimeSlots(timeSlots.filter(s => s.id !== slot.id))} className="absolute top-4 right-4 text-rose-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
           </div>
        </Card>
      )}

      {activeTab === 'users' && (
        <Card className="animate-fade-in">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Users className="text-brand-600" size={24} />
                <h3 className="font-bold text-slate-900">Global Staff Directory</h3>
              </div>
              <Button 
                onClick={handleBulkPromote}
                disabled={selectedUsers.length === 0}
                className={`flex items-center gap-2 ${selectedUsers.length > 0 ? 'bg-amber-600 animate-pulse' : 'bg-slate-200'}`}
              >
                <ShieldCheck size={18} />
                Promote Selected ({selectedUsers.length})
              </Button>
           </div>
           <div className="overflow-x-auto p-0">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                       <th className="px-6 py-3 w-12"></th>
                       <th className="px-6 py-3">Staff Identity</th>
                       <th className="px-6 py-3">Official Username</th>
                       <th className="px-6 py-3">Assigned Role</th>
                       <th className="px-6 py-3 text-right">Auth Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${selectedUsers.includes(u.id) ? 'bg-amber-50/30' : ''}`}>
                         <td className="px-6 py-4">
                           <input 
                             type="checkbox" 
                             checked={selectedUsers.includes(u.id)}
                             onChange={() => toggleUserSelection(u.id)}
                             disabled={u.role === 'ADMIN' || u.role === 'BRANCH_MANAGER'}
                             className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                           />
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <img src={u.avatar} alt="" className="w-8 h-8 rounded-full shadow-sm" />
                               <span className="text-sm font-bold text-slate-800">{u.name}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-sm font-medium text-slate-500 italic">@{u.username}</td>
                         <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                              u.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' :
                              u.role === 'BRANCH_MANAGER' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                               {u.role.replace('_', ' ')}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            {u.role !== 'BRANCH_MANAGER' && (
                              u.role === 'ADMIN' ? (
                                <button onClick={() => revokeDelegation(u.id)} className="text-[10px] font-black text-rose-500 uppercase hover:underline">Revoke Power</button>
                              ) : (
                                <button onClick={() => delegateAdminRole(u.id)} className="text-[10px] font-black text-brand-600 uppercase hover:underline">Make Admin</button>
                              )
                            )}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </Card>
      )}

      {activeTab === 'enrollment' && (
        <Card className="animate-fade-in">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3"><ShieldAlert className="text-red-500" size={24} /><h3 className="font-bold text-slate-900">Awaiting Approval</h3></div>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingUsers.length === 0 ? <div className="p-12 text-center text-slate-400 font-bold italic tracking-wide"><p className="text-sm">No new staff pending enrollment</p></div> : pendingUsers.map(u => (
              <div key={u.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
                  <div><p className="text-sm font-bold text-slate-900">{u.name}</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{u.role} Requested</p></div>
                </div>
                <div className="flex gap-2">
                   <Button onClick={() => approveUser(u.id)} className="bg-emerald-600 hover:bg-emerald-700 text-xs px-4 py-2 rounded-xl">Authorize Access</Button>
                   <Button variant="secondary" className="text-xs px-4 py-2 border-slate-200">Decline</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {saveStatus && (
        <div className="fixed bottom-8 right-8 animate-slide-up bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 z-50 border border-slate-700 backdrop-blur-md">
          <CheckCircle2 size={24} className="text-emerald-500" />
          <div className="flex flex-col">
             <span className="font-black text-sm uppercase tracking-widest">State Persisted</span>
             <span className="text-[10px] text-slate-400 font-bold uppercase">Institutional memory updated successfully</span>
          </div>
        </div>
      )}

       <Modal isOpen={isRoomModalOpen} onClose={() => setIsRoomModalOpen(false)} title="New Campus Hall" footer={<div className="flex gap-3"><Button variant="secondary" onClick={() => setIsRoomModalOpen(false)}>Cancel</Button><Button onClick={handleCreateRoom}>Submit Proposal</Button></div>}>
          <div className="space-y-4">
             <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hall Label</label><Input placeholder="Great Hall..." value={roomForm.name} onChange={e => setRoomForm({...roomForm, name: e.target.value})} /></div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration</label><select className="input-field" value={roomForm.type} onChange={e => setRoomForm({...roomForm, type: e.target.value})}><option value="LECTURE">Lecture Hall</option><option value="MULTI_PURPOSE">Multi-Purpose</option></select></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seats</label><Input type="number" value={roomForm.capacity} onChange={e => setRoomForm({...roomForm, capacity: e.target.value})} /></div>
             </div>
             <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campus Coordinates</label><Input placeholder="Wing C, Level 2" value={roomForm.location} onChange={e => setRoomForm({...roomForm, location: e.target.value})} /></div>
          </div>
       </Modal>

       <Modal isOpen={isSlotModalOpen} onClose={() => setIsSlotModalOpen(false)} title="Define Custom Time Slot" footer={<div className="flex gap-3"><Button variant="secondary" onClick={() => setIsSlotModalOpen(false)}>Cancel</Button><Button onClick={handleCreateSlot}>Add Slot</Button></div>}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Time</label><Input type="time" value={slotForm.start} onChange={e => setSlotForm({...slotForm, start: e.target.value})} /></div>
            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Time</label><Input type="time" value={slotForm.end} onChange={e => setSlotForm({...slotForm, end: e.target.value})} /></div>
          </div>
       </Modal>
    </div>
  );
};

export default Settings;
