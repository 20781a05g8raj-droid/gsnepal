export const INITIAL_SELLERS = [
  {
    id: 'seller-101',
    companyName: 'Apex Industrial Machines Pvt Ltd',
    contactPerson: 'Rajesh Kumar Agarwal',
    email: 'contact@apexindustrial.com',
    phone: '9779821863885',
    location: 'Kathmandu / Delhi',
    panGst: 'PAN-300492811',
    category: 'Industrial Machinery',
    status: 'Verified',
    totalProducts: 2,
    joinedDate: '2026-06-15'
  },
  {
    id: 'seller-105',
    companyName: 'MedTech Surgical & Hospital Supplies',
    contactPerson: 'Dr. Bishal Shrestha',
    email: 'sales@medtechsurgical.np',
    phone: '9779821863885',
    location: 'Kathmandu, Nepal',
    panGst: 'PAN-601948203',
    category: 'Medical & Healthcare',
    status: 'Verified',
    totalProducts: 1,
    joinedDate: '2026-07-01'
  },
  {
    id: 'seller-102',
    companyName: 'Himalayan Herbal & Spices Export',
    contactPerson: 'Sunita Gurung',
    email: 'info@himalayanherbal.com',
    phone: '9779821863885',
    location: 'Pokhara, Nepal',
    panGst: 'PAN-409182745',
    category: 'Agriculture & Food',
    status: 'Verified',
    totalProducts: 1,
    joinedDate: '2026-07-05'
  },
  {
    id: 'seller-103',
    companyName: 'NextGen Electronics Wholesalers',
    contactPerson: 'Vikram Mehta',
    email: 'sales@nextgenelectronics.in',
    phone: '9779821863885',
    location: 'Mumbai, India',
    panGst: 'GSTIN-27AAAAA0000A1Z5',
    category: 'Electronics & Solar',
    status: 'Pending Verification',
    totalProducts: 1,
    joinedDate: '2026-07-18'
  }
];

export const INITIAL_BUYERS = [
  {
    id: 'buyer-201',
    name: 'Ramesh Thapa (Prabhu Trading House)',
    email: 'ramesh@prabhutrading.com',
    phone: '9779841000111',
    location: 'Biratnagar, Nepal',
    interest: 'Industrial Machinery & Packaging',
    inquiriesSent: 8,
    joinedDate: '2026-06-20'
  },
  {
    id: 'buyer-202',
    name: 'Avishek Sharma (Hospitech Nepal)',
    email: 'avishek@hospitech.np',
    phone: '9779802223344',
    location: 'Lalitpur, Nepal',
    interest: 'Medical Syringes & Surgical Disposables',
    inquiriesSent: 14,
    joinedDate: '2026-07-02'
  },
  {
    id: 'buyer-203',
    name: 'Suman Joshi (Himalayan Agro Trading)',
    email: 'suman.joshi@agrotrade.np',
    phone: '9779851122334',
    location: 'Butwal, Nepal',
    interest: 'Large Cardamom & Organic Herbs',
    inquiriesSent: 5,
    joinedDate: '2026-07-10'
  }
];

export const INITIAL_INQUIRIES = [
  {
    id: 'inq-901',
    buyerName: 'Avishek Sharma',
    productName: 'Disposable Sterile Syringe Luer Lock 5ml',
    sellerName: 'MedTech Surgical & Hospital Supplies',
    targetQty: '50,000 Pcs',
    estimatedValue: 900000,
    status: 'Converted / Direct WhatsApp',
    date: '2026-07-22'
  },
  {
    id: 'inq-902',
    buyerName: 'Ramesh Thapa',
    productName: 'Automatic Paper Cup Making Machine 90pcs/min',
    sellerName: 'Apex Industrial Machines Pvt Ltd',
    targetQty: '2 Sets',
    estimatedValue: 970000,
    status: 'In Discussion',
    date: '2026-07-21'
  },
  {
    id: 'inq-903',
    buyerName: 'Suman Joshi',
    productName: 'Bulk Organic Large Cardamom (Elaichi) Grade A',
    sellerName: 'Himalayan Herbal & Spices Export',
    targetQty: '500 Kg',
    estimatedValue: 625000,
    status: 'Quotation Sent',
    date: '2026-07-20'
  }
];

export const INITIAL_SALES_JOURNAL = [
  {
    id: 'JRN-2026-001',
    date: '2026-07-22',
    sellerId: 'seller-105',
    sellerName: 'MedTech Surgical & Hospital Supplies',
    buyerName: 'Avishek Sharma (Hospitech Nepal)',
    productName: 'Disposable Sterile Syringe Luer Lock 5ml',
    category: 'Medical & Healthcare',
    quantity: 50000,
    unit: 'Pcs',
    pricePerUnit: 18,
    totalAmount: 900000,
    paymentStatus: 'Paid / Completed',
    deliveryStatus: 'Dispatched via Express Logistics'
  },
  {
    id: 'JRN-2026-002',
    date: '2026-07-20',
    sellerId: 'seller-101',
    sellerName: 'Apex Industrial Machines Pvt Ltd',
    buyerName: 'Ramesh Thapa (Prabhu Trading House)',
    productName: 'Automatic Paper Cup Making Machine 90pcs/min',
    category: 'Industrial Machinery',
    quantity: 2,
    unit: 'Set',
    pricePerUnit: 485000,
    totalAmount: 970000,
    paymentStatus: '50% Advance Received',
    deliveryStatus: 'Under Factory Assembly'
  },
  {
    id: 'JRN-2026-003',
    date: '2026-07-18',
    sellerId: 'seller-102',
    sellerName: 'Himalayan Herbal & Spices Export',
    buyerName: 'Suman Joshi (Himalayan Agro Trading)',
    productName: 'Bulk Organic Large Cardamom (Elaichi) Grade A',
    category: 'Agriculture & Food',
    quantity: 500,
    unit: 'Kg',
    pricePerUnit: 1250,
    totalAmount: 625000,
    paymentStatus: 'Paid / Completed',
    deliveryStatus: 'Delivered'
  },
  {
    id: 'JRN-2026-004',
    date: '2026-07-15',
    sellerId: 'seller-101',
    sellerName: 'Apex Industrial Machines Pvt Ltd',
    buyerName: 'Kathmandu Plastic Industries',
    productName: 'Heavy Duty Plastic Injection Molding Machine 180T',
    category: 'Industrial Machinery',
    quantity: 1,
    unit: 'Set',
    pricePerUnit: 1850000,
    totalAmount: 1850000,
    paymentStatus: 'Paid / Completed',
    deliveryStatus: 'Installed at Site'
  },
  {
    id: 'JRN-2026-005',
    date: '2026-07-12',
    sellerId: 'seller-103',
    sellerName: 'NextGen Electronics Wholesalers',
    buyerName: 'Surya Solar Power Systems',
    productName: 'Monocrystalline Solar Panel 550W Tier 1',
    category: 'Electronics & Solar',
    quantity: 100,
    unit: 'Piece',
    pricePerUnit: 14500,
    totalAmount: 1450000,
    paymentStatus: 'Paid / Completed',
    deliveryStatus: 'Delivered'
  }
];
