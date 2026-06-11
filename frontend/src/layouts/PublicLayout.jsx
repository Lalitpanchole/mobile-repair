import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/booking/BookingModal';

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-grow pt-[68px]">
        <Outlet />
      </main>
      <Footer />
      <BookingModal />
    </div>
  );
}
