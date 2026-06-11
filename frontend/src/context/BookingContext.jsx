import { createContext, useState, useContext, useEffect } from 'react';

const BookingContext = createContext();

const seedBookings = [
  {
    id: 'BKG-5092',
    customer: 'Alice Johnson',
    title: 'Alice Johnson with iPhone 13 Pro Max',
    device: 'iPhone 13 Pro Max',
    issue: 'Screen Replacement',
    dateStr: '2026-06-03',
    date: 'Today, 10:30 AM',
    time: '10:30 AM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Alex',
    desc: 'Screen Replacement service.'
  },
  {
    id: 'BKG-5093',
    customer: 'Michael Chen',
    title: 'Michael Chen with MacBook Pro M1',
    device: 'MacBook Pro M1',
    issue: 'Battery Diagnostics',
    dateStr: '2026-06-03',
    date: 'Today, 1:15 PM',
    time: '1:15 PM',
    type: 'Mail-In',
    status: 'In Progress',
    tech: 'Sarah',
    desc: 'Battery Diagnostics and clean.'
  },
  {
    id: 'BKG-5094',
    customer: 'Sarah Williams',
    title: 'Sarah Williams with iPad Air 4',
    device: 'iPad Air 4',
    issue: 'Charging Port issue',
    dateStr: '2026-06-03',
    date: 'Today, 3:00 PM',
    time: '3:00 PM',
    type: 'In-Store',
    status: 'Pending',
    tech: 'Unassigned',
    desc: 'Charging Port issue inspection.'
  },
  {
    id: 'BKG-5095',
    customer: 'David Martinez',
    title: 'David Martinez with Galaxy S22 Ultra',
    device: 'Galaxy S22 Ultra',
    issue: 'Back Glass Repair',
    dateStr: '2026-06-04',
    date: 'Tomorrow, 9:00 AM',
    time: '09:00 AM',
    type: 'On-Site',
    status: 'Confirmed',
    tech: 'James',
    desc: 'Back Glass Repair.'
  },
  {
    id: 'BKG-5096',
    customer: 'Emma Thompson',
    title: 'Emma Thompson with Apple Watch S7',
    device: 'Apple Watch S7',
    issue: 'Screen Cracked',
    dateStr: '2026-06-12',
    date: 'June 12, 11:30 AM',
    time: '11:30 AM',
    type: 'In-Store',
    status: 'Cancelled',
    tech: 'Unassigned',
    desc: 'Screen Cracked diagnostic.'
  },
  {
    id: 'BKG-5097',
    customer: 'John Doe',
    title: 'John Doe with iMac 27"',
    device: 'iMac 27"',
    issue: 'Power Supply Failure',
    dateStr: '2026-06-18',
    date: 'June 18, 2:00 PM',
    time: '02:00 PM',
    type: 'Mail-In',
    status: 'Confirmed',
    tech: 'Sarah',
    desc: 'Power Supply Failure diagnostics.'
  },
  {
    id: 'BKG-5098',
    customer: 'Robert Smith',
    title: 'Robert Smith with Nintendo Switch',
    device: 'Nintendo Switch',
    issue: 'Game Slot Repair',
    dateStr: '2026-06-22',
    date: 'June 22, 4:15 PM',
    time: '04:15 PM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Alex',
    desc: 'Game Slot Repair.'
  },
  {
    id: 'BKG-0001',
    customer: 'Kristy',
    title: 'Kristy with iPhone 13 Pro',
    device: 'iPhone 13 Pro',
    issue: 'Diagnostic',
    dateStr: '2026-06-01',
    date: 'June 1, 10:30 AM',
    time: '10:30 AM',
    type: 'On-Site',
    status: 'Confirmed',
    tech: 'Alex',
    desc: 'Office visit diagnostic.'
  },
  {
    id: 'BKG-0002',
    customer: 'Florencia',
    title: 'Florencia with iPhone 12',
    device: 'iPhone 12',
    issue: 'Hardware testing',
    dateStr: '2026-06-02',
    date: 'June 2, 9:00 AM',
    time: '09:00 AM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'James',
    desc: 'General hardware testing.'
  },
  {
    id: 'BKG-0003',
    customer: 'Brendan',
    title: 'Brendan with PC Laptop',
    device: 'PC Laptop',
    issue: 'Clean Vents',
    dateStr: '2026-06-02',
    date: 'June 2, 9:30 AM',
    time: '09:30 AM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Alex',
    desc: 'Clean fan vents.'
  },
  {
    id: 'BKG-0004',
    customer: 'Toni',
    title: 'Toni with MacBook Air',
    device: 'MacBook Air',
    issue: 'Thermal paste',
    dateStr: '2026-06-02',
    date: 'June 2, 9:30 AM',
    time: '09:30 AM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Sarah',
    desc: 'Thermal paste application.'
  },
  {
    id: 'BKG-0005',
    customer: 'Ella',
    title: 'Ella with iPhone 11',
    device: 'iPhone 11',
    issue: 'Battery calibration',
    dateStr: '2026-06-02',
    date: 'June 2, 12:00 PM',
    time: '12:00 PM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Unassigned',
    desc: 'Battery calibration.'
  },
  {
    id: 'BKG-0006',
    customer: 'Clare',
    title: 'Clare with iPhone XS',
    device: 'iPhone XS',
    issue: 'USB repair',
    dateStr: '2026-06-03',
    date: 'Today, 9:30 AM',
    time: '09:30 AM',
    type: 'Mail-In',
    status: 'In Progress',
    tech: 'Sarah',
    desc: 'USB connector repair.'
  },
  {
    id: 'BKG-0007',
    customer: 'Taylor',
    title: 'Taylor with Solder Check',
    device: 'Solder Check',
    issue: 'Solder joint',
    dateStr: '2026-06-03',
    date: 'Today, 4:00 PM',
    time: '04:00 PM',
    type: 'Mail-In',
    status: 'In Progress',
    tech: 'Alex',
    desc: 'Solder check.'
  },
  {
    id: 'BKG-0008',
    customer: 'Jessica',
    title: 'Jessica with Router',
    device: 'Router',
    issue: 'Network Check',
    dateStr: '2026-06-04',
    date: 'Tomorrow, 8:00 AM',
    time: '08:00 AM',
    type: 'On-Site',
    status: 'Confirmed',
    tech: 'James',
    desc: 'Network router check.'
  },
  {
    id: 'BKG-0009',
    customer: 'Victoria',
    title: 'Victoria with iPad screen swap',
    device: 'iPad screen swap',
    issue: 'Screen Swap',
    dateStr: '2026-06-05',
    date: 'June 5, 9:30 AM',
    time: '09:30 AM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Alex',
    desc: 'iPad screen swap.'
  },
  {
    id: 'BKG-0010',
    customer: 'Rio Kippei',
    title: 'Rio Kippei with Audio fix',
    device: 'Audio fix',
    issue: 'Audio issues fix',
    dateStr: '2026-06-05',
    date: 'June 5, 10:00 AM',
    time: '10:00 AM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'James',
    desc: 'Audio issues fix.'
  },
  {
    id: 'BKG-0011',
    customer: 'Michael',
    title: 'Michael with Keyboard',
    device: 'Keyboard',
    issue: 'Stuck key',
    dateStr: '2026-06-05',
    date: 'June 5, 11:30 AM',
    time: '11:30 AM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Sarah',
    desc: 'Keyboard key stuck.'
  },
  {
    id: 'BKG-0012',
    customer: 'Cynthia',
    title: 'Cynthia with OS updates',
    device: 'OS updates',
    issue: 'Software update',
    dateStr: '2026-06-05',
    date: 'June 5, 12:30 PM',
    time: '12:30 PM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Unassigned',
    desc: 'OS updates installation.'
  },
  {
    id: 'BKG-0013',
    customer: 'Jayde',
    title: 'Jayde with MacBook logic board',
    device: 'MacBook logic board',
    issue: 'Logic board repair',
    dateStr: '2026-06-07',
    date: 'June 7, 10:30 AM',
    time: '10:30 AM',
    type: 'Mail-In',
    status: 'Confirmed',
    tech: 'Sarah',
    desc: 'MacBook logic board repair.'
  },
  {
    id: 'BKG-0014',
    customer: 'Dean',
    title: 'Dean with Battery check',
    device: 'Battery check',
    issue: 'Battery diagnostic',
    dateStr: '2026-06-08',
    date: 'June 8, 9:30 AM',
    time: '09:30 AM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Alex',
    desc: 'Battery check.'
  },
  {
    id: 'BKG-0015',
    customer: 'Emma',
    title: 'Emma with Sensor calibration',
    device: 'Sensor calibration',
    issue: 'Sensor diagnostic',
    dateStr: '2026-06-08',
    date: 'June 8, 11:00 AM',
    time: '11:00 AM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'James',
    desc: 'Sensor calibration.'
  },
  {
    id: 'BKG-0016',
    customer: 'BUD-DEE',
    title: 'BUD-DEE with Chassis Mod',
    device: 'Chassis Mod',
    issue: 'Chassis repair',
    dateStr: '2026-06-08',
    date: 'June 8, 2:00 PM',
    time: '02:00 PM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Sarah',
    desc: 'Special custom chassis mod.'
  },
  {
    id: 'BKG-0017',
    customer: 'Igor',
    title: 'Igor with Microphone swap',
    device: 'Microphone swap',
    issue: 'Microphone repair',
    dateStr: '2026-06-10',
    date: 'June 10, 9:30 AM',
    time: '09:30 AM',
    type: 'Mail-In',
    status: 'Confirmed',
    tech: 'Alex',
    desc: 'Microphone swap.'
  },
  {
    id: 'BKG-0018',
    customer: 'Grace',
    title: 'Grace with Volume button',
    device: 'Volume button',
    issue: 'Volume repair',
    dateStr: '2026-06-10',
    date: 'June 10, 2:00 PM',
    time: '02:00 PM',
    type: 'Mail-In',
    status: 'Confirmed',
    tech: 'James',
    desc: 'Volume button check.'
  },
  {
    id: 'BKG-0019',
    customer: 'Joel',
    title: 'Joel with Liquid clean',
    device: 'Liquid clean',
    issue: 'Liquid spill clean',
    dateStr: '2026-06-12',
    date: 'June 12, 9:30 AM',
    time: '09:30 AM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Sarah',
    desc: 'Liquid clean.'
  },
  {
    id: 'BKG-0020',
    customer: 'Peter',
    title: 'Peter with Heatsink replacement',
    device: 'Heatsink replacement',
    issue: 'Heatsink swap',
    dateStr: '2026-06-12',
    date: 'June 12, 12:00 PM',
    time: '12:00 PM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Alex',
    desc: 'Heatsink replacement.'
  },
  {
    id: 'BKG-0021',
    customer: 'Jack',
    title: 'Jack with Power cable re-solder',
    device: 'Power cable re-solder',
    issue: 'Re-solder cable',
    dateStr: '2026-06-12',
    date: 'June 12, 1:30 PM',
    time: '1:30 PM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'James',
    desc: 'Re-solder power cable.'
  },
  {
    id: 'BKG-0022',
    customer: 'Jordan',
    title: 'Jordan with Charging coil',
    device: 'Charging coil',
    issue: 'Coil diagnostic',
    dateStr: '2026-06-13',
    date: 'June 13, 9:30 AM',
    time: '09:30 AM',
    type: 'Mail-In',
    status: 'Confirmed',
    tech: 'Sarah',
    desc: 'Diagnose charging coil.'
  },
  {
    id: 'BKG-0023',
    customer: 'Abbie',
    title: 'Abbie with Display connector',
    device: 'Display connector',
    issue: 'Connector check',
    dateStr: '2026-06-13',
    date: 'June 13, 10:00 AM',
    time: '10:00 AM',
    type: 'Mail-In',
    status: 'Confirmed',
    tech: 'Alex',
    desc: 'Verify display connector.'
  },
  {
    id: 'BKG-0024',
    customer: 'Ben',
    title: 'Ben with Solder joint',
    device: 'Solder joint',
    issue: 'Joint inspection',
    dateStr: '2026-06-13',
    date: 'June 13, 1:30 PM',
    time: '1:30 PM',
    type: 'Mail-In',
    status: 'Confirmed',
    tech: 'James',
    desc: 'Solder joint inspection.'
  },
  {
    id: 'BKG-0025',
    customer: 'Shayan',
    title: 'Shayan with SIM tray',
    device: 'SIM tray',
    issue: 'SIM tray swap',
    dateStr: '2026-06-15',
    date: 'June 15, 9:00 AM',
    time: '09:00 AM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Sarah',
    desc: 'Replace SIM tray.'
  },
  {
    id: 'BKG-0026',
    customer: 'Aiden',
    title: 'Aiden with Face ID',
    device: 'Face ID',
    issue: 'Face ID diagnostic',
    dateStr: '2026-06-15',
    date: 'June 15, 9:30 AM',
    time: '09:30 AM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'Alex',
    desc: 'Verify face ID camera.'
  },
  {
    id: 'BKG-0027',
    customer: 'Richard',
    title: 'Richard with Rear glass',
    device: 'Rear glass',
    issue: 'Rear glass check',
    dateStr: '2026-06-15',
    date: 'June 15, 10:00 AM',
    time: '10:00 AM',
    type: 'In-Store',
    status: 'Confirmed',
    tech: 'James',
    desc: 'Rear glass heat check.'
  }
];

