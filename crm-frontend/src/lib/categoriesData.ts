export interface SubCategory {
  name: string;
  href: string;
  items?: string[];
}

export interface Category {
  name: string;
  href: string;
  subcategories: SubCategory[];
}

export const categoryData: Category[] = [
  {
    name: 'Laptops',
    href: '/collections/laptop',
    subcategories: [
      { name: 'Gaming Laptops', href: '/collections/gaming-laptops' },
      { name: 'Business Laptops', href: '/collections/business-laptops' },
      { name: '2-in-1 Laptops', href: '/collections/2-in-1-laptops' },
      { name: 'Macbooks', href: '/collections/macbooks' },
      { name: 'Pre-owned', href: '/collections/pre-owned-laptops' },
      { name: 'Tablets', href: '/collections/tablets' },
    ]
  },
  {
    name: 'PCs & Desktops',
    href: '/collections/pcs',
    subcategories: [
      { name: 'Gaming PCs', href: '/collections/gaming-pcs' },
      { name: 'Desktop PCs', href: '/collections/desktop-pcs' },
      { name: 'Pre-Owned PCs', href: '/collections/pre-owned-pcs' },
      { name: 'Mini PCs', href: '/collections/mini-pcs' },
      { name: 'All-in-One PCs', href: '/collections/all-in-one-pcs' },
      { name: 'Workstations', href: '/collections/workstations' },
    ]
  },
  {
    name: 'Laptops Repair Item',
    href: '/collections/laptops-repair-item',
    subcategories: [
      { name: 'Laptop Keyboards', href: '/collections/laptop-keyboards' },
      { name: 'Laptop Batteries', href: '/collections/laptop-batteries' },
      { name: 'Laptop Screens', href: '/collections/laptop-screens' },
      { name: 'Laptop Dc Jack', href: '/collections/laptop-dc-jack' },
      { name: 'Laptop Chargers', href: '/collections/laptop-chargers' },
      { name: 'Laptop Fan', href: '/collections/laptop-fan' },
      { name: 'Laptop Repairs', href: '/collections/laptop-repairs' },
    ]
  },
  {
    name: 'Components',
    href: '/collections/components',
    subcategories: [
      { name: 'Processors (CPUs)', href: '/collections/processors-cpus' },
      { name: 'Motherboards', href: '/collections/motherboards' },
      { name: 'Graphics Cards (GPU)', href: '/collections/graphics-cards-gpu' },
      { name: 'RAM (Memory)', href: '/collections/ram-memory' },
      {
        name: 'Storage',
        href: '/collections/storage',
        items: [
          'SSD',
          'HDD & NAS drive',
          'USB & memory cards',
          'External Drives',
          'Surveillance Drive',
        ]
      },
      { name: 'Power Supplies (PSU)', href: '/collections/power-supplies-psu' },
      { name: 'Computer Cases', href: '/collections/computer-cases' },
      {
        name: 'Cooling Systems',
        href: '/collections/cooling-systems',
        items: ['Air Cooling', 'Liquid Cooling']
      },
      {
        name: 'Monitors, Tv & display',
        href: '/collections/monitors-tv-display',
        items: ['Gaming Monitors', 'Office Monitors', "TV's", 'Interactive Display']
      },
      { name: 'LPT & PCI cards', href: '/collections/lpt-pci-cards' },
      { name: 'Upgrade Kits', href: '/collections/upgrade-kits' },
      { name: 'DVD RW', href: '/collections/dvd-rw' },
    ]
  },
  {
    name: 'Accessories',
    href: '/collections/accessories',
    subcategories: [
      { name: 'Keyboards', href: '/collections/keyboards' },
      { name: 'Mice (mouse)', href: '/collections/mice' },
      { name: 'Headsets', href: '/collections/headsets' },
      { name: 'Webcams', href: '/collections/webcams' },
      { name: 'Mouse Pads', href: '/collections/mouse-pads' },
      { name: 'Laptop Bags & Sleeves', href: '/collections/laptop-bags-sleeves' },
      { name: 'Docking Stations', href: '/collections/docking-stations' },
      {
        name: 'Printers',
        href: '/collections/printers',
        items: ['Inkjet & tank Printers', 'Laser Printers', 'Document Scanners', 'POS Printers']
      },
      {
        name: 'Ink & toners',
        href: '/collections/ink-toners',
        items: ['Ink', 'Toners']
      },
      { name: 'Adaptors & chargers', href: '/collections/adaptors-chargers' },
      {
        name: 'Cables & adaptors',
        href: '/collections/cables-adaptors',
        items: [
          'printer & extension cable',
          'Audio Cables',
          'Display Cable',
          'OTG Cables',
          'Display Converters',
          'Molex & internal pc cables',
          'Serial and parrilal cable',
        ]
      },
      {
        name: 'Bluetooth devices',
        href: '/collections/bluetooth-devices',
        items: ['BT Adaptor', 'BT Receiver & transmitters']
      },
      { name: 'Pointer & presentation devices', href: '/collections/pointer-presentation-devices' },
      {
        name: 'splitter & switchs',
        href: '/collections/splitter-switches',
        items: ['Hdmi & Vga switches', 'HDMi & vga splitters']
      },
      { name: 'Earphones & Headphone', href: '/collections/earphones-headphone' },
      {
        name: 'Enclosures',
        href: '/collections/enclosures',
        items: ['2.5 & 3.5 cases', 'NAS Enclosures']
      },
      {
        name: 'Gaming',
        href: '/collections/gaming-accessories',
        items: ['Consoles', 'Gaming Chairs', 'Gaming Accessories']
      },
      {
        name: 'Software',
        href: '/collections/software',
        items: ['OS', 'Antivirus & security software', 'Office Softwares', 'Other Softwares']
      },
      {
        name: 'Inverters & UPS',
        href: '/collections/inverters-ups',
        items: ['Surge Protectors']
      },
      {
        name: 'Power & Protection',
        href: '/collections/power-protection',
        items: ['Power Cables & extension']
      },
      { name: 'Projectors', href: '/collections/projectors' },
      { name: 'laptop Stands', href: '/collections/laptop-stands' },
      { name: 'Power Banks', href: '/collections/power-banks' },
      { name: 'Tablets Cases', href: '/collections/tablets-cases' },
      { name: 'TV & monitor stand', href: '/collections/tv-monitor-stand' },
      { name: 'External DVD-rw', href: '/collections/external-dvd-rw' },
    ]
  },
  {
    name: 'Networking',
    href: '/collections/networking',
    subcategories: [
      { name: 'Routers', href: '/collections/routers' },
      { name: '4G & 5G routers', href: '/collections/4g-5g-routers' },
      { name: 'Modem', href: '/collections/modem' },
      { name: 'Network Switches', href: '/collections/network-switches' },
      { name: 'Wi-Fi Adaptors', href: '/collections/wi-fi-adaptors' },
      { name: 'Range Extenders', href: '/collections/range-extenders' },
      { name: 'Accessories', href: '/collections/networking-accessories' },
      { name: 'Toolkits', href: '/collections/toolkits' },
      { name: 'Cat5 Cables', href: '/collections/cat5-cables' },
      { name: 'Cat6 Cables', href: '/collections/cat6-cables' },
      { name: 'Fiber Cables', href: '/collections/fiber-cables' },
    ]
  },
  {
    name: 'Security & CCTV',
    href: '/collections/security-cctv',
    subcategories: [
      { name: 'Analog DVR & cameras', href: '/collections/analog-dvr-cameras' },
      { name: 'NVR & IP cameras', href: '/collections/nvr-ip-cameras' },
      { name: 'Wifi & mobile solutions', href: '/collections/wifi-mobile-solutions' },
      { name: 'Intercoms', href: '/collections/intercoms' },
      { name: 'Gate motors', href: '/collections/gate-motors' },
      { name: 'Alarms Systems', href: '/collections/alarms-systems' },
      { name: 'Accessories', href: '/collections/security-accessories' },
      { name: 'Spy Cameras', href: '/collections/spy-cameras' },
      { name: 'Dash cameras', href: '/collections/dash-cameras' },
      { name: 'Hdmi & vga extender', href: '/collections/hdmi-vga-extender' },
    ]
  },
  {
    name: 'Smart Devices',
    href: '/collections/smart-devices',
    subcategories: [
      { name: 'Smart Watches', href: '/collections/smart-watches' },
      { name: 'IOT Devices', href: '/collections/iot-devices' },
      { name: 'Smart home', href: '/collections/smart-home' },
    ]
  },
  {
    name: 'Point of Sale',
    href: '/collections/point-of-sale',
    subcategories: [
      { name: 'POS Machine', href: '/collections/pos-machine' },
      { name: 'Barcode Scanners', href: '/collections/barcode-scanners' },
      { name: 'Cash Drawers', href: '/collections/cash-drawers' },
      { name: 'Barcode Printers', href: '/collections/barcode-printers' },
      { name: 'Slip Printers', href: '/collections/slip-printers' },
      { name: 'Access Devices', href: '/collections/access-devices' },
    ]
  }
];
