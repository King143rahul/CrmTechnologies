// This file simulates a real backend API (like Medusa.js).
// We add an artificial delay to test loading states and make swapping to a real API seamless.

const DELAY_MS = 800; // Simulate network latency

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Mock Data ---
const MOCK_PRODUCTS = [
  {
    id: "prod_1",
    title: "Ubiquiti UniFi Dream Machine Pro",
    price: 379.0,
    originalPrice: 399.0,
    brand: "Ubiquiti",
    imageUrl: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 128,
    description: "Enterprise-grade rackmount security gateway & network appliance with 10G SFP+ and advanced threat management. Experience seamless integration and management of your entire network through a single, highly intuitive interface.",
    specs: [
      { name: "Networking Interface", value: "(8) GbE RJ45 LAN, (1) 1/10G SFP+ LAN" },
      { name: "Management Interface", value: "Ethernet In-Band" },
      { name: "Power Method", value: "Universal AC Input, 100-240VAC, 50/60 Hz" },
      { name: "Max Power Consumption", value: "33W" },
    ],
    inStock: true,
  },
  {
    id: "prod_2",
    title: "Cisco Catalyst 9300 48-port Switch",
    price: 3200.0,
    brand: "Cisco",
    imageUrl: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 45,
    description: "Stackable enterprise switching platform built for security, IoT, mobility, and cloud.",
    specs: [
      { name: "Ports", value: "48x 10/100/1000 Ethernet" },
    ],
    inStock: true,
  },
  {
    id: "prod_3",
    title: "Intel Xeon Gold 6230 Processor",
    price: 1899.0,
    originalPrice: 2100.0,
    brand: "Intel",
    imageUrl: "/placeholder.svg",
    rating: 4.7,
    reviewCount: 89,
    description: "20 Cores, 40 Threads, 2.10 GHz Base Frequency.",
    specs: [
      { name: "Cores", value: "20 Cores / 40 Threads" },
      { name: "Base Frequency", value: "2.10 GHz" },
      { name: "Max Turbo", value: "3.90 GHz" },
      { name: "Cache", value: "27.5 MB L3" }
    ],
    inStock: true,
  },
  {
    id: "prod_4",
    title: "Dell PowerEdge R740 Rack Server",
    price: 4500.0,
    brand: "Dell EMC",
    imageUrl: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 22,
    description: "Maximize application performance with the optimal mix of accelerator cards, storage and compute power in a 2U, 2-socket platform optimized for VDI.",
    specs: [
      { name: "Processors", value: "Up to two 2nd Generation Intel Xeon Scalable" },
      { name: "Memory", value: "24 DDR4 DIMM slots, Supports RDIMM /LRDIMM" },
      { name: "Storage", value: "Up to 16 x 2.5\" SAS/SATA/SSD" },
      { name: "Form Factor", value: "2U Rack Server" }
    ],
    inStock: false,
  },
  {
    id: "prod_5",
    title: "Square Register POS Terminal",
    price: 799.0,
    brand: "Square",
    imageUrl: "/placeholder.svg",
    rating: 4.6,
    reviewCount: 312,
    description: "Fully integrated point-of-sale system that lets you manage your business, take payments, and run reports.",
    specs: [
      { name: "Display", value: "Customer-facing display included" },
      { name: "Payments", value: "Magstripe, Chip (EMV), NFC" },
      { name: "Connectivity", value: "Wi-Fi, Ethernet, USB Hub" }
    ],
    inStock: true,
  },
  {
    id: "prod_6",
    title: "Synology RackStation RS1221+ NAS",
    price: 1299.0,
    brand: "Synology",
    imageUrl: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 67,
    description: "Powerful and compact 8-bay rackmount NAS for small to medium-sized businesses.",
    specs: [
      { name: "CPU", value: "AMD Ryzen V1500B 4-core" },
      { name: "RAM", value: "4 GB DDR4 ECC (Expandable to 32 GB)" },
      { name: "Drive Bays", value: "8 Bays (SATA HDD/SSD)" },
      { name: "Form Factor", value: "2U Rackmount" }
    ],
    inStock: true,
  },
  {
    id: "prod_7",
    title: "Logitech MX Master 3S Wireless Mouse",
    price: 99.99,
    brand: "Logitech",
    imageUrl: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 2450,
    description: "Advanced ergonomic mouse with ultra-fast scrolling.",
    specs: [],
    inStock: true,
  },
  {
    id: "prod_8",
    title: "APC Smart-UPS 1500VA Battery Backup",
    price: 249.0,
    brand: "APC",
    imageUrl: "/placeholder.svg",
    rating: 4.7,
    reviewCount: 184,
    description: "Intelligent and efficient network power protection.",
    specs: [],
    inStock: true,
  },
];

