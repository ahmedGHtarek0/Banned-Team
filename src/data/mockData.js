export const ROLES = {
  ADMIN: 'ADMIN',
  BRANCH_MANAGER: 'BRANCH_MANAGER',
  EMPLOYEE: 'EMPLOYEE',
  SECRETARY: 'SECRETARY',
};

export const BOOKING_TYPES = {
  FIXED_LECTURE: 'FIXED_LECTURE',
  MULTI_PURPOSE: 'MULTI_PURPOSE',
  EXCEPTIONAL: 'EXCEPTIONAL',
};

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

export const MOCK_USERS = [
  { id: '1', username: 'akram', password: '1234', name: 'Akram Admin', role: ROLES.ADMIN, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Akram' },
  { id: '2', username: 'faisel', password: '123', name: 'Faisel Manager', role: ROLES.BRANCH_MANAGER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Faisel' },
  { id: '3', username: 'lila', password: '123', name: 'Lila Employee', role: ROLES.EMPLOYEE, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lila' },
  { id: '4', username: 'sara', password: '123', name: 'Sara Secretary', role: ROLES.SECRETARY, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara' },
  { id: '5', username: 'faisle', password: '123', name: 'Faisle Manager', role: ROLES.BRANCH_MANAGER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Faisel' },
];

export const MOCK_ROOMS = [
  { id: 'r1', name: 'Main Lecture Hall', capacity: 200, type: 'LECTURE', location: 'Section A, 1st Floor' },
  { id: 'r2', name: 'Tech Hall B', capacity: 150, type: 'LECTURE', location: 'Section A, 2nd Floor' },
  { id: 'r3', name: 'Grand Ballroom', capacity: 500, type: 'MULTI_PURPOSE', location: 'Main Building' },
  { id: 'r4', name: 'Seminar Room 1', capacity: 50, type: 'MULTI_PURPOSE', location: 'Library Annex' },
];

export const MOCK_TIME_SLOTS = [
  { id: 's1', start: '08:00', end: '10:00' },
  { id: 's2', start: '10:00', end: '12:00' },
  { id: 's3', start: '12:00', end: '14:00' },
  { id: 's4', start: '14:00', end: '16:00' },
  { id: 's5', start: '16:00', end: '18:00' },
];

// Pre-populate some bookings for the current week
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDate = today.getDate();

export const MOCK_BOOKINGS = [
  {
    id: 'b1',
    roomId: 'r1',
    userId: '1',
    date: new Date(currentYear, currentMonth, currentDate).toISOString(),
    slotId: 's1',
    type: BOOKING_TYPES.FIXED_LECTURE,
    purpose: 'Advanced Algorithms 101',
    status: BOOKING_STATUS.APPROVED,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b2',
    roomId: 'r3',
    userId: '3',
    date: new Date(currentYear, currentMonth, currentDate + 1).toISOString(),
    slotId: 's3',
    type: BOOKING_TYPES.MULTI_PURPOSE,
    purpose: 'Annual Research Symposium',
    status: BOOKING_STATUS.PENDING,
    requestDetails: {
      managerName: 'Lila Employee',
      managerTitle: 'Professor',
      managerMobile: '0123456789',
      requirements: {
        microphones: 2,
        laptop: true,
        videoConference: true
      }
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b3',
    roomId: 'r2',
    userId: '1',
    date: new Date(currentYear, currentMonth, currentDate).toISOString(),
    slotId: 's2',
    type: BOOKING_TYPES.EXCEPTIONAL,
    purpose: 'Urgent Faculty Meeting',
    status: BOOKING_STATUS.APPROVED,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b4',
    roomId: 'r4',
    userId: '2',
    date: new Date(currentYear, currentMonth, currentDate + 2).toISOString(),
    slotId: 's4',
    type: BOOKING_TYPES.MULTI_PURPOSE,
    purpose: 'Department Workshop',
    status: BOOKING_STATUS.APPROVED,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b5',
    roomId: 'r1',
    userId: '4',
    date: new Date(currentYear, currentMonth, currentDate + 1).toISOString(),
    slotId: 's5',
    type: BOOKING_TYPES.MULTI_PURPOSE,
    purpose: 'Student Union Orientation',
    status: BOOKING_STATUS.PENDING,
    requestDetails: {
      managerName: 'Sara Secretary',
      managerTitle: 'Assistant',
      managerMobile: '0111222333',
      requirements: {
        microphones: 0,
        laptop: false,
        videoConference: false
      }
    },
    createdAt: new Date().toISOString(),
  }
];
