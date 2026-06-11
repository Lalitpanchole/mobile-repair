const fs = require('fs');
const path = require('path');

const brandHierarchy = {
  Apple: 1.0,
  Microsoft: 1.0,
  Samsung: 0.8,
  Google: 0.8,
  Huawei: 0.8,
  OnePlus: 0.5,
  Xiaomi: 0.5,
  Oppo: 0.5,
  Motorola: 0.5,
  Dell: 0.3,
  HP: 0.3,
  Lenovo: 0.3,
  Asus: 0.4,
  Acer: 0.3
};

const brandDeviceMapping = {
  Apple: ['iPhone', 'iPad', 'MacBook', 'Apple Watch', 'AirPods'],
  Samsung: ['Galaxy S Series', 'Galaxy A Series'],
  Microsoft: ['Surface Tablet', 'Surface Laptop'],
  Google: ['Pixel'],
  Oppo: ['Find', 'Reno'],
  Xiaomi: ['Xiaomi'],
  OnePlus: ['OnePlus'],
  Motorola: ['Moto'],
  Huawei: ['P Series', 'Mate Series'],
  Dell: ['Laptop'],
  HP: ['Laptop'],
  Lenovo: ['ThinkPad', 'IdeaPad', 'Lenovo Tablet'],
  Asus: ['Asus'],
  Acer: ['Acer']
};

const getGenericType = (deviceType) => {
  if (deviceType.includes('Phone') || deviceType.includes('Galaxy') || deviceType === 'iPhone' || deviceType === 'Find' || deviceType === 'Reno' || deviceType.includes('Moto') || deviceType.includes('Pixel') || deviceType.includes('P Series') || deviceType.includes('Mate Series') || deviceType === 'Xiaomi' || deviceType === 'OnePlus' || deviceType === 'Asus') return 'Phone';
  const t = deviceType.toLowerCase();
  if (t.includes('thinkpad') || t.includes('ideapad') || t.includes('macbook') || t.includes('laptop') || t.includes('chromebook') || t.includes('acer')) return 'Laptop';
  if (t.includes('pad') || t.includes('tablet') || t.includes('surface pro') || t.includes('surface go')) return 'Tablet';
  if (t.includes('watch') || t.includes('band')) return 'Watch';
  if (t.includes('buds') || t.includes('airpods') || t.includes('earbuds')) return 'Earbuds';
  if (t.includes('desktop') || t.includes('studio') || t.includes('xbox')) return 'Desktop';
  if (t.includes('monitor') || t.includes('display')) return 'Monitor';
  return 'Phone'; // fallback
};

