import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminSettings from './pages/AdminSettings';
import RepairBooking from './pages/RepairBooking';
import { BookingProvider } from './context/BookingContext';
import { CatalogProvider } from './context/CatalogContext';
import AdminHours from './pages/AdminHours';

function App() {
  return (
    <CatalogProvider>
      <BookingProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="book-repair" element={<RepairBooking />} />
            </Route>

            {/* Auth Route */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="new-bookings" element={<AdminBookings hideTabs={true} defaultTab="New Bookings" />} />
              <Route path="hours" element={<AdminHours />} />
              <Route path="hours/exceptions" element={<AdminHours />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Router>
      </BookingProvider>
    </CatalogProvider>
  );
}

export default App;
