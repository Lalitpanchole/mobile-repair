import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminCustomers from './pages/AdminCustomers';
import AdminOrders from './pages/AdminOrders';
import AdminDevices from './pages/AdminDevices';
import AdminBookings from './pages/AdminBookings';
import AdminPayments from './pages/AdminPayments';
import AdminReviews from './pages/AdminReviews';
import AdminSettings from './pages/AdminSettings';
import RepairBooking from './pages/RepairBooking';
import { BookingProvider } from './context/BookingContext';

// New Admin Subpages
import AdminCalendar from './pages/AdminCalendar';
import AdminServices from './pages/AdminServices';
import AdminStaff from './pages/AdminStaff';
import AdminStore from './pages/AdminStore';
import AdminHours from './pages/AdminHours';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSliders from './pages/AdminSliders';
import AdminVideo from './pages/AdminVideo';
import AdminPages from './pages/AdminPages';
import AdminTestimonials from './pages/AdminTestimonials';

function App() {
  return (
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
            
            {/* Redesigned Screenshot Sidebar Routes */}
            <Route path="sliders" element={<AdminSliders />} />
            
            <Route path="video" element={<AdminVideo />} />
            
            <Route path="pages" element={<AdminPages />} />
            
            <Route path="testimonials" element={<AdminTestimonials />} />
            
            <Route path="store" element={<AdminStore />} />
            <Route path="store/branches" element={<AdminStore />} />
            
            <Route path="hours" element={<AdminHours />} />
            <Route path="hours/exceptions" element={<AdminHours />} />
            
            <Route path="services" element={<AdminServices />} />
            <Route path="services/categories" element={<AdminServices />} />

            <Route path="bookings" element={<AdminBookings />} />
            <Route path="new-bookings" element={<AdminBookings hideTabs={true} defaultTab="New Bookings" />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
            
            {/* Legacy Admin Routes */}
            <Route path="orders" element={<AdminOrders />} />
            <Route path="devices" element={<AdminDevices />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
        </Routes>
      </Router>
    </BookingProvider>
  );
}

export default App;

