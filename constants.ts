import { Product, Category, Industry } from './types';

// Images - using Placeholders as per instruction, simulating the style
const IMG_SCREW_DRYWALL = "https://picsum.photos/id/1/800/800";
const IMG_SCREW_SS = "https://picsum.photos/id/250/800/800";
const IMG_SCREW_MACHINE = "https://picsum.photos/id/251/800/800";
const IMG_DOOR_MAGNET = "https://picsum.photos/id/252/800/800";
const IMG_CASTER = "https://picsum.photos/id/253/800/800";

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Fasteners Segment', slug: 'fasteners', image: IMG_SCREW_DRYWALL },
  { id: '2', name: 'Door & Furniture Fittings', slug: 'fittings', image: IMG_DOOR_MAGNET },
];

export const INDUSTRIES: Industry[] = [
  { name: 'Automobiles', iconName: 'Car' },
  { name: 'Construction', iconName: 'HardHat' },
  { name: 'PCB Assembly', iconName: 'CircuitBoard' },
  { name: 'Petro Chemical', iconName: 'FlaskConical' },
  { name: 'Food Processing', iconName: 'Utensils' },
  { name: 'Home Appliances', iconName: 'Tv' },
  { name: 'Heavy Fabricators', iconName: 'Anvil' },
  { name: 'Interior & Exterior', iconName: 'Home' },
  { name: 'Medical & Health Care', iconName: 'Stethoscope' },
  { name: 'Electrical & Electronics', iconName: 'Zap' },
  { name: 'Furniture / Sheet Metals', iconName: 'Armchair' },
  { name: 'Glazing & Facade System', iconName: 'Building' },
  { name: 'Power & Renewable Energy', iconName: 'Wind' },
  { name: 'Gaming Machine', iconName: 'Gamepad2' },
  { name: 'Defense & Government Sector', iconName: 'Shield' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    slug: 'drywall-screws',
    name: 'Drywall Screws',
    category: 'Fasteners Segment',
    material: 'Mild Steel (Grade-1022)',
    shortDescription: 'High-quality drywall gypsum screws with sharp points for easy penetration.',
   longDescription: 'Our Drywall Screws are manufactured from Grade-1022 Mild Steel, ensuring durability and strength. They feature a bugle head (CSK Phillips) designed to sit flush with the drywall surface without tearing the paper. Suitable for fastening drywall to wood or metal studs.',
    sourcePage: 4,
    images: [IMG_SCREW_DRYWALL, "https://picsum.photos/id/200/800/800", "https://picsum.photos/id/201/800/800"],
    specifications: [
      { key: 'Material', value: 'Mild Steel (Grade-1022)' },
      { key: 'Diameter', value: '3.5mm, 4.2mm & 4.8mm' },
      { key: 'Length', value: '13mm to 100mm' },
      { key: 'Head Type', value: 'CSK PHILLIPS (+)' },
    ],
    applications: ['Furniture Hardware', 'Electrical', 'POP Work'],
    variants: [
      { id: 'v1', sku: 'DW-3.5-13-BLK', diameter: '3.5mm', length: '13mm', finish: 'Black', stock: 5000 },
      { id: 'v2', sku: 'DW-3.5-25-BLK', diameter: '3.5mm', length: '25mm', finish: 'Black', stock: 2500 },
      { id: 'v3', sku: 'DW-4.2-50-ZINC', diameter: '4.2mm', length: '50mm', finish: 'Zinc', stock: 1000 },
      { id: 'v4', sku: 'DW-4.8-100-ANT', diameter: '4.8mm', length: '100mm', finish: 'Antique', stock: 500 },
    ]
  },
  {
    id: 'p2',
    slug: 'ss-self-tapping-screws',
    name: 'S.S. Self Tapping Screws',
    category: 'Fasteners Segment',
    material: 'SS316, SS304, 204CU',
    shortDescription: 'Corrosion-resistant stainless steel self-tapping screws for demanding environments.',
    longDescription: 'Engineered from premium stainless steel (304/316), these screws offer superior corrosion resistance. Ideal for outdoor applications, marine environments, and food processing equipment where hygiene and durability are paramount.',
    sourcePage: 6,
    images: [IMG_SCREW_SS, "https://picsum.photos/id/202/800/800"],
    specifications: [
      { key: 'Material', value: 'SS316, SS304, 204CU' },
      { key: 'Diameter', value: '2.2mm to 5.5mm' },
      { key: 'Length', value: '6.5mm to 100mm' },
      { key: 'Head Type', value: 'CSK, PAN' },
    ],
    applications: ['Furniture Hardware', 'Fitting Accessories', 'OEM Company'],
    variants: [
      { id: 'v5', sku: 'SS-2.2-6.5-NI', diameter: '2.2mm', length: '6.5mm', finish: 'Nickel', stock: 3000 },
      { id: 'v6', sku: 'SS-3.5-25-BR', diameter: '3.5mm', length: '25mm', finish: 'Brass (Golden)', stock: 1200 },
    ]
  },
  {
    id: 'p3',
    slug: 'machine-screws',
    name: 'Machine Screws',
    category: 'Fasteners Segment',
    material: 'MS (Grade-1008)',
    shortDescription: 'Standard machine screws for industrial machinery and automotive assembly.',
    longDescription: 'Versatile machine screws available in M3 to M6 sizes. Manufactured from MS Grade-1008 with various head types including Slotted Cheese, Slotted CSK, Pan Combination, and Truss Head.',
    sourcePage: 12,
    images: [IMG_SCREW_MACHINE],
    specifications: [
      { key: 'Material', value: 'MS (Grade-1008)' },
      { key: 'Size', value: 'M3, M4, M5, M6' },
      { key: 'Length', value: '13mm to 75mm' },
      { key: 'Head Type', value: 'CSK, PAN, PCW' },
    ],
    applications: ['Furniture Hardware', 'All Types of Machine', 'All Industries'],
    variants: [
      { id: 'v7', sku: 'MS-M4-25-ZINC', diameter: 'M4', length: '25mm', finish: 'Zinc', stock: 10000 },
    ]
  },
  {
    id: 'p4',
    slug: 'door-magnet',
    name: 'Door Magnet',
    category: 'Door & Furniture Fittings',
    material: 'Plastic (PP-Virgin), ABS',
    shortDescription: 'Heavy-duty magnetic catches for cabinets and doors.',
    longDescription: 'Reliable door magnets designed to keep cabinet doors and drawers securely closed. Made from high-quality Virgin PP and ABS plastic, available in multiple colors to match furniture aesthetics.',
     sourcePage: 17,
    images: [IMG_DOOR_MAGNET],
    specifications: [
      { key: 'Material', value: 'Plastic (PP-Virgin), ABS' },
      { key: 'Size', value: 'M-5 (3 inch)' },
      { key: 'Colors', value: 'White, Brown, Ivory, Golden' },
    ],
    applications: ['Door Fitting', 'Cabinet Fitting'],
    variants: [
      { id: 'v8', sku: 'DM-M5-WHT', diameter: 'N/A', length: '3 inch', finish: 'White', stock: 400 },
      { id: 'v9', sku: 'DM-M5-BRN', diameter: 'N/A', length: '3 inch', finish: 'Brown', stock: 450 },
    ]
  },
  {
    id: 'p5',
    slug: 'caster-wheel',
    name: 'Caster Wheel',
    category: 'Door & Furniture Fittings',
    material: 'PP Virgin + MS Plate',
    shortDescription: 'Smooth-rolling caster wheels for furniture mobility.',
    longDescription: 'Heavy-duty caster wheels with 12 Gauge (2.5mm) plate thickness. Provides smooth mobility for beds, tables, trolleys, and other furniture. Available in Orange, Black, and Blue.',
    sourcePage: 22,
    images: [IMG_CASTER],
    specifications: [
      { key: 'Material', value: 'PP Virgin + MS Plate' },
      { key: 'Size', value: '1 inch, 1.5 inch, 2 inch' },
      { key: 'Plate Thickness', value: '12 Gauge (2.5mm)' },
    ],
    applications: ['Furniture Multipurpose', 'Bed', 'Table', 'Trolley'],
    variants: [
      { id: 'v10', sku: 'CW-2-ORG', diameter: '2 inch', length: 'N/A', finish: 'Orange', stock: 150 },
    ]
  }
];