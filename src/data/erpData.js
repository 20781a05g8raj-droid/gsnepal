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