export function BookingProvider({ children }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    brand: null,
    deviceType: null,
    model: null,
    repair: null
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('irepair_global_bookings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seedIds = new Set([
            'BKG-5092', 'BKG-5093', 'BKG-5094', 'BKG-5095', 'BKG-5096', 'BKG-5097', 'BKG-5098',
            'BKG-0001', 'BKG-0002', 'BKG-0003', 'BKG-0004', 'BKG-0005', 'BKG-0006', 'BKG-0007',
            'BKG-0008', 'BKG-0009', 'BKG-0010', 'BKG-0011', 'BKG-0012', 'BKG-0013', 'BKG-0014',
            'BKG-0015', 'BKG-0016', 'BKG-0017', 'BKG-0018', 'BKG-0019', 'BKG-0020', 'BKG-0021',
            'BKG-0022', 'BKG-0023', 'BKG-0024', 'BKG-0025', 'BKG-0026', 'BKG-0027'
          ]);
          return parsed.filter(b => !seedIds.has(b.id));
        }
      } catch (e) {
        console.error('Failed to parse saved bookings', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('irepair_global_bookings', JSON.stringify(bookings));
  }, [bookings]);

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

  const addBooking = (newBooking) => {
    // Generate derived fields if missing
    const id = newBooking.id || `BKG-${Math.floor(5000 + Math.random() * 5000)}`;
    const title = newBooking.title || `${newBooking.customer} with ${newBooking.device}`;
    
    // Format date for list view (Today, Tomorrow, or Month Day)
    const getFormattedDisplayDate = (dStr, t) => {
      if (dStr === '2026-06-03') return `Today, ${t}`;
      if (dStr === '2026-06-04') return `Tomorrow, ${t}`;
      const parts = dStr.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mIdx = parseInt(parts[1], 10) - 1;
        const dNum = parseInt(parts[2], 10);
        return `${months[mIdx]} ${dNum}, ${t}`;
      }
      return `${dStr}, ${t}`;
    };

    const date = newBooking.date || getFormattedDisplayDate(newBooking.dateStr, newBooking.time);

    const bookingRecord = {
      ...newBooking,
      id,
      title,
      date,
      tech: newBooking.tech || 'Unassigned',
      status: newBooking.status || 'Pending',
      desc: newBooking.desc || newBooking.issue || 'No details provided.'
    };

    setBookings((prev) => [bookingRecord, ...prev]);
    return bookingRecord;
  };

  const deleteBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBooking = (id, updatedFields) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const merged = { ...b, ...updatedFields };
          // Recompute date display string if dateStr or time changed
          if (updatedFields.dateStr || updatedFields.time) {
            const getFormattedDisplayDate = (dStr, t) => {
              if (dStr === '2026-06-03') return `Today, ${t}`;
              if (dStr === '2026-06-04') return `Tomorrow, ${t}`;
              const parts = dStr.split('-');
              if (parts.length === 3) {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const mIdx = parseInt(parts[1], 10) - 1;
                const dNum = parseInt(parts[2], 10);
                return `${months[mIdx]} ${dNum}, ${t}`;
              }
              return `${dStr}, ${t}`;
            };
            merged.date = getFormattedDisplayDate(merged.dateStr, merged.time);
          }
          // Recompute title if customer or device changed
          if (updatedFields.customer || updatedFields.device) {
            merged.title = `${merged.customer} with ${merged.device}`;
          }
          return merged;
        }
        return b;
      })
    );
  };

  return (
    <BookingContext.Provider value={{ 
      isBookingModalOpen, 
      openBookingModal, 
      closeBookingModal,
      bookingData,
      updateBookingData,
      resetBookingData,
      bookings,
      addBooking,
      deleteBooking,
      updateBooking
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