const repairsList = {
  iPhone: [
    { name: 'Screen Repair', dur: '1 hour', pop: true, war: '12 mo warranty' },
    { name: 'Back Glass Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Battery Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Charging Port Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Front Camera Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Rear Camera Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Camera Glass Broken', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Power / Volume Button', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Microphone Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Speaker Repair', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Water / Liquid Damage Repair', dur: '1 day', pop: false, war: '12 mo warranty' },
    { name: 'Motherboard / Logicboard Repair', dur: '1 day', pop: false, war: '12 mo warranty' },
    { name: 'Not Turning On', dur: '1 day', pop: false, war: '12 mo warranty' },
    { name: 'Free Diagnostic', dur: '1 hour', pop: false, war: '12 mo warranty' }
  ],
  iPad: [
    { name: 'Front Glass Repair', dur: '2 hours', pop: true, war: '12 mo warranty' },
    { name: 'Main Lcd Repair', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Battery Replacement', dur: '2 hours', pop: false, war: '12 mo warranty' },
    { name: 'Charging Port Replacement', dur: '2 hours', pop: false, war: '12 mo warranty' },
    { name: 'Front Camera Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Rear Camera Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Speaker Repair', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Water / Liquid Damage Repair', dur: '1 day', pop: false, war: '12 mo warranty' },
    { name: 'Motherboard / Logicboard Repair', dur: '1 day', pop: false, war: '12 mo warranty' },
    { name: 'Not Turning On', dur: '1 day', pop: false, war: '12 mo warranty' },
    { name: 'Free Diagnostic', dur: '1 hour', pop: false, war: '12 mo warranty' }
  ],
  MacBook: [
    { name: 'Screen Repair & Replacement', dur: '3 hours', pop: true, war: '12 mo warranty' },
    { name: 'Battery Replacement', dur: '1 day', pop: false, war: '12 mo warranty' },
    { name: 'Charging Port Replacement', dur: '1 day', pop: false, war: '12 mo warranty' },
    { name: 'Keyboard Replacement', dur: '2 days', pop: false, war: '12 mo warranty' },
    { name: 'Trackpad Not Working', dur: '2 days', pop: false, war: '12 mo warranty' },
    { name: 'Microphone Replacement', dur: '2 days', pop: false, war: '12 mo warranty' },
    { name: 'Speaker Repair', dur: '2 days', pop: false, war: '12 mo warranty' },
    { name: 'Water / Liquid Damage Repair', dur: '2 days', pop: false, war: '12 mo warranty' },
    { name: 'Motherboard / Logicboard Repair', dur: '2 days', pop: false, war: '12 mo warranty' },
    { name: 'Not Turning On', dur: '2 days', pop: false, war: '12 mo warranty' },
    { name: 'Software Update / Restore', dur: '3 hours', pop: false, war: '12 mo warranty' },
    { name: 'Free Diagnostic', dur: '3 hours', pop: false, war: '12 mo warranty' }
  ],
  'Apple Watch': [
    { name: 'Screen Repair', dur: '1 day', pop: true, war: '12 mo warranty' }
  ],
  Phone: [
    { name: 'Screen Repair', dur: '1 hour', pop: true, war: '12 mo warranty' },
    { name: 'Back Glass Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Battery Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Charging Port Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Front Camera Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Rear Camera Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Camera Glass Broken', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Power / Volume Button', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Microphone Replacement', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Speaker Repair', dur: '1 hour', pop: false, war: '12 mo warranty' },
    { name: 'Water / Liquid Damage Repair', dur: '1 day', pop: false, war: '12 mo warranty' },
    { name: 'Motherboard / Logicboard Repair', dur: '1 day', pop: false, war: '12 mo warranty' },
    { name: 'Not Turning On', dur: '1 day', pop: false, war: '12 mo warranty' },
    { name: 'Free Diagnostic', dur: '1 hour', pop: false, war: '12 mo warranty' }
  ],
  Tablet: [
    { name: 'Screen Repair', dur: '2 hours', pop: true },
    { name: 'Battery Replacement', dur: '1 hour', pop: false },
    { name: 'Charging Port Repair', dur: '1 hour', pop: false },
    { name: 'Software Update / Restore', dur: '1 hour', pop: false },
    { name: 'Motherboard Repair', dur: '3-5 days', pop: false },
    { name: 'Water Damage Repair', dur: '2-4 days', pop: false },
    { name: 'Stylus Repair', dur: '1 hour', pop: false },
    { name: 'Digitizer Replacement', dur: '2 hours', pop: true },
    { name: 'Diagnostic Service', dur: '1 hour', pop: false },
  ],
  Laptop: [
    { name: 'Motherboard Repair', dur: '3-5 days', pop: false },
    { name: 'Screen Replacement', dur: '2 hours', pop: true },
    { name: 'Keyboard Replacement', dur: '2 hours', pop: false },
    { name: 'SSD Upgrade', dur: '1 hour', pop: true },
    { name: 'RAM Upgrade', dur: '1 hour', pop: false },
    { name: 'Battery Replacement', dur: '1 hour', pop: false },
    { name: 'Software Update / Restore', dur: '1-2 hours', pop: false },
    { name: 'Virus Removal', dur: '2 hours', pop: false },
    { name: 'Liquid Damage Repair', dur: '3-5 days', pop: false },
    { name: 'Data Recovery', dur: '2-4 days', pop: false },
    { name: 'Charging Port Repair', dur: '1-2 hours', pop: false },
    { name: 'Touchpad Repair', dur: '1 hour', pop: false },
    { name: 'Fan Replacement', dur: '1 hour', pop: false },
    { name: 'Overheating Fix', dur: '2 hours', pop: false },
    { name: 'Hinge Repair', dur: '2 hours', pop: false },
    { name: 'Speaker Repair', dur: '1 hour', pop: false },
    { name: 'Camera Repair', dur: '1 hour', pop: false },
    { name: 'Diagnostic Service', dur: '1 hour', pop: false },
  ],
  Watch: [
    { name: 'Screen Repair', dur: '1-2 hours', pop: true },
    { name: 'Battery Replacement', dur: '1 hour', pop: false },
    { name: 'Water Damage Repair', dur: '2-4 days', pop: false },
    { name: 'Software Update / Restore', dur: '1 hour', pop: false },
  ],
  Earbuds: [
    { name: 'Battery Replacement', dur: '1-2 hours', pop: true },
    { name: 'Charging Case Repair', dur: '2 hours', pop: false },
    { name: 'Water Damage Repair', dur: '2-3 days', pop: false },
  ],
  Desktop: [
    { name: 'Motherboard Repair', dur: '2-4 days', pop: false },
    { name: 'Power Supply Replacement', dur: '1 hour', pop: true },
    { name: 'SSD Upgrade', dur: '1 hour', pop: false },
    { name: 'RAM Upgrade', dur: '1 hour', pop: false },
  ],
  Monitor: [
    { name: 'Screen Panel Replacement', dur: '1-2 days', pop: false },
    { name: 'Power Board Repair', dur: '2 days', pop: true },
  ]
};

const generateModels = (prefix, suffixArray, tiers, type) => {
  let list = [];
  suffixArray.forEach((suffix, i) => {
    let year = 2024 - Math.floor(i / 2);
    let name = prefix ? `${prefix} ${suffix}` : suffix;
    // Normalize tier between 0 and 1
    let tier = tiers[i];
    list.push({ name, year: year.toString(), tier: tier });
  });
  return list;
};

const generateCustomModels = (modelsArray) => {
  return modelsArray.map(m => ({
    name: m.name,
    year: m.year.toString(),
    tier: m.tier
  }));
};

// Massive Models DB (tiers normalized 0.0 to 1.0)
const modelsDB = {
  Apple: {
    Phone: generateCustomModels([
      { name: 'iPhone 17e', year: 2026, tier: 0.95 },
      { name: 'iPhone 17 Pro Max', year: 2025, tier: 1.0 },
      { name: 'iPhone 17 Pro', year: 2025, tier: 0.95 },
      { name: 'iPhone 17 Air', year: 2025, tier: 0.9 },
      { name: 'iPhone 17', year: 2025, tier: 0.85 },
      { name: 'iPhone 16e', year: 2025, tier: 0.8 },
      { name: 'iPhone 16 Pro Max', year: 2024, tier: 0.9 },
      { name: 'iPhone 16 Pro', year: 2024, tier: 0.85 },
      { name: 'iPhone 16 Plus', year: 2024, tier: 0.8 },
      { name: 'iPhone 16', year: 2024, tier: 0.75 },
      { name: 'iPhone 15 Pro Max', year: 2023, tier: 0.85 },
      { name: 'iPhone 15 Pro', year: 2023, tier: 0.8 },
      { name: 'iPhone 15 Plus', year: 2023, tier: 0.75 },
      { name: 'iPhone 15', year: 2023, tier: 0.7 },
      { name: 'iPhone 14 Pro Max', year: 2022, tier: 0.8 },
      { name: 'iPhone 14 Pro', year: 2022, tier: 0.75 },
      { name: 'iPhone 14 Plus', year: 2022, tier: 0.7 },
      { name: 'iPhone 14', year: 2022, tier: 0.65 },
      { name: 'iPhone 13 Pro Max', year: 2021, tier: 0.75 },
      { name: 'iPhone 13 Pro', year: 2021, tier: 0.7 },
      { name: 'iPhone 13', year: 2021, tier: 0.6 },
      { name: 'iPhone 13 mini', year: 2021, tier: 0.55 },
      { name: 'iPhone 12 Pro Max', year: 2020, tier: 0.7 },
      { name: 'iPhone 12 Pro', year: 2020, tier: 0.65 },
      { name: 'iPhone 12', year: 2020, tier: 0.55 },
      { name: 'iPhone 12 mini', year: 2020, tier: 0.5 },
      { name: 'iPhone 11 Pro Max', year: 2019, tier: 0.6 },
      { name: 'iPhone 11 Pro', year: 2019, tier: 0.55 },
      { name: 'iPhone 11', year: 2019, tier: 0.45 },
      { name: 'iPhone XS Max', year: 2018, tier: 0.4 },
      { name: 'iPhone XS', year: 2018, tier: 0.35 },
      { name: 'iPhone X', year: 2017, tier: 0.3 },
      { name: 'iPhone 8 Plus', year: 2026, tier: 0.25 },
      { name: 'iPhone 8', year: 2017, tier: 0.2 }
    ]),
    Tablet: generateCustomModels([
      { name: 'iPad 11th Gen (A16)', year: 2025, tier: 0.9 },
      { name: 'iPad Pro 11-inch (M5)', year: 2025, tier: 1.0 },
      { name: 'iPad Pro 11-inch (M4)', year: 2024, tier: 0.95 },
      { name: 'iPad Pro 13-inch (M4)', year: 2024, tier: 1.0 },
      { name: 'iPad Air 13-inch (M2)', year: 2024, tier: 0.9 },
      { name: 'iPad Air 11-inch (M2)', year: 2024, tier: 0.85 },
      { name: 'iPad Pro 11-inch (4th gen)', year: 2022, tier: 0.8 },
      { name: 'iPad 10th Generation', year: 2022, tier: 0.75 },
      { name: 'iPad Pro 12.9-inch (6th gen)', year: 2022, tier: 0.85 },
      { name: 'iPad Air (5th generation)', year: 2022, tier: 0.75 },
      { name: 'iPad mini 6', year: 2021, tier: 0.7 },
      { name: 'iPad Pro 12.9-inch (5th gen)', year: 2021, tier: 0.8 },
      { name: 'iPad Pro 11-inch (3rd gen)', year: 2021, tier: 0.75 },
      { name: 'iPad (9th generation)', year: 2021, tier: 0.65 },
      { name: 'iPad Pro 12.9-inch (4th gen)', year: 2020, tier: 0.7 },
      { name: 'iPad (8th generation)', year: 2020, tier: 0.6 },
      { name: 'iPad Air (4th generation)', year: 2020, tier: 0.65 },
      { name: 'iPad Pro 11-inch (2nd gen)', year: 2020, tier: 0.65 },
      { name: 'iPad (7th generation)', year: 2019, tier: 0.55 },
      { name: 'iPad Air (3rd generation)', year: 2019, tier: 0.55 },
      { name: 'iPad Mini (5th generation)', year: 2019, tier: 0.5 },
      { name: 'iPad (6th generation)', year: 2018, tier: 0.45 },
      { name: 'iPad Pro 12.9-inch (3rd gen)', year: 2018, tier: 0.55 },
      { name: 'iPad Pro 11-inch (1st gen)', year: 2018, tier: 0.5 },
      { name: 'iPad Pro 10.5-inch (1st gen)', year: 2017, tier: 0.45 },
      { name: 'iPad (5th generation)', year: 2017, tier: 0.35 },
      { name: 'iPad Pro 9.7-inch (1st gen)', year: 2016, tier: 0.4 },
      { name: 'iPad Pro 12.9-inch (1st gen)', year: 2015, tier: 0.35 },
      { name: 'iPad Mini 4', year: 2015, tier: 0.3 },
      { name: 'iPad Mini 3', year: 2014, tier: 0.25 }
    ]),
    Laptop: generateCustomModels([
      { name: 'MacBook Air 15.3" (M3)', year: 2024, tier: 0.95 },
      { name: 'MacBook Air 13" (M3)', year: 2024, tier: 0.9 },
      { name: 'MacBook Pro 14" (M3)', year: 2023, tier: 0.9 },
      { name: 'MacBook Pro 14" (M3 Pro/Max)', year: 2023, tier: 1.0 },
      { name: 'MacBook Pro 16" (M3 Pro/Max)', year: 2023, tier: 1.0 },
      { name: 'Macbook Air 15.3" (M2)', year: 2023, tier: 0.85 },
      { name: 'MacBook Pro 16" (M2 Pro/Max)', year: 2023, tier: 0.95 },
      { name: 'MacBook Pro 14" (M2 Pro)', year: 2022, tier: 0.9 },
      { name: 'MacBook Air 13" (M2)', year: 2022, tier: 0.8 },
      { name: 'MacBook Pro 14" (M1 Pro)', year: 2021, tier: 0.85 },
      { name: 'MacBook Pro 16" (M1 Pro)', year: 2021, tier: 0.9 },
      { name: 'MacBook Pro 13" (M1)', year: 2020, tier: 0.75 },
      { name: 'MacBook Air 13" (M1)', year: 2020, tier: 0.7 },
      { name: 'MacBook Pro 13"', year: 2020, tier: 0.65 },
      { name: 'MacBook Air 13"', year: 2020, tier: 0.6 },
      { name: 'MacBook Pro 13" (A2289)', year: 2020, tier: 0.65 },
      { name: 'MacBook Air 13"', year: 2019, tier: 0.55 },
      { name: 'MacBook Pro 13"', year: 2019, tier: 0.6 },
      { name: 'MacBook Pro 13"', year: 2018, tier: 0.55 },
      { name: 'MacBook Pro 13"', year: 2017, tier: 0.5 },
      { name: 'MacBook Pro 13"', year: 2016, tier: 0.45 },
      { name: 'MacBook Pro 15"', year: 2016, tier: 0.5 },
      { name: 'Macbook Air 13"', year: 2015, tier: 0.4 },
      { name: 'MacBook Pro 15"', year: 2012, tier: 0.3 },
      { name: 'MacBook Air 11"', year: 2012, tier: 0.2 },
      { name: 'Macbook Pro 13"', year: 2012, tier: 0.25 }
    ]),
    'Apple Watch': generateCustomModels([
      { name: 'Apple Watch Series 10', year: 2024, tier: 1.0 },
      { name: 'Watch Ultra 1', year: 2024, tier: 0.95 },
      { name: 'Apple Watch Series 9', year: 2023, tier: 0.9 },
      { name: 'Apple Watch Ultra 2', year: 2023, tier: 1.0 },
      { name: 'Apple Watch SE (2nd Gen)', year: 2022, tier: 0.6 },
      { name: 'Apple Watch Series 8', year: 2022, tier: 0.8 }
    ])
  },
  Samsung: {
    'Galaxy S Series': generateCustomModels([
      { name: 'Samsung Galaxy S25 Ultra', year: 2025, tier: 1.0 },
      { name: 'Samsung Galaxy S25 Plus', year: 2025, tier: 0.95 },
      { name: 'Samsung Galaxy S25', year: 2025, tier: 0.9 },
      { name: 'Samsung Galaxy S24 Ultra', year: 2024, tier: 0.9 },
      { name: 'Samsung Galaxy S24 Plus', year: 2024, tier: 0.85 },
      { name: 'Samsung Galaxy S24', year: 2024, tier: 0.8 },
      { name: 'Samsung Galaxy S23 Ultra', year: 2023, tier: 0.8 },
      { name: 'Samsung Galaxy S23 Plus', year: 2023, tier: 0.75 },
      { name: 'Samsung Galaxy S23', year: 2023, tier: 0.7 },
      { name: 'Samsung Galaxy S22 Ultra', year: 2022, tier: 0.7 },
      { name: 'Samsung Galaxy S22 Plus', year: 2022, tier: 0.65 },
      { name: 'Samsung Galaxy S22', year: 2022, tier: 0.6 },
      { name: 'Samsung Galaxy S21 Ultra', year: 2021, tier: 0.6 },
      { name: 'Samsung Galaxy S21 Plus', year: 2021, tier: 0.55 },
      { name: 'Samsung Galaxy S21 FE', year: 2021, tier: 0.5 },
      { name: 'Samsung Galaxy S21', year: 2021, tier: 0.5 },
      { name: 'Samsung Galaxy S20 Ultra', year: 2020, tier: 0.5 },
      { name: 'Samsung Galaxy S20 Plus', year: 2020, tier: 0.45 },
      { name: 'Samsung Galaxy S20', year: 2020, tier: 0.4 },
      { name: 'Samsung Galaxy S20 FE', year: 2020, tier: 0.35 }
    ]),
    'Galaxy A Series': generateCustomModels([
      { name: 'Samsung Galaxy A25 5G', year: 2024, tier: 0.4 }
    ]),
    Tablet: generateModels('Galaxy Tab', ['S9 Ultra', 'S9+', 'S9', 'S8 Ultra', 'S8+', 'S8', 'S7 FE', 'A9+'], [1.0, 0.9, 0.8, 0.8, 0.7, 0.6, 0.4, 0.3]),
    Laptop: generateModels('Galaxy Book', ['4 Ultra', '4 Pro', '4 360', '3 Ultra', '3 Pro', '2 Pro'], [1.0, 0.8, 0.7, 0.8, 0.7, 0.5]),
    Watch: generateModels('Galaxy Watch', ['6 Classic', '6', '5 Pro', '5'], [1.0, 0.8, 0.8, 0.6]),
    Earbuds: generateModels('Galaxy Buds', ['2 Pro', 'FE', '2', 'Pro'], [0.9, 0.5, 0.6, 0.7])
  },
  Google: {
    'Pixel': generateCustomModels([
      { name: 'Pixel 10 Pro XL', year: 2025, tier: 1.0 },
      { name: 'Pixel 10 Pro', year: 2025, tier: 0.95 },
      { name: 'Pixel 10', year: 2025, tier: 0.9 },
      { name: 'Pixel 10a', year: 2025, tier: 0.8 },
      { name: 'Pixel 9 Pro XL', year: 2024, tier: 0.95 },
      { name: 'Pixel 9 Pro', year: 2024, tier: 0.9 },
      { name: 'Pixel 9', year: 2024, tier: 0.85 },
      { name: 'Pixel 9a', year: 2024, tier: 0.75 },
      { name: 'Pixel 8 Pro', year: 2023, tier: 0.85 },
      { name: 'Pixel 8', year: 2023, tier: 0.8 },
      { name: 'Pixel 8a', year: 2023, tier: 0.7 },
      { name: 'Pixel 7 Pro', year: 2022, tier: 0.75 },
      { name: 'Pixel 7', year: 2022, tier: 0.7 },
      { name: 'Pixel 7a', year: 2022, tier: 0.6 },
      { name: 'Pixel 6 Pro', year: 2021, tier: 0.65 },
      { name: 'Pixel 6', year: 2021, tier: 0.6 },
      { name: 'Pixel 6a', year: 2021, tier: 0.5 }
    ]),
    Tablet: generateModels('Pixel', ['Tablet', 'Slate'], [0.8, 0.5]),
    Laptop: generateModels('Google', ['Pixelbook Go', 'Pixelbook'], [0.8, 0.6]),
    Watch: generateModels('Pixel Watch', ['2', '1'], [0.9, 0.7]),
    Earbuds: generateModels('Pixel Buds', ['Pro', 'A-Series'], [0.9, 0.5])
  },
  Microsoft: {
    'Surface Tablet': generateCustomModels([
      { name: 'Surface Pro 9', year: 2024, tier: 1.0 },
      { name: 'Surface Pro 8', year: 2024, tier: 0.8 },
      { name: 'Surface Go 3', year: 2024, tier: 0.5 }
    ]),
    'Surface Laptop': generateCustomModels([
      { name: 'Surface Laptop 5', year: 2024, tier: 0.8 },
      { name: 'Surface Laptop Studio 2', year: 2024, tier: 1.0 },
      { name: 'Surface Laptop Go 3', year: 2024, tier: 0.6 }
    ])
  },
  Oppo: {
    'Find': generateCustomModels([
      { name: 'Oppo Find X7 Pro', year: 2024, tier: 1.0 },
      { name: 'Oppo Find X6 Pro', year: 2024, tier: 0.9 },
      { name: 'Oppo Find X5 Pro', year: 2024, tier: 0.8 }
    ]),
    'Reno': generateCustomModels([
      { name: 'Oppo Reno 11', year: 2024, tier: 0.7 },
      { name: 'Oppo Reno 10', year: 2024, tier: 0.6 },
      { name: 'Oppo Reno 9', year: 2024, tier: 0.5 },
      { name: 'Oppo Reno 8', year: 2024, tier: 0.4 }
    ])
  },
  Xiaomi: {
    Xiaomi: generateModels('Xiaomi', ['14 Ultra', '14 Pro', '14', '13 Ultra', '13 Pro', '13', '12 Pro', '12', '11T Pro', '11T'], [1.0, 0.9, 0.85, 0.9, 0.8, 0.75, 0.7, 0.6, 0.5, 0.4])
  },
  OnePlus: {
    OnePlus: generateCustomModels([
      { name: 'OnePlus 12', year: 2024, tier: 0.9 },
      { name: 'OnePlus 11', year: 2024, tier: 0.8 },
      { name: 'OnePlus 11R', year: 2024, tier: 0.7 },
      { name: 'OnePlus Nord 3', year: 2024, tier: 0.6 },
      { name: 'OnePlus Nord CE 3', year: 2024, tier: 0.5 }
    ])
  },
  Asus: {
    Asus: generateModels('ROG Phone', ['8 Pro', '8', '7 Ultimate', '7', '6 Pro', '6'], [1.0, 0.9, 0.8, 0.7, 0.6, 0.5])
  },
  Motorola: {
    'Moto': generateCustomModels([
      { name: 'Edge 40 Pro', year: 2024, tier: 0.9 },
      { name: 'Edge 40', year: 2024, tier: 0.8 },
      { name: 'G84', year: 2024, tier: 0.6 },
      { name: 'G73', year: 2024, tier: 0.5 },
      { name: 'G54', year: 2024, tier: 0.4 }
    ])
  },
  Huawei: {
    'P Series': generateCustomModels([
      { name: 'P60 Pro', year: 2024, tier: 0.9 },
      { name: 'P60', year: 2024, tier: 0.8 },
      { name: 'P50 Pro', year: 2024, tier: 0.7 }
    ]),
    'Mate Series': generateCustomModels([
      { name: 'Mate 60 Pro', year: 2024, tier: 1.0 },
      { name: 'Mate 50 Pro', year: 2024, tier: 0.8 }
    ])
  },
  Dell: {
    Laptop: generateCustomModels([
      { name: 'XPS 13', year: 2024, tier: 0.9 },
      { name: 'Inspiron 15', year: 2024, tier: 0.6 },
      { name: 'Inspiron 14', year: 2024, tier: 0.5 },
      { name: 'XPS 15', year: 2024, tier: 1.0 }
    ]),
    Desktop: generateModels('Dell', ['Alienware Aurora R16', 'XPS Desktop', 'Inspiron Desktop'], [1.0, 0.7, 0.4]),
    Monitor: generateModels('Dell', ['Alienware 34 Curved OLED', 'UltraSharp 32 4K', 'S Series 27'], [1.0, 0.8, 0.4])
  },
  HP: {
    Laptop: generateCustomModels([
      { name: 'Spectre x360', year: 2024, tier: 1.0 },
      { name: 'Envy 15', year: 2024, tier: 0.8 },
      { name: 'Pavilion 15', year: 2024, tier: 0.6 },
      { name: 'Pavilion 14', year: 2024, tier: 0.5 }
    ])
  },
  Lenovo: {
    'ThinkPad': generateCustomModels([
      { name: 'X1 Carbon Gen 11', year: 2024, tier: 1.0 },
      { name: 'X1 Yoga', year: 2024, tier: 0.9 },
      { name: 'T14', year: 2024, tier: 0.8 },
      { name: 'T16', year: 2024, tier: 0.8 }
    ]),
    'IdeaPad': generateCustomModels([
      { name: 'IdeaPad Slim 5', year: 2024, tier: 0.7 },
      { name: 'IdeaPad 3', year: 2024, tier: 0.5 },
      { name: 'IdeaPad Gaming 3', year: 2024, tier: 0.7 }
    ]),
    'Lenovo Tablet': generateCustomModels([
      { name: 'Tab P12', year: 2024, tier: 0.8 },
      { name: 'Tab P11', year: 2024, tier: 0.6 },
      { name: 'Tab M10', year: 2024, tier: 0.4 }
    ])
  },
  Asus: {
    Phone: generateCustomModels([
      { name: 'ZenBook 14', year: 2024, tier: 0.8 },
      { name: 'VivoBook 15', year: 2024, tier: 0.5 },
      { name: 'ROG Zephyrus', year: 2024, tier: 1.0 },
      { name: 'TUF Gaming', year: 2024, tier: 0.7 }
    ])
  },
  Acer: {
    Acer: generateCustomModels([
      { name: 'Swift 3', year: 2024, tier: 0.8 },
      { name: 'Acer Swift Go 14 AI', year: 2024, tier: 0.9 },
      { name: 'Acer Aspire Go 15', year: 2024, tier: 0.7 },
      { name: 'Acer Swift Go 14', year: 2024, tier: 0.8 },
      { name: 'Acer Swift Go 16', year: 2024, tier: 0.85 },
      { name: 'Aspire 5', year: 2024, tier: 0.6 },
      { name: 'Nitro 5', year: 2024, tier: 0.75 },
      { name: 'Predator Helios', year: 2024, tier: 1.0 }
    ])
  }
};

let seed = 42;
function randomFloat() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

function getBounds(deviceType, repairName, brandName) {
  let min = 150;
  let max = 300;
  
  if (deviceType === 'Phone') {
    if (repairName === 'Screen Repair' || repairName === 'OLED Replacement' || repairName === 'LCD Replacement') { min = 250; max = 700; }
    else if (repairName === 'Battery Replacement') { min = 120; max = 300; }
    else if (repairName === 'Charging Port Repair' || repairName === 'Charging Port Replacement') { min = 150; max = 350; }
    else if (repairName === 'Camera Repair' || repairName === 'Front Camera Repair' || repairName === 'Rear Camera Replacement' || repairName === 'Front Camera Replacement') { min = 180; max = 450; }
    else if (repairName === 'Camera Glass Broken') { min = 100; max = 150; }
    else if (repairName === 'Back Glass Repair' || repairName === 'Back Glass Replacement') { min = 180; max = 500; }
    else if (repairName === 'Water Damage Repair' || repairName === 'Water / Liquid Damage Repair') { min = 250; max = 700; }
    else if (repairName === 'Motherboard Repair' || repairName === 'Motherboard / Logicboard Repair') { min = 400; max = 1000; }
    else if (repairName === 'Not Turning On') { min = 150; max = 300; }
    else if (repairName === 'Power / Volume Button') { min = 100; max = 200; }
    else if (repairName === 'Microphone Replacement' || repairName === 'Speaker Repair') { min = 100; max = 200; }
    else if (repairName.includes('Software')) { min = 120; max = 150; }
    else { min = 100; max = 250; }
  } else if (deviceType === 'Tablet') {
    if (repairName === 'Screen Repair' || repairName === 'Digitizer Replacement' || repairName === 'Front Glass Repair' || repairName === 'Main Lcd Repair') { min = 250; max = 650; }
    else if (repairName === 'Battery Replacement') { min = 150; max = 300; }
    else if (repairName === 'Charging Port Repair' || repairName === 'Charging Port Replacement') { min = 150; max = 300; }
    else if (repairName === 'Motherboard Repair' || repairName === 'Motherboard / Logicboard Repair') { min = 350; max = 900; }
    else if (repairName === 'Not Turning On') { min = 150; max = 400; }
    else if (repairName === 'Water Damage Repair' || repairName === 'Water / Liquid Damage Repair') { min = 250; max = 600; }
    else if (repairName.includes('Camera')) { min = 150; max = 300; }
    else if (repairName === 'Speaker Repair') { min = 120; max = 250; }
    else if (repairName.includes('Software')) { min = 120; max = 150; }
    else { min = 150; max = 300; }
  } else if (deviceType === 'Laptop') {
    if (repairName === 'Battery Replacement') {
      if (['HP', 'Dell', 'Lenovo'].includes(brandName)) { min = 140; max = 200; }
      else if (brandName === 'Apple') { min = 180; max = 350; }
      else { min = 150; max = 300; }
    }
    else if (repairName === 'Screen Replacement' || repairName === 'Screen Repair & Replacement') { min = 250; max = 900; }
    else if (repairName === 'Keyboard Replacement') { min = 150; max = 350; }
    else if (repairName === 'SSD Upgrade') { min = 180; max = 350; }
    else if (repairName === 'RAM Upgrade') { min = 150; max = 300; }
    else if (repairName.includes('Software') || repairName.includes('Windows') || repairName.includes('macOS') || repairName.includes('OS Installation')) { min = 120; max = 150; }
    else if (repairName === 'Virus Removal') { min = 120; max = 180; }
    else if (repairName === 'Motherboard Repair' || repairName === 'Motherboard / Logicboard Repair') { min = 450; max = 1200; }
    else if (repairName === 'Water / Liquid Damage Repair' || repairName === 'Liquid Damage Repair') { min = 350; max = 900; }
    else if (repairName === 'Trackpad Not Working') { min = 150; max = 300; }
    else if (repairName === 'Microphone Replacement' || repairName === 'Speaker Repair') { min = 120; max = 250; }
    else if (repairName === 'Not Turning On') { min = 200; max = 500; }
    else if (repairName === 'Charging Port Replacement' || repairName === 'Charging Port Repair') { min = 150; max = 350; }
    else { min = 150; max = 400; }
  } else {
    // Watches, Earbuds, Desktop, Monitor generic
    if (repairName.includes('Motherboard') || repairName.includes('Panel')) { min = 250; max = 700; }
    else if (repairName.includes('Battery')) { min = 100; max = 200; }
    else if (repairName.includes('Software')) { min = 120; max = 150; }
    else { min = 150; max = 350; }
  }
  
  return { min, max };
}

function calculatePrice(deviceType, repairName, brandName, modelTier) {
  if (repairName === 'Free Diagnostic') return 'Free';
  const { min, max } = getBounds(deviceType, repairName, brandName);
  
  const bScore = brandHierarchy[brandName] || 0.5;
  const combinedScore = (bScore * 0.4) + (modelTier * 0.6);
  
  // Calculate raw price within bounds based on score
  let price = min + (combinedScore * (max - min));
  
  // Add a small jitter to make prices unique for same tier models
  let jitter = (randomFloat() * 10) - 5; 
  price += jitter;
  
  // Clamp within exact user-provided bounds
  price = Math.max(min, Math.min(max, price));
  
  // Round to nearest integer
  price = Math.round(price);
  
  // If it's over $150, typically shops end prices in 9, but bounds are strict.
  // We will try to snap to nearest 9 if it stays in bounds
  let snapped = Math.round((price + 1) / 10) * 10 - 1;
  if (snapped >= min && snapped <= max) {
    price = snapped;
  }
  
  return `A$${price}`;
}

const database = {};

for (const [brandName, brandData] of Object.entries(brandDeviceMapping)) {
  database[brandName] = {};
  
  for (const displayDeviceType of brandData) {
    const genericType = getGenericType(displayDeviceType);
    
    // Check if the specific displayDeviceType exists in modelsDB, else fallback to genericType
    const modelsList = modelsDB[brandName][displayDeviceType] || modelsDB[brandName][genericType];
    
    if (!modelsDB[brandName] || !modelsList) continue;
    
    database[brandName][displayDeviceType] = {
      models: [],
      repairs: {}
    };

    let availableRepairs = repairsList[genericType] || [];
    if (displayDeviceType === 'iPhone') {
      availableRepairs = repairsList['iPhone'];
    } else if (displayDeviceType === 'iPad') {
      availableRepairs = repairsList['iPad'];
    } else if (displayDeviceType === 'MacBook') {
      availableRepairs = repairsList['MacBook'];
    } else if (displayDeviceType === 'Apple Watch') {
      availableRepairs = repairsList['Apple Watch'];
    }
    
    for (const model of modelsList) {
      database[brandName][displayDeviceType].models.push({
        name: model.name,
        year: model.year
      });

      const isMacBook = brandName === 'Apple' && genericType === 'Laptop';
      const mTier = model.tier;

      let repairsForModel = availableRepairs.map(r => {
        let repName = r.name;
        if (repName === 'Software Update / Restore' && isMacBook) repName = 'macOS Update / Restore';
        
        const priceStr = calculatePrice(genericType, r.name, brandName, mTier);
        
        return {
          name: repName,
          price: priceStr,
          duration: r.dur,
          warranty: '12 months',
          popular: r.pop
        };
      });

      // Optional additional OS repairs
      if (isMacBook) {
        repairsForModel.push({
          name: 'macOS Installation',
          price: calculatePrice('Laptop', 'Software', brandName, mTier),
          duration: '2 hours',
          warranty: '12 months',
          popular: false
        });
      } else if (genericType === 'Laptop') {
        repairsForModel.push({
          name: 'Windows Installation',
          price: calculatePrice('Laptop', 'Software', brandName, mTier),
          duration: '2 hours',
          warranty: '12 months',
          popular: false
        });
      }
      
      if (brandName === 'Acer') {
        const m = model.name;
        if (['Swift 3', 'Acer Swift Go 14 AI', 'Acer Aspire Go 15', 'Acer Swift Go 14'].includes(m)) {
          repairsForModel = [
            { name: 'Screen Repair & Replacement', price: calculatePrice('Laptop', 'Screen Replacement', 'Acer', mTier), duration: '4 days', warranty: '12 mo warranty', popular: true },
            { name: 'Battery Replacement', price: calculatePrice('Laptop', 'Battery Replacement', 'Acer', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: false },
            { name: 'Software Update / Restore', price: calculatePrice('Laptop', 'Software', 'Acer', mTier), duration: '1 day', warranty: '12 mo warranty', popular: false },
            { name: 'Free Diagnostic', price: 'Free', duration: '1 day', warranty: '12 mo warranty', popular: false }
          ];
        } else if (m === 'Aspire 5') {
          repairsForModel = [
            { name: 'Screen Repair & Replacement', price: calculatePrice('Laptop', 'Screen Replacement', 'Acer', mTier), duration: '4 days', warranty: '12 mo warranty', popular: true },
            { name: 'Battery Replacement', price: calculatePrice('Laptop', 'Battery Replacement', 'Acer', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: false }
          ];
        } else {
          repairsForModel = [
            { name: 'Screen Repair & Replacement', price: calculatePrice('Laptop', 'Screen Replacement', 'Acer', mTier), duration: '4 days', warranty: '12 mo warranty', popular: true }
          ];
        }
      } else if (brandName === 'Asus') {
        repairsForModel = [
          { name: 'Screen Repair', price: calculatePrice('Phone', 'Screen Repair', 'Asus', mTier), duration: '2 days', warranty: '12 mo warranty', popular: true },
          { name: 'Battery Replacement', price: calculatePrice('Phone', 'Battery Replacement', 'Asus', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: false }
        ];
      } else if (brandName === 'HP' || (brandName === 'Lenovo' && (displayDeviceType === 'ThinkPad' || displayDeviceType === 'IdeaPad' || displayDeviceType === 'Lenovo Tablet'))) {
        repairsForModel = [
          { name: 'Battery Replacement', price: calculatePrice('Laptop', 'Battery Replacement', 'Lenovo', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: true },
          { name: 'Software Update / Restore', price: calculatePrice('Laptop', 'Software', 'Lenovo', mTier), duration: '3 hours', warranty: '12 mo warranty', popular: false },
          { name: 'Free Diagnostic', price: 'Free', duration: '3 hours', warranty: '12 mo warranty', popular: false }
        ];
      } else if (brandName === 'Huawei' && (displayDeviceType === 'P Series' || displayDeviceType === 'Mate Series')) {
        const m = model.name;
        repairsForModel = [
          { name: 'Screen Repair', price: calculatePrice('Phone', 'Screen Repair', 'Huawei', mTier), duration: '45 min', warranty: '12 mo warranty', popular: m === 'Mate 50 Pro' || m.includes('P60') },
          { name: 'Battery Replacement', price: calculatePrice('Phone', 'Battery Replacement', 'Huawei', mTier), duration: '30 min', warranty: '12 mo warranty', popular: false },
          { name: 'Speaker Repair', price: calculatePrice('Phone', 'Speaker Repair', 'Huawei', mTier), duration: '30 min', warranty: '12 mo warranty', popular: false }
        ];
      } else if (brandName === 'Dell' && displayDeviceType === 'Laptop') {
        const m = model.name;
        if (['XPS 13', 'Inspiron 15', 'Inspiron 14'].includes(m)) {
          repairsForModel = [
            { name: 'Screen Repair', price: calculatePrice('Laptop', 'Screen Replacement', 'Dell', mTier), duration: '2 hours', warranty: '12 mo warranty', popular: m === 'Inspiron 14' },
            { name: 'Battery Replacement', price: calculatePrice('Laptop', 'Battery Replacement', 'Dell', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: false },
            { name: 'Software Update / Restore', price: calculatePrice('Laptop', 'Software', 'Dell', mTier), duration: '3 hours', warranty: '12 mo warranty', popular: false },
            { name: 'Free Diagnostic', price: 'Free', duration: '3 hours', warranty: '12 mo warranty', popular: false }
          ];
        } else if (m === 'XPS 15') {
          repairsForModel = [
            { name: 'Battery Replacement', price: calculatePrice('Laptop', 'Battery Replacement', 'Dell', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: false },
            { name: 'Software Update / Restore', price: calculatePrice('Laptop', 'Software', 'Dell', mTier), duration: '3 hours', warranty: '12 mo warranty', popular: false },
            { name: 'Free Diagnostic', price: 'Free', duration: '3 hours', warranty: '12 mo warranty', popular: false }
          ];
        }
      } else if (brandName === 'Motorola') {
        repairsForModel = [
          { name: 'Screen Repair', price: calculatePrice('Phone', 'Screen Repair', 'Motorola', mTier), duration: '1 day', warranty: '12 mo warranty', popular: true },
          { name: 'Speaker Repair', price: calculatePrice('Phone', 'Speaker Repair', 'Motorola', mTier), duration: '30 min', warranty: '12 mo warranty', popular: false }
        ];
      } else if (brandName === 'OnePlus') {
        const m = model.name;
        if (m === 'OnePlus 11R' || m === '11R') {
          repairsForModel = [
            { name: 'Screen Repair', price: calculatePrice('Phone', 'Screen Repair', 'OnePlus', mTier), duration: '1 day', warranty: '12 mo warranty', popular: true },
            { name: 'Speaker Repair', price: calculatePrice('Phone', 'Speaker Repair', 'OnePlus', mTier), duration: '30 min', warranty: '12 mo warranty', popular: false }
          ];
        } else {
          repairsForModel = [
            { name: 'Screen Repair', price: calculatePrice('Phone', 'Screen Repair', 'OnePlus', mTier), duration: '2 days', warranty: '12 mo warranty', popular: true },
            { name: 'Battery Replacement', price: calculatePrice('Phone', 'Battery Replacement', 'OnePlus', mTier), duration: '30 min', warranty: '12 mo warranty', popular: false },
            { name: 'Speaker Repair', price: calculatePrice('Phone', 'Speaker Repair', 'OnePlus', mTier), duration: '30 min', warranty: '12 mo warranty', popular: false },
            { name: 'Free Diagnostic', price: 'Free', duration: '1 hour', warranty: '12 mo warranty', popular: false }
          ];
        }
      } else if (brandName === 'Oppo' && displayDeviceType === 'Find') {
        repairsForModel = [
          { name: 'Screen Repair', price: calculatePrice('Phone', 'Screen Repair', 'Oppo', mTier), duration: '2 hours', warranty: '12 mo warranty', popular: true },
          { name: 'Battery Replacement', price: calculatePrice('Phone', 'Battery Replacement', 'Oppo', mTier), duration: '30 min', warranty: '12 mo warranty', popular: false },
          { name: 'Speaker Repair', price: calculatePrice('Phone', 'Speaker Repair', 'Oppo', mTier), duration: '30 min', warranty: '12 mo warranty', popular: false }
        ];
      } else if (brandName === 'Oppo' && displayDeviceType === 'Reno') {
        const m = model.name;
        if (m === 'Oppo Reno 10') {
          repairsForModel = [
            { name: 'Screen Repair', price: calculatePrice('Phone', 'Screen Repair', 'Oppo', mTier), duration: '2 hours', warranty: '12 mo warranty', popular: true }
          ];
        } else {
          repairsForModel = [
            { name: 'Screen Repair', price: calculatePrice('Phone', 'Screen Repair', 'Oppo', mTier), duration: '2 hours', warranty: '12 mo warranty', popular: false },
            { name: 'Speaker Repair', price: calculatePrice('Phone', 'Speaker Repair', 'Oppo', mTier), duration: '30 min', warranty: '12 mo warranty', popular: false }
          ];
        }
      } else if (brandName === 'Microsoft' && displayDeviceType === 'Surface Tablet') {
        const m = model.name;
        if (m === 'Surface Pro 8') {
          repairsForModel = [
            { name: 'Screen Repair & Replacement', price: calculatePrice('Tablet', 'Screen Replacement', 'Microsoft', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: false },
            { name: 'Screen Repair', price: calculatePrice('Tablet', 'Screen Repair', 'Microsoft', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: true },
            { name: 'Battery Replacement', price: calculatePrice('Tablet', 'Battery Replacement', 'Microsoft', mTier), duration: '45 min', warranty: '12 mo warranty', popular: false }
          ];
        } else if (m === 'Surface Pro 9' || m === 'Surface Go 3') {
          repairsForModel = [
            { name: 'Screen Repair / Replacement', price: calculatePrice('Tablet', 'Screen Replacement', 'Microsoft', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: false },
            { name: 'Battery Replacement', price: calculatePrice('Tablet', 'Battery Replacement', 'Microsoft', mTier), duration: '45 min', warranty: '12 mo warranty', popular: false }
          ];
        }
      } else if (brandName === 'Microsoft' && displayDeviceType === 'Surface Laptop') {
        repairsForModel = [
          { name: 'Battery Replacement', price: calculatePrice('Laptop', 'Battery Replacement', 'Microsoft', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: false },
          { name: 'Software Update / Restore', price: calculatePrice('Laptop', 'Software', 'Microsoft', mTier), duration: '3 hours', warranty: '12 mo warranty', popular: false },
          { name: 'Free Diagnostic', price: 'Free', duration: '3 hours', warranty: '12 mo warranty', popular: false }
        ];
      } else if (brandName === 'Google' && displayDeviceType === 'Pixel') {
        repairsForModel = [
          { name: 'Screen Repair', price: calculatePrice('Phone', 'Screen Repair', 'Google', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: true }
        ];
      } else if (brandName === 'Samsung' && displayDeviceType === 'Galaxy S Series') {
        const m = model.name;
        if (m === 'Samsung Galaxy S20 FE') {
          repairsForModel = [
            { name: 'Screen Repair', price: calculatePrice('Phone', 'Screen Repair', 'Samsung', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: true },
            { name: 'Battery Replacement', price: calculatePrice('Phone', 'Battery Replacement', 'Samsung', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: false }
          ];
        }
      } else if (brandName === 'Samsung' && displayDeviceType === 'Galaxy A Series') {
        const m = model.name;
        if (m === 'Samsung Galaxy A25 5G') {
          repairsForModel = [
            { name: 'Screen Repair', price: calculatePrice('Phone', 'Screen Repair', 'Samsung', mTier), duration: '2 hours', warranty: '12 mo warranty', popular: true }
          ];
        }
      } else if (brandName === 'Apple' && displayDeviceType === 'iPhone') {
        const m = model.name;
        if (m === 'iPhone 17e') {
          repairsForModel = [
            { name: 'Screen Repair', price: calculatePrice('Phone', 'Screen Repair', 'Apple', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: true, partOption: true }
          ];
        } else if (m === 'iPhone 8') {
          repairsForModel = [
            { name: 'Screen Repair', price: calculatePrice('Phone', 'Screen Repair', 'Apple', mTier), duration: '1 hour', warranty: '12 mo warranty', popular: true }
          ];
        }
      } else if (brandName === 'Apple' && displayDeviceType === 'iPad') {
        const m = model.name;
        const ipadTxtPath = path.join(__dirname, '../../../iPad_Repairs_Prices_Plus20_With_Spacing.txt');
        if (!global.ipadRepairsParsed) {
          global.ipadRepairsParsed = {};
          if (fs.existsSync(ipadTxtPath)) {
            const content = fs.readFileSync(ipadTxtPath, 'utf8');
            const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
            
            const knownModels = [
              'iPad 11th Gen (A16)', 'iPad Pro 11-inch (M5)', 'iPad Pro 11-inch (M4)', 'iPad Pro 13-inch (M4)',
              'iPad Air 13-inch (M2)', 'iPad Air 11-inch (M2)', 'iPad Pro 11-inch (4th gen)', 'iPad 10th Generation',
              'iPad Pro 12.9-inch (6th gen)', 'iPad Air (5th generation)', 'iPad mini 6', 'iPad Pro 12.9-inch (5th gen)',
              'iPad Pro 11-inch (3rd gen)', 'iPad (9th generation)', 'iPad Pro 12.9-inch (4th gen)', 'iPad (8th generation)',
              'iPad Air (4th generation)', 'iPad Pro 11-inch (2nd gen)', 'iPad (7th generation)', 'iPad Air (3rd generation)',
              'iPad Mini (5th generation)', 'iPad (6th generation)', 'iPad Pro 12.9-inch (3rd gen)', 'iPad Pro 11-inch (1st gen)',
              'iPad Pro 10.5-inch (1st gen)', 'iPad (5th generation)', 'iPad Pro 9.7-inch (1st gen)', 'iPad Pro 12.9-inch (1st gen)',
              'iPad Mini 4', 'iPad Mini 3'
            ];
            
            let currentModel = null;
            let i = 0;
            while (i < lines.length) {
              const line = lines[i];
              const normalized = line.replace(/^Repairs for\s+/i, '').trim();
              
              if (knownModels.includes(normalized)) {
                currentModel = normalized;
                global.ipadRepairsParsed[currentModel] = [];
                i++;
                continue;
              }
              
              if (line === 'No repair services available yet.') {
                i++;
                continue;
              }
              
              if (line === 'Common issues' || line === 'View details' || line === 'From') {
                i++;
                continue;
              }
              
              if (currentModel) {
                const repairName = line;
                const durationLine = lines[i + 1];
                if (durationLine && (durationLine.includes('hour') || durationLine.includes('min') || durationLine.includes('day'))) {
                  let duration = durationLine.replace('12mo', '').trim();
                  let priceLine = null;
                  let nextIdx = i + 2;
                  if (lines[nextIdx] === 'View details') {
                    nextIdx++;
                  }
                  if (lines[nextIdx] === 'From') {
                    nextIdx++;
                  }
                  priceLine = lines[nextIdx];
                  if (priceLine && priceLine.startsWith('$')) {
                    const priceVal = parseFloat(priceLine.replace('$', ''));
                    let finalPriceStr = '';
                    if (priceVal === 0) {
                      finalPriceStr = 'Free';
                    } else {
                      const adjustedPrice = Math.floor(priceVal);
                      finalPriceStr = `A$${adjustedPrice}`;
                    }
                    
                    global.ipadRepairsParsed[currentModel].push({
                      name: repairName,
                      price: finalPriceStr,
                      duration: duration,
                      warranty: '12 mo warranty',
                      popular: false
                    });
                    
                    i = nextIdx + 1;
                    continue;
                  }
                }
              }
              i++;
            }
          }
        }
        
        repairsForModel = global.ipadRepairsParsed[m] || [];
      } else if (brandName === 'Apple' && displayDeviceType === 'Laptop') {
        const m = model.name;
        if (m === 'MacBook Pro 14" (M2 Pro)') {
          repairsForModel = [
            { name: 'Screen Repair & Replacement', price: calculatePrice('Laptop', 'Screen Replacement', 'Apple', mTier), duration: '1 day', warranty: '12 mo warranty', popular: false }
          ];
        } else if (m === 'MacBook Pro 15"') {
          repairsForModel = [
            { name: 'Battery Replacement', price: calculatePrice('Laptop', 'Battery Replacement', 'Apple', mTier), duration: '3 hours', warranty: '12 mo warranty', popular: false },
            { name: 'Charging Port Replacement', price: calculatePrice('Laptop', 'Charging Port Replacement', 'Apple', mTier), duration: '2 hours', warranty: '12 mo warranty', popular: false }
          ];
        } else if (m === 'MacBook Pro 16" (M3 Pro/Max)') {
          repairsForModel = [
            { name: 'Screen Repair & Replacement', price: calculatePrice('Laptop', 'Screen Replacement', 'Apple', mTier), duration: '4 hours', warranty: '12 mo warranty', popular: false },
            { name: 'Keyboard Replacement', price: calculatePrice('Laptop', 'Keyboard Replacement', 'Apple', mTier), duration: '2 days', warranty: '12 mo warranty', popular: false },
            { name: 'Trackpad Not Working', price: calculatePrice('Laptop', 'Trackpad Replacement', 'Apple', mTier), duration: '2 days', warranty: '12 mo warranty', popular: false },
            { name: 'Speaker Repair', price: calculatePrice('Laptop', 'Speaker Repair', 'Apple', mTier), duration: '1 day', warranty: '12 mo warranty', popular: false },
            { name: 'Water / Liquid Damage Repair', price: calculatePrice('Laptop', 'Water Damage Repair', 'Apple', mTier), duration: '2 days', warranty: '12 mo warranty', popular: false },
            { name: 'Motherboard / Logicboard Repair', price: calculatePrice('Laptop', 'Motherboard Repair', 'Apple', mTier), duration: '2 days', warranty: '12 mo warranty', popular: false },
            { name: 'Not Turning On', price: calculatePrice('Laptop', 'Not Turning On', 'Apple', mTier), duration: '2 days', warranty: '12 mo warranty', popular: false },
            { name: 'Free Diagnostic', price: 'Free', duration: '1 hour', warranty: '12 mo warranty', popular: false }
          ];
        }
      } else if (brandName === 'Apple' && displayDeviceType === 'Apple Watch') {
        repairsForModel = [
          { name: 'Screen Repair', price: calculatePrice('Watch', 'Screen Repair', 'Apple', mTier), duration: '1 day', warranty: '12 months', popular: true }
        ];
      }

      repairsForModel.sort((a, b) => {
        const aIsScreen = a.name.toLowerCase().includes('screen');
        const bIsScreen = b.name.toLowerCase().includes('screen');
        if (aIsScreen && !bIsScreen) return -1;
        if (!aIsScreen && bIsScreen) return 1;
        return (parseInt(b.price.replace('A$', '')) || 0) - (parseInt(a.price.replace('A$', '')) || 0);
      });
      database[brandName][displayDeviceType].repairs[model.name] = repairsForModel;
    }
  }
}

const outPath = path.join(__dirname, 'repairDatabase.json');
fs.writeFileSync(outPath, JSON.stringify(database, null, 2));

console.log(`Successfully generated bound-restricted dynamic repair database at: ${outPath}`);