const MOCK_CATEGORIES = [
  { title: "Laptop", imageUrl: "/src/assets/1sa.jpeg" },
  { title: "PC's", imageUrl: "/src/assets/2sa.jpeg" },
  { title: "Components", imageUrl: "/src/assets/3sa.jpeg" },
  { title: "Networking", imageUrl: "/src/assets/4sa.jpeg" },
  { title: "Accessories", imageUrl: "/src/assets/5sa.jpeg" },
];

const NAVIGATION_DATA = [
  {
    title: "Laptop",
    subcategories: [
      { name: "Gaming Laptops" },
      { name: "Business Laptops" },
      { name: "2-in-1 Laptops" },
      { name: "Macbooks" },
      { name: "Pre-owned" },
      { name: "Tablets" }
    ],
  },
  {
    title: "PC's",
    subcategories: [
      { name: "Gaming PC's" },
      { name: "Desktop PC's" },
      { name: "Pre-owned" },
      { name: "Mini Pc's" },
      { name: "All-in-One PCs" },
      { name: "Workstations" }
    ],
  },
  {
    title: "Laptops Repair Item",
    subcategories: [
      { name: "Laptop Keyboards" },
      { name: "Laptop Batteries" },
      { name: "Laptop Screens" },
      { name: "Laptop Dc Jack" },
      { name: "Laptop Chargers" },
      { name: "Laptop Fan" },
      { name: "Laptop Repairs" }
    ],
  },
  {
    title: "Components",
    subcategories: [
      { name: "Processors (CPUs)" },
      { name: "Motherboards" },
      { name: "Graphics Cards (GPU)" },
      { name: "RAM (Memory)" },
      { name: "Storage", items: ["SSD", "HDD & NAS drive", "USB & memory cards", "External Drives", "Surveillance Drive"] },
      { name: "Power Supplies (PSU)" },
      { name: "Computer Cases" },
      { name: "Cooling Systems", items: ["Air Cooling", "Liquid Cooling"] },
      { name: "Monitors, Tv & display", items: ["Gaming Monitors", "Office Monitors", "TV's", "Interactive Display"] },
      { name: "LPT & PCI cards" },
      { name: "Upgrade Kits" },
      { name: "DVD RW" }
    ],
  },
  {
    title: "Accessories",
    subcategories: [
      { name: "Keyboards" },
      { name: "Mice (mouse)" },
      { name: "Headsets" },
      { name: "Webcams" },
      { name: "Mouse Pads" },
      { name: "Laptop Bags & Sleeves" },
      { name: "Docking Stations" },
      { name: "Printers", items: ["Inkjet & tank Printers", "Laser Printers", "Document Scanners", "POS Printers"] },
      { name: "Ink & toners", items: ["Ink", "Toners"] },
      { name: "Adaptors & chargers" },
      { name: "Cables & adaptors", items: ["printer & extension cable", "Audio Cables", "Display Cable", "OTG Cables", "Display Converters", "Molex & internal pc cables", "Serial and parrlial cable", "BT Adaptor", "BT Receiver & trasmitters"] },
      { name: "Bluetooth devices" },
      { name: "Pointer & presentaion devices" },
      { name: "splitter & switchs", items: ["Hdmi & Vga switches", "Hdmi & vga splitters"] },
      { name: "Earphones & Headphone" },
      { name: "Enclosures", items: ["2.5 & 3.5 cases", "NAS Enclosures", "Consoles"] },
      { name: "Gaming", items: ["Gaming Chairs", "Gaming Accessories"] },
      { name: "OS" },
      { name: "Software", items: ["Antivirus & security software", "Office Softwares", "Other Softwares"] },
      { name: "Inverters & UPS", items: ["Surge Protectors", "Power Cables & extension"] },
      { name: "Power & Protection" },
      { name: "Projectors" },
      { name: "laptop Stands" },
      { name: "Power Banks" },
      { name: "Tablets cases" },
      { name: "TV & monitor stand" }
    ],
  },
  {
    title: "Networking",
    subcategories: [
      { name: "Routers" },
      { name: "4G & 5G routers" },
      { name: "Modem" },
      { name: "Network Switches" },
      { name: "Wi-Fi Adaptors" },
      { name: "Range Extenders" },
      { name: "Accessories" },
      { name: "Toolkits" },
      { name: "Cat5 Cables" },
      { name: "Cat6 Cables" },
      { name: "Fiber Cables" }
    ],
  },
  {
    title: "Security & CCTV",
    subcategories: [
      { name: "Analog DVR & cameras" },
      { name: "NVR & IP cameras" },
      { name: "Wifi & mobile solutions" },
      { name: "Intercoms" },
      { name: "Gate motors" },
      { name: "Alarms Systems" },
      { name: "Accessories" },
      { name: "Spy Cameras" },
      { name: "Dash cameras" },
      { name: "Hdmi & vga extender" }
    ],
  },
  {
    title: "Smart Devices",
    subcategories: [
      { name: "Smart Watches" },
      { name: "IOT Devices" },
      { name: "Smart home" }
    ],
  },
  {
    title: "Point Of Sale",
    subcategories: [
      { name: "POS Machine" },
      { name: "Barcode Scanners" },
      { name: "Cash Drawers" },
      { name: "Barcode Printers" },
      { name: "Slip Printers" },
      { name: "Access Devices" }
    ],
  },
];

