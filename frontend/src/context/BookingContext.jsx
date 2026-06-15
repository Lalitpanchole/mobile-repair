import { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    brand: null,
    deviceType: null,
    model: null,
    repair: null
  });

  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);

  const updateBookingData = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const resetBookingData = () => {
    setBookingData({
      brand: null,
      deviceType: null,
      model: null,
      repair: null
    });
  };

  return (
    <BookingContext.Provider value={{ 
      isBookingModalOpen, 
      openBookingModal, 
      closeBookingModal,
      bookingData,
      updateBookingData,
      resetBookingData
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
