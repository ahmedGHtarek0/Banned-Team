import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS, MOCK_BOOKINGS, MOCK_ROOMS, MOCK_TIME_SLOTS, BOOKING_STATUS, ROLES, BOOKING_TYPES } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- Persistent State ---
  const [users, setUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem('users');
      return savedUsers ? JSON.parse(savedUsers) : MOCK_USERS;
    } catch { return MOCK_USERS; }
  });

  const [pendingUsers, setPendingUsers] = useState(() => {
    try {
      const savedPending = localStorage.getItem('pendingUsers');
      return savedPending ? JSON.parse(savedPending) : [];
    } catch { return []; }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch { return null; }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const savedBookings = localStorage.getItem('bookings');
      return savedBookings ? JSON.parse(savedBookings) : MOCK_BOOKINGS;
    } catch { return MOCK_BOOKINGS; }
  });

  const [rooms, setRoomsState] = useState(() => {
    try {
      const savedRooms = localStorage.getItem('rooms');
      return savedRooms ? JSON.parse(savedRooms) : MOCK_ROOMS;
    } catch { return MOCK_ROOMS; }
  });

  const [pendingRooms, setPendingRooms] = useState(() => {
    try {
      const savedPRooms = localStorage.getItem('pendingRooms');
      return savedPRooms ? JSON.parse(savedPRooms) : [];
    } catch { return []; }
  });

  const [pendingDeletions, setPendingDeletions] = useState(() => {
    try {
      const savedDeletions = localStorage.getItem('pendingDeletions');
      return savedDeletions ? JSON.parse(savedDeletions) : [];
    } catch { return []; }
  });

  const [timeSlots, setTimeSlotsState] = useState(() => {
    try {
      const savedSlots = localStorage.getItem('timeSlots');
      return savedSlots ? JSON.parse(savedSlots) : MOCK_TIME_SLOTS;
    } catch { return MOCK_TIME_SLOTS; }
  });

  const [darkMode, setDarkModeState] = useState(() => {
    try {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode === 'true';
    } catch { return false; }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const savedNotes = localStorage.getItem('notifications');
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch { return []; }
  });

  // --- Theme Toggle ---
  const toggleDarkMode = () => {
    setDarkModeState(prev => {
      const newVal = !prev;
      localStorage.setItem('darkMode', newVal.toString());
      if (newVal) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return newVal;
    });
  };

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []); // Run once on mount

  // --- LocalStorage Sync ---
  const saveToDisk = () => {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('rooms', JSON.stringify(rooms));
    localStorage.setItem('pendingRooms', JSON.stringify(pendingRooms));
    localStorage.setItem('pendingDeletions', JSON.stringify(pendingDeletions));
    localStorage.setItem('timeSlots', JSON.stringify(timeSlots));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('darkMode', darkMode.toString());
    if (user) localStorage.setItem('user', JSON.stringify(user));
  };

  useEffect(() => { saveToDisk(); }, [users, pendingUsers, user, bookings, rooms, pendingRooms, pendingDeletions, timeSlots, notifications]);

  // --- Auth & Admin Logic ---
  const login = (username, password) => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return { success: true, user: foundUser };
    }
    const isPending = pendingUsers.find(u => u.username === username);
    if (isPending) return { success: false, message: 'Your account is pending admin approval.' };
    return { success: false, message: 'Invalid credentials' };
  };

  const signup = (signupData) => {
    const exists = users.find(u => u.username === signupData.username) || 
                   pendingUsers.find(u => u.username === signupData.username);
    if (exists) return { success: false, message: 'Username is taken' };
    const newPending = { ...signupData, id: Math.random().toString(36).substr(2, 9), avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signupData.username}`, createdAt: new Date().toISOString() };
    setPendingUsers(prev => [...prev, newPending]);
    addNotification({ id: Math.random().toString(36).substr(2, 9), userId: '1', title: 'Enrollment Request', message: `${signupData.name} wants to join.`, type: 'WARNING', read: false, createdAt: new Date().toISOString() });
    return { success: true };
  };

  const approveUser = (userId) => {
    const target = pendingUsers.find(u => u.id === userId);
    if (target) {
      setUsers(prev => [...prev, target]);
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const logout = () => setUser(null);

  // --- Booking Logic ---
  const addBooking = (bookingData) => {
    let status = BOOKING_STATUS.PENDING;
    let notifyId = '1';
    if (user?.role === ROLES.BRANCH_MANAGER) {
      status = BOOKING_STATUS.APPROVED;
    } else if (user?.role === ROLES.ADMIN) {
      status = (bookingData.type === BOOKING_TYPES.MULTI_PURPOSE) ? BOOKING_STATUS.PENDING : BOOKING_STATUS.APPROVED;
      if (status === BOOKING_STATUS.PENDING) notifyId = '2';
    }
    const newBooking = { ...bookingData, id: 'B' + Math.floor(Math.random() * 9000 + 1000), status, createdAt: new Date().toISOString() };
    setBookings(prev => [newBooking, ...prev]);
    addNotification({ id: Math.random().toString(36).substr(2, 9), userId: status === BOOKING_STATUS.APPROVED ? user?.id : notifyId, title: 'Schedule Update', message: `${user?.name} processed ${newBooking.purpose}.`, type: 'INFO', read: false, createdAt: new Date().toISOString() });
    return { success: true, booking: newBooking };
  };

  const updateBookingStatus = (bookingId, status) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  const deleteBooking = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  // --- Room Inventory Logic ---
  const addRoom = (roomData) => {
    const isFaiselOrDirect = (user?.role === ROLES.BRANCH_MANAGER) || (roomData.type === 'LECTURE' && user?.role === ROLES.ADMIN);
    const newRoom = { ...roomData, id: 'r' + (rooms.length + pendingRooms.length + 10), isApproved: isFaiselOrDirect };
    if (isFaiselOrDirect) setRoomsState(prev => [...prev, newRoom]);
    else setPendingRooms(prev => [...prev, newRoom]);
  };

  const removeRoom = (roomId) => {
    const target = rooms.find(r => r.id === roomId);
    // Logic: Faisel (Branch Manager) deletes EVERYTHING directly.
    if (user?.role === ROLES.BRANCH_MANAGER) {
      setRoomsState(prev => prev.filter(r => r.id !== roomId));
      return;
    }
    // Akram Admin: Restricted for Multi-Purpose. Needs Faisel's approval.
    if (target?.type === 'MULTI_PURPOSE' && user?.role === ROLES.ADMIN) {
      alert('Branch Manager approval is required to remove Multi-Purpose halls.');
      setPendingDeletions(prev => [...prev, target]);
      addNotification({ id: Math.random().toString(36).substr(2, 9), userId: '2', title: 'Room Deletion Request', message: `Akram requested to delete ${target.name}.`, type: 'WARNING', read: false, createdAt: new Date().toISOString() });
      return;
    }
    setRoomsState(prev => prev.filter(r => r.id !== roomId));
  };

  const approveDeletion = (roomId) => {
    setRoomsState(prev => prev.filter(r => r.id !== roomId));
    setPendingDeletions(prev => prev.filter(r => r.id !== roomId));
  };

  const rejectDeletion = (roomId) => {
    setPendingDeletions(prev => prev.filter(r => r.id !== roomId));
  };

  const approveRoom = (roomId) => {
    const target = pendingRooms.find(r => r.id === roomId);
    if (target) {
      setRoomsState(prev => [...prev, { ...target, isApproved: true }]);
      setPendingRooms(prev => prev.filter(r => r.id !== roomId));
    }
  };

  const rejectRoom = (roomId) => {
    setPendingRooms(prev => prev.filter(r => r.id !== roomId));
  };

  const addTimeSlot = (slot) => setTimeSlotsState(prev => [...prev, { ...slot, id: 's' + (timeSlots.length + 10) }]);
  const addNotification = (note) => {
    setNotifications(prev => [note, ...prev]);
  };

  const markNotificationAsRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const delegateAdminRole = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, role: ROLES.ADMIN, isDelegated: true };
        if (user?.id === userId) setUser(updated);
        return updated;
      }
      return u;
    }));
  };

  const revokeDelegation = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, role: ROLES.EMPLOYEE, isDelegated: false };
        if (user?.id === userId) setUser(updated);
        return updated;
      }
      return u;
    }));
  };

  const isAdmin = user?.role === ROLES.ADMIN;
  const isBranchManager = user?.role === ROLES.BRANCH_MANAGER;
  const isEmployee = user?.role === ROLES.EMPLOYEE;
  const isSecretary = user?.role === ROLES.SECRETARY;

  return (
    <AppContext.Provider value={{
      user, login, signup, logout,
      users, pendingUsers, approveUser,
      bookings, addBooking, deleteBooking, updateBookingStatus,
      rooms, addRoom, removeRoom, pendingRooms, approveRoom, rejectRoom, pendingDeletions, approveDeletion, rejectDeletion,
      timeSlots, addTimeSlot, setTimeSlots: setTimeSlotsState,
      notifications, markNotificationAsRead, addNotification,
      delegateAdminRole, revokeDelegation,
      darkMode, toggleDarkMode,
      isAdmin, isBranchManager, isEmployee, isSecretary,
      saveToDisk
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