let CART_ITEMS = [
  {
    id: "prod_1",
    title: "Ubiquiti UniFi Dream Machine Pro",
    brand: "Ubiquiti",
    price: 379.0,
    quantity: 1,
    imageUrl: "/placeholder.svg",
  },
  {
    id: "prod_7",
    title: "Logitech MX Master 3S Wireless Mouse",
    brand: "Logitech",
    price: 99.99,
    quantity: 2,
    imageUrl: "/placeholder.svg",
  },
];

// --- API Functions ---

export async function fetchProducts() {
  await delay(DELAY_MS);
  return MOCK_PRODUCTS;
}

export async function fetchProductById(id: string) {
  await delay(DELAY_MS);
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  if (!product) throw new Error("Product not found");
  return product;
}

export async function fetchCategories() {
  await delay(DELAY_MS);
  return MOCK_CATEGORIES;
}

export async function fetchNavigation() {
  await delay(DELAY_MS);
  return NAVIGATION_DATA;
}

export async function fetchCart() {
  await delay(DELAY_MS);
  return CART_ITEMS;
}

export async function updateCartItemQuantity(id: string, newQuantity: number) {
  await delay(DELAY_MS / 2);
  CART_ITEMS = CART_ITEMS.map((item) =>
    item.id === id ? { ...item, quantity: newQuantity } : item
  );
  return CART_ITEMS;
}

export async function removeCartItem(id: string) {
  await delay(DELAY_MS / 2);
  CART_ITEMS = CART_ITEMS.filter((item) => item.id !== id);
  return CART_ITEMS;
}
