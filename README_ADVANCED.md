# 🛡️ UniReserve: Advanced Technical Documentation

![Advanced Banner](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop)

Welcome to the advanced documentation for **UniReserve**. This document outlines the architectural decisions, system logic, and implementation details that make UniReserve a premium enterprise-grade solution for university management.

---

## 🏗️ Architecture & System Design

UniReserve is built on a modern, reactive architecture designed for scalability and performance.

### 📂 Directory Structure
```text
src/
├── assets/         # Static assets and global images
├── components/     # Atomic UI components (Buttons, Modals, Cards)
├── context/        # AppContext for Global State & Theme Management
├── data/           # Mock data and static configuration (Halls, Users)
├── pages/          # Full-page views (Dashboard, Calendar, Bookings)
├── App.jsx         # Main application entry and Routing
└── main.jsx        # React DOM initialization
```

### 🔐 Institutional RBAC Logic
The system implements a strict Role-Based Access Control (RBAC) model to maintain institutional integrity:

1. **Super Admin / Branch Manager**:
   - Access to the "Admin Panel".
   - Ability to create, update, and delete any booking.
   - Master control over user roles (Staff -> Admin promotion).
   - Global data export rights.

2. **Admin**:
   - Management of specific hall categories (e.g., Lecture Halls).
   - Can view and propose bookings for Multi-Purpose rooms.
   - Restricted from global system settings.

3. **User / Staff**:
   - Can view availability.
   - Can request bookings (pending approval by higher roles).

---

## 🗓️ Scheduling Engine & Business Logic

### 🌙 Ramadan Scheduling
The engine handles complex time-slot calculations, specifically optimized for the 55-minute "Academic Hour" common in institutional settings.
- **Interval**: 55 Minutes.
- **Buffer**: 5-minute automated buffer between slots.
- **Validation**: Prevents double-booking across different hall types.

### 📊 Data Export System
Built with modularity in mind, the export system parses the internal JSON state and converts it into standard spreadsheet formats:
- **Formats**: `.csv`, `.xlsx`
- **Scope**: User Activity Logs, Hall Utilization, Financial Summaries (if applicable).

---

## 🎨 UI/UX Philosophy

### Cinematic Dark Mode
UniReserve utilizes a custom color palette defined in `tailwind.config.js`. The "Cinematic" feel is achieved through:
- **Layered Shadows**: Deep elevation shadows for a 3D effect.
- **Glassmorphism**: Translucent headers and sidebars using `backdrop-blur`.
- **Dynamic Accent Colors**: Deep violets and electric blues to highlight active states.

### Animation System
Powered by **Framer Motion**, the UI features:
- **Staggered Lists**: Smooth entry for dashboard cards.
- **Layout Transitions**: Fluid movement when resizing or switching tabs.
- **Micro-interactions**: Subtle scale effects on buttons and interactive elements.

---

## 🛠️ Development & Contribution

### Performance Optimization
- **Vite Bundling**: Leverages ES modules for instant hot module replacement (HMR).
- **Tree Shaking**: Minimizes the production bundle size by excluding unused Lucide icons.
- **Memoization**: Strategic use of `React.memo` and `useMemo` for heavy components like the Calendar grid.

### Future Roadmap
- [ ] Integration with Google Calendar API.
- [ ] Automated Email/SMS notifications for booking approvals.
- [ ] AI-powered hall optimization suggestions.
- [ ] Mobile App (React Native) companion.

---

## 📝 License

This project is developed by **The Banned Team** for institutional purposes. All rights reserved.

---

> "Technology is best when it brings people together — and organizes their spaces."
