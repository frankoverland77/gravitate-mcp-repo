// Mock data for delivery management system
// Using comprehensive TypeScript interfaces from delivery.types.ts

import {
  DeliveryOrder,
  Driver,
  Vehicle,
  DeliveryRoute,
  RouteStop,
  Shift,
  CommunicationEntry,
  AnalyticsKPI,
  ChartData,
  CostData,
  DriverPerformance,
  DeliveryMetrics,
  OrderProduct,
  GeoLocation,
  TimeWindow
} from '../types/delivery.types';

// Sample data for development
export const mockOrders: DeliveryOrder[] = [
  {
    id: 'ORD-001',
    customerId: 'CUST-001',
    customerName: 'Johnson Wedding',
    deliveryAddress: '123 Oak Street, Downtown',
    phone: '(555) 123-4567',
    products: [
      { name: 'Wedding Cake (3-tier)', quantity: 1, weight: 8.5, unitPrice: 225.00 },
      { name: 'Cupcakes', quantity: 24, weight: 3.0, unitPrice: 2.50 }
    ],
    totalWeight: 11.5,
    value: 285.00,
    timeWindow: { start: '14:00', end: '16:00', flexible: false },
    priority: 'HIGH',
    specialInstructions: 'Handle with extreme care - wedding cake',
    status: 'PENDING',
    createdAt: '2025-01-18T08:30:00Z',
    updatedAt: '2025-01-18T09:15:00Z'
  },
  {
    id: 'ORD-002',
    customerId: 'CUST-002',
    customerName: 'Metro Office Building',
    deliveryAddress: '456 Business Blvd, Midtown',
    phone: '(555) 234-5678',
    products: [
      { name: 'Assorted Pastries', quantity: 50, weight: 6.0, unitPrice: 2.00 },
      { name: 'Coffee Cake', quantity: 2, weight: 4.0, unitPrice: 12.50 }
    ],
    totalWeight: 10.0,
    value: 125.00,
    timeWindow: { start: '08:00', end: '10:00', flexible: true },
    priority: 'MEDIUM',
    specialInstructions: 'Deliver to front desk',
    status: 'PENDING',
    createdAt: '2025-01-18T07:15:00Z'
  },
  {
    id: 'ORD-003',
    customerId: 'CUST-003',
    customerName: 'Sarah Chen',
    deliveryAddress: '789 Pine Street, Suburbs',
    phone: '(555) 345-6789',
    products: [
      { name: 'Birthday Cake', quantity: 1, weight: 5.0, unitPrice: 65.00 },
      { name: 'Balloons Decoration', quantity: 1, weight: 0.5, unitPrice: 10.00 }
    ],
    totalWeight: 5.5,
    value: 75.00,
    timeWindow: { start: '15:00', end: '18:00', flexible: true },
    priority: 'LOW',
    specialInstructions: 'Call before delivery',
    status: 'PENDING',
    createdAt: '2025-01-18T09:00:00Z'
  },
  {
    id: 'ORD-004',
    customerId: 'CUST-004',
    customerName: 'Green Valley Elementary',
    deliveryAddress: '321 School Ave, North Side',
    phone: '(555) 456-7890',
    products: [
      { name: 'Mini Muffins', quantity: 100, weight: 8.0, unitPrice: 0.75 },
      { name: 'Juice Boxes', quantity: 50, weight: 12.0, unitPrice: 0.40 }
    ],
    totalWeight: 20.0,
    value: 95.00,
    timeWindow: { start: '11:00', end: '12:00', flexible: false },
    priority: 'URGENT',
    specialInstructions: 'School lunch delivery - time critical',
    status: 'PENDING',
    createdAt: '2025-01-18T06:45:00Z'
  },
  {
    id: 'ORD-005',
    customerId: 'CUST-005',
    customerName: 'Downtown Café',
    deliveryAddress: '654 Main Street, Downtown',
    phone: '(555) 567-8901',
    products: [
      { name: 'Fresh Bread Loaves', quantity: 12, weight: 9.0, unitPrice: 3.50 },
      { name: 'Croissants', quantity: 24, weight: 3.0, unitPrice: 1.25 }
    ],
    totalWeight: 12.0,
    value: 58.00,
    timeWindow: { start: '06:00', end: '08:00', flexible: false },
    priority: 'HIGH',
    specialInstructions: 'Back entrance delivery',
    status: 'PENDING',
    createdAt: '2025-01-18T05:30:00Z'
  },
  {
    id: 'ORD-006',
    customerId: 'CUST-006',
    customerName: 'Park Plaza Hotel',
    deliveryAddress: '888 Grand Avenue, Uptown',
    phone: '(555) 678-9012',
    products: [
      { name: 'Continental Breakfast Platter', quantity: 3, weight: 15.0, unitPrice: 45.00 },
      { name: 'Danish Pastries', quantity: 36, weight: 4.5, unitPrice: 1.25 }
    ],
    totalWeight: 19.5,
    value: 180.00,
    timeWindow: { start: '07:00', end: '09:00', flexible: true },
    priority: 'HIGH',
    specialInstructions: 'Catering department - 3rd floor',
    status: 'PENDING',
    createdAt: '2025-01-18T06:00:00Z'
  },
  {
    id: 'ORD-007',
    customerId: 'CUST-007',
    customerName: 'Lisa Rodriguez',
    deliveryAddress: '159 Maple Drive, West Hills',
    phone: '(555) 789-0123',
    products: [
      { name: 'Gluten-free Cookies', quantity: 24, weight: 2.0, unitPrice: 1.50 },
      { name: 'Sourdough Bread', quantity: 2, weight: 3.0, unitPrice: 7.50 }
    ],
    totalWeight: 5.0,
    value: 45.00,
    timeWindow: { start: '13:00', end: '16:00', flexible: true },
    priority: 'LOW',
    specialInstructions: 'Leave with neighbor if not home',
    status: 'PENDING',
    createdAt: '2025-01-18T10:30:00Z'
  },
  {
    id: 'ORD-008',
    customerId: 'CUST-008',
    customerName: 'Tech Startup Inc',
    deliveryAddress: '741 Innovation Way, Tech District',
    phone: '(555) 890-1234',
    products: [
      { name: 'Donut Box Assortment', quantity: 5, weight: 7.5, unitPrice: 18.00 },
      { name: 'Coffee Service Setup', quantity: 1, weight: 2.0, unitPrice: 20.00 }
    ],
    totalWeight: 9.5,
    value: 110.00,
    timeWindow: { start: '09:00', end: '11:00', flexible: true },
    priority: 'MEDIUM',
    specialInstructions: 'Reception desk delivery',
    status: 'PENDING',
    createdAt: '2025-01-18T07:45:00Z'
  },
  {
    id: 'ORD-009',
    customerId: 'CUST-009',
    customerName: 'Golden Years Retirement Home',
    deliveryAddress: '963 Sunset Blvd, East Side',
    phone: '(555) 901-2345',
    products: [
      { name: 'Sugar-free Treats', quantity: 40, weight: 6.0, unitPrice: 1.75 },
      { name: 'Tea Cakes', quantity: 20, weight: 3.0, unitPrice: 1.25 }
    ],
    totalWeight: 9.0,
    value: 85.00,
    timeWindow: { start: '14:00', end: '16:00', flexible: true },
    priority: 'MEDIUM',
    specialInstructions: 'Activity room - ask for Maria',
    status: 'PENDING',
    createdAt: '2025-01-18T09:15:00Z'
  },
  {
    id: 'ORD-010',
    customerId: 'CUST-010',
    customerName: 'Mike\'s Auto Shop',
    deliveryAddress: '852 Industrial Road, South Bay',
    phone: '(555) 012-3456',
    products: [
      { name: 'Lunch Sandwiches', quantity: 8, weight: 4.0, unitPrice: 6.50 },
      { name: 'Energy Bars', quantity: 12, weight: 1.5, unitPrice: 1.25 }
    ],
    totalWeight: 5.5,
    value: 65.00,
    timeWindow: { start: '12:00', end: '13:30', flexible: false },
    priority: 'LOW',
    specialInstructions: 'Break room - back of shop',
    status: 'PENDING',
    createdAt: '2025-01-18T08:00:00Z'
  },
  {
    id: 'ORD-011',
    customerId: 'CUST-011',
    customerName: 'City Art Gallery',
    deliveryAddress: '247 Culture Street, Arts District',
    phone: '(555) 123-0987',
    products: [
      { name: 'Gourmet Canapés', quantity: 60, weight: 8.0, unitPrice: 2.75 },
      { name: 'Champagne Cupcakes', quantity: 24, weight: 4.0, unitPrice: 3.50 }
    ],
    totalWeight: 12.0,
    value: 195.00,
    timeWindow: { start: '17:00', end: '19:00', flexible: false },
    priority: 'HIGH',
    specialInstructions: 'Art opening event - use service entrance',
    status: 'PENDING',
    createdAt: '2025-01-18T11:00:00Z'
  },
  {
    id: 'ORD-012',
    customerId: 'CUST-012',
    customerName: 'Family Medicine Clinic',
    deliveryAddress: '135 Health Plaza, Medical Center',
    phone: '(555) 234-1098',
    products: [
      { name: 'Healthy Snack Boxes', quantity: 15, weight: 7.5, unitPrice: 4.50 },
      { name: 'Herbal Tea Collection', quantity: 3, weight: 1.5, unitPrice: 9.50 }
    ],
    totalWeight: 9.0,
    value: 78.00,
    timeWindow: { start: '10:00', end: '12:00', flexible: true },
    priority: 'MEDIUM',
    specialInstructions: 'Nurse station - 2nd floor',
    status: 'PENDING',
    createdAt: '2025-01-18T08:45:00Z'
  }
];

export const mockDrivers: Driver[] = [
  {
    id: 'DRV-001',
    name: 'Mike Thompson',
    phone: '(555) 234-5678',
    email: 'mike.t@bakery.com',
    vehicleId: 'VEH-001',
    status: 'ON_ROUTE',
    currentLocation: { lat: 40.7128, lng: -74.0060, accuracy: 10, timestamp: '2025-01-18T10:30:00Z' },
    rating: 4.8,
    totalDeliveries: 156,
    onTimeRate: 96.8,
    efficiency: 91,
    shiftId: 'SHIFT-MORNING',
    hireDate: '2023-03-15',
    licenseNumber: 'DL-789456123',
    emergencyContact: {
      name: 'Jennifer Thompson',
      phone: '(555) 987-6543',
      email: 'jen.thompson@email.com',
      relationship: 'Spouse'
    }
  },
  {
    id: 'DRV-002',
    name: 'Sarah Chen',
    phone: '(555) 345-6789',
    email: 'sarah.c@bakery.com',
    vehicleId: 'VEH-002',
    status: 'AVAILABLE',
    currentLocation: { lat: 40.7589, lng: -73.9851, accuracy: 8, timestamp: '2025-01-18T10:30:00Z' },
    rating: 4.9,
    totalDeliveries: 203,
    onTimeRate: 98.5,
    efficiency: 96,
    shiftId: 'SHIFT-MORNING',
    hireDate: '2022-08-22',
    licenseNumber: 'DL-456789012',
    emergencyContact: {
      name: 'David Chen',
      phone: '(555) 876-5432',
      email: 'david.chen@email.com',
      relationship: 'Brother'
    }
  },
  {
    id: 'DRV-003',
    name: 'Carlos Rodriguez',
    phone: '(555) 456-7890',
    email: 'carlos.r@bakery.com',
    vehicleId: 'VEH-003',
    status: 'ON_ROUTE',
    currentLocation: { lat: 40.6892, lng: -74.0445, accuracy: 12, timestamp: '2025-01-18T10:30:00Z' },
    rating: 4.6,
    totalDeliveries: 89,
    onTimeRate: 94.2
  },
  {
    id: 'DRV-004',
    name: 'Emily Johnson',
    phone: '(555) 567-8901',
    email: 'emily.j@bakery.com',
    vehicleId: 'VEH-004',
    status: 'BREAK',
    currentLocation: { lat: 40.7505, lng: -73.9934, accuracy: 9, timestamp: '2025-01-18T10:30:00Z' },
    rating: 4.7,
    totalDeliveries: 134,
    onTimeRate: 95.8
  },
  {
    id: 'DRV-005',
    name: 'David Kim',
    phone: '(555) 678-9012',
    email: 'david.k@bakery.com',
    vehicleId: 'VEH-005',
    status: 'AVAILABLE',
    currentLocation: { lat: 40.7282, lng: -73.7949, accuracy: 7, timestamp: '2025-01-18T10:30:00Z' },
    rating: 4.8,
    totalDeliveries: 178,
    onTimeRate: 97.1
  },
  {
    id: 'DRV-006',
    name: 'Lisa Martinez',
    phone: '(555) 789-0123',
    email: 'lisa.m@bakery.com',
    vehicleId: 'VEH-006',
    status: 'ON_ROUTE',
    currentLocation: { lat: 40.6782, lng: -73.9442, accuracy: 11, timestamp: '2025-01-18T10:30:00Z' },
    rating: 4.5,
    totalDeliveries: 67,
    onTimeRate: 92.5
  },
  {
    id: 'DRV-007',
    name: 'James Wilson',
    phone: '(555) 890-1234',
    email: 'james.w@bakery.com',
    vehicleId: 'VEH-007',
    status: 'OFFLINE',
    rating: 4.9,
    totalDeliveries: 245,
    onTimeRate: 99.2
  },
  {
    id: 'DRV-008',
    name: 'Anna Kowalski',
    phone: '(555) 901-2345',
    email: 'anna.k@bakery.com',
    vehicleId: 'VEH-008',
    status: 'AVAILABLE',
    currentLocation: { lat: 40.7831, lng: -73.9712, accuracy: 6, timestamp: '2025-01-18T10:30:00Z' },
    rating: 4.6,
    totalDeliveries: 112,
    onTimeRate: 93.8
  },
  {
    id: 'DRV-009',
    name: 'Robert Garcia',
    phone: '(555) 012-3456',
    email: 'robert.g@bakery.com',
    vehicleId: 'VEH-003',
    status: 'BREAK',
    rating: 4.7,
    totalDeliveries: 145,
    onTimeRate: 96.3
  },
  {
    id: 'DRV-010',
    name: 'Maria Santos',
    phone: '(555) 123-4567',
    email: 'maria.s@bakery.com',
    vehicleId: 'VEH-002',
    status: 'OFFLINE',
    rating: 4.8,
    totalDeliveries: 198,
    onTimeRate: 97.9
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'VEH-001',
    name: 'Delivery Van #1',
    type: 'VAN',
    capacity: 150,
    currentLoad: 89,
    fuelLevel: 78,
    hasRefrigeration: true,
    status: 'IN_USE',
    lastServiceDate: '2025-01-10',
    nextServiceDue: '2025-04-10',
    licensePlate: 'BKY-001',
    model: 'Ford Transit',
    year: 2022,
    mileage: 45632
  },
  {
    id: 'VEH-002',
    name: 'Compact Van #2',
    type: 'VAN',
    capacity: 120,
    currentLoad: 0,
    fuelLevel: 92,
    hasRefrigeration: true,
    status: 'AVAILABLE',
    lastServiceDate: '2025-01-12',
    nextServiceDue: '2025-04-12',
    licensePlate: 'BKY-002',
    model: 'Mercedes Sprinter',
    year: 2023,
    mileage: 23418
  },
  {
    id: 'VEH-003',
    name: 'Delivery Truck #1',
    type: 'TRUCK',
    capacity: 300,
    currentLoad: 45,
    fuelLevel: 65,
    hasRefrigeration: false,
    status: 'IN_USE',
    lastServiceDate: '2025-01-08'
  },
  {
    id: 'VEH-004',
    name: 'Express Car #1',
    type: 'CAR',
    capacity: 50,
    currentLoad: 12,
    fuelLevel: 88,
    hasRefrigeration: false,
    status: 'IN_USE',
    lastServiceDate: '2025-01-15'
  },
  {
    id: 'VEH-005',
    name: 'Refrigerated Van #3',
    type: 'VAN',
    capacity: 140,
    currentLoad: 0,
    fuelLevel: 95,
    hasRefrigeration: true,
    status: 'AVAILABLE',
    lastServiceDate: '2025-01-14'
  },
  {
    id: 'VEH-006',
    name: 'Express Car #2',
    type: 'CAR',
    capacity: 45,
    currentLoad: 23,
    fuelLevel: 72,
    hasRefrigeration: false,
    status: 'IN_USE',
    lastServiceDate: '2025-01-11'
  },
  {
    id: 'VEH-007',
    name: 'Heavy Duty Truck #1',
    type: 'TRUCK',
    capacity: 500,
    currentLoad: 0,
    fuelLevel: 45,
    hasRefrigeration: true,
    status: 'MAINTENANCE',
    lastServiceDate: '2025-01-09'
  },
  {
    id: 'VEH-008',
    name: 'Delivery Van #4',
    type: 'VAN',
    capacity: 160,
    currentLoad: 0,
    fuelLevel: 85,
    hasRefrigeration: false,
    status: 'AVAILABLE',
    lastServiceDate: '2025-01-13'
  }
];

// Enhanced sample data for development

export const mockShifts: Shift[] = [
  {
    id: 'SHIFT-MORNING',
    name: 'Morning Shift',
    startTime: '06:00',
    endTime: '14:00',
    driverIds: ['DRV-001', 'DRV-002', 'DRV-003', 'DRV-008']
  },
  {
    id: 'SHIFT-AFTERNOON',
    name: 'Afternoon Shift', 
    startTime: '14:00',
    endTime: '22:00',
    driverIds: ['DRV-004', 'DRV-005', 'DRV-006', 'DRV-009']
  },
  {
    id: 'SHIFT-NIGHT',
    name: 'Night Shift',
    startTime: '22:00', 
    endTime: '06:00',
    driverIds: ['DRV-007', 'DRV-010']
  }
];

// Communication log data using comprehensive types

export const mockCommunications: CommunicationEntry[] = [
  {
    id: 'COMM-001',
    orderId: 'ORD-001',
    type: 'SMS',
    direction: 'OUTBOUND',
    timestamp: '2025-01-18T09:15:00Z',
    message: 'Your wedding cake delivery is on route! Estimated arrival: 3:30 PM. Driver: Mike Thompson',
    status: 'DELIVERED',
    sender: 'Bakery System',
    recipient: '(555) 123-4567'
  },
  {
    id: 'COMM-002',
    orderId: 'ORD-001',
    type: 'SMS',
    direction: 'INBOUND',
    timestamp: '2025-01-18T09:18:00Z',
    message: 'Great! We\'ll be ready. Please use the side entrance as requested.',
    status: 'READ',
    sender: '(555) 123-4567',
    recipient: 'Bakery System'
  },
  {
    id: 'COMM-003',
    orderId: 'ORD-001',
    type: 'DRIVER_UPDATE',
    direction: 'INTERNAL',
    timestamp: '2025-01-18T09:25:00Z',
    message: 'Traffic delay on Main St. ETA updated to 3:45 PM',
    status: 'DELIVERED',
    sender: 'Mike Thompson',
    recipient: 'Dispatch'
  },
  {
    id: 'COMM-004',
    orderId: 'ORD-004',
    type: 'SMS',
    direction: 'OUTBOUND',
    timestamp: '2025-01-18T08:45:00Z',
    message: 'School lunch delivery arriving in 30 minutes. Driver will use main entrance.',
    status: 'DELIVERED',
    sender: 'Bakery System',
    recipient: '(555) 456-7890'
  },
  {
    id: 'COMM-005',
    orderId: 'ORD-008',
    type: 'CALL',
    direction: 'OUTBOUND',
    timestamp: '2025-01-18T09:30:00Z',
    message: 'Called customer - no answer. Left voicemail about 10 AM delivery window.',
    status: 'DELIVERED',
    sender: 'Sarah Chen',
    recipient: '(555) 890-1234'
  },
  {
    id: 'COMM-006',
    orderId: 'ORD-005',
    type: 'SYSTEM',
    direction: 'INTERNAL',
    timestamp: '2025-01-18T06:15:00Z',
    message: 'Delivery completed successfully. Customer signature received.',
    status: 'DELIVERED',
    sender: 'System',
    recipient: 'Operations'
  },
  {
    id: 'COMM-007',
    orderId: 'ORD-002',
    type: 'EMAIL',
    direction: 'OUTBOUND',
    timestamp: '2025-01-18T07:00:00Z',
    message: 'Invoice and delivery confirmation attached. Thank you for your business!',
    status: 'READ',
    sender: 'accounts@bakery.com',
    recipient: 'office@metrobuilding.com'
  },
  {
    id: 'COMM-008',
    orderId: 'ORD-012',
    type: 'SMS',
    direction: 'OUTBOUND',
    timestamp: '2025-01-18T10:00:00Z',
    message: 'Your healthy snack delivery is scheduled for 11:30 AM today. Please ensure someone is available at the nurse station.',
    status: 'SENT',
    sender: 'Bakery System',
    recipient: '(555) 234-1098'
  }
];

export const mockRoutes: DeliveryRoute[] = [
  {
    id: 'RTE-001',
    name: 'Downtown Morning Run',
    status: 'ACTIVE',
    driverId: 'DRV-001',
    vehicleId: 'VEH-001',
    orderIds: ['ORD-001', 'ORD-005', 'ORD-002'],
    scheduledStartTime: '2025-01-18T06:00:00Z',
    estimatedDuration: 180,
    actualStartTime: '2025-01-18T06:05:00Z',
    totalDistance: 12.5,
    progress: {
      completed: 2,
      total: 3
    },
    createdAt: '2025-01-17T20:30:00Z',
    priority: 'HIGH'
  },
  {
    id: 'RTE-002',
    name: 'School & Office Circuit',
    status: 'ACTIVE',
    driverId: 'DRV-003',
    vehicleId: 'VEH-003',
    orderIds: ['ORD-004', 'ORD-008', 'ORD-012'],
    scheduledStartTime: '2025-01-18T08:30:00Z',
    estimatedDuration: 210,
    actualStartTime: '2025-01-18T08:32:00Z',
    totalDistance: 18.2,
    progress: {
      completed: 1,
      total: 3
    },
    createdAt: '2025-01-17T19:45:00Z',
    priority: 'HIGH'
  },
  {
    id: 'RTE-003',
    name: 'Afternoon Special Events',
    status: 'SCHEDULED',
    driverId: 'DRV-005',
    vehicleId: 'VEH-005',
    orderIds: ['ORD-003', 'ORD-009', 'ORD-011'],
    scheduledStartTime: '2025-01-18T13:00:00Z',
    estimatedDuration: 240,
    totalDistance: 22.8,
    progress: {
      completed: 0,
      total: 3
    },
    createdAt: '2025-01-18T09:15:00Z',
    priority: 'MEDIUM'
  },
  {
    id: 'RTE-004',
    name: 'Lunch Rush Express',
    status: 'SCHEDULED',
    driverId: 'DRV-004',
    vehicleId: 'VEH-004',
    orderIds: ['ORD-010'],
    scheduledStartTime: '2025-01-18T11:30:00Z',
    estimatedDuration: 90,
    totalDistance: 8.1,
    progress: {
      completed: 0,
      total: 1
    },
    createdAt: '2025-01-18T10:00:00Z',
    priority: 'LOW'
  },
  {
    id: 'RTE-005',
    name: 'West Side Residential',
    status: 'COMPLETED',
    driverId: 'DRV-002',
    vehicleId: 'VEH-002',
    orderIds: ['ORD-007'],
    scheduledStartTime: '2025-01-17T14:00:00Z',
    estimatedDuration: 120,
    actualStartTime: '2025-01-17T14:02:00Z',
    actualEndTime: '2025-01-17T15:58:00Z',
    totalDistance: 15.4,
    progress: {
      completed: 1,
      total: 1
    },
    createdAt: '2025-01-17T11:30:00Z',
    priority: 'LOW'
  },
  {
    id: 'RTE-006',
    name: 'Hotel & Event Catering',
    status: 'COMPLETED',
    driverId: 'DRV-006',
    vehicleId: 'VEH-006',
    orderIds: ['ORD-006'],
    scheduledStartTime: '2025-01-17T06:30:00Z',
    estimatedDuration: 150,
    actualStartTime: '2025-01-17T06:28:00Z',
    actualEndTime: '2025-01-17T08:45:00Z',
    totalDistance: 11.2,
    progress: {
      completed: 1,
      total: 1
    },
    createdAt: '2025-01-16T18:00:00Z',
    priority: 'HIGH'
  },
  {
    id: 'RTE-007',
    name: 'North Side Coverage',
    status: 'DRAFT',
    orderIds: [],
    scheduledStartTime: '2025-01-18T15:00:00Z',
    estimatedDuration: 180,
    totalDistance: 0,
    progress: {
      completed: 0,
      total: 0
    },
    createdAt: '2025-01-18T11:30:00Z',
    priority: 'MEDIUM'
  },
  {
    id: 'RTE-008',
    name: 'Emergency Delivery Route',
    status: 'CANCELLED',
    driverId: 'DRV-007',
    vehicleId: 'VEH-007',
    orderIds: ['ORD-011'],
    scheduledStartTime: '2025-01-17T16:00:00Z',
    estimatedDuration: 60,
    totalDistance: 5.3,
    progress: {
      completed: 0,
      total: 1
    },
    createdAt: '2025-01-17T15:45:00Z',
    priority: 'HIGH'
  }
];

// KPI data for dashboard
export const mockKPIs = {
  todayOrders: 47,
  completedOrders: 23,
  inTransitOrders: 18,
  pendingOrders: 6,
  availableDrivers: 4,
  onRouteDrivers: 6,
  driversOnBreak: 1,
  offlineDrivers: 2,
  onTimeRate: 94.2,
  costPerDelivery: 4.23,
  customerRating: 4.7
};

// Analytics data using comprehensive types

export const mockAnalyticsKPIs: AnalyticsKPI[] = [
  {
    title: 'Total Deliveries',
    value: 1247,
    change: 12.5,
    changeType: 'increase',
    icon: '📦',
    color: '#1890ff'
  },
  {
    title: 'On-Time Rate',
    value: '94.2%',
    change: 2.3,
    changeType: 'increase',
    icon: '⏰',
    color: '#52c41a'
  },
  {
    title: 'Revenue',
    value: '$18,642',
    change: 8.7,
    changeType: 'increase',
    icon: '💰',
    color: '#fa8c16'
  },
  {
    title: 'Avg Delivery Time',
    value: '28 min',
    change: 5.2,
    changeType: 'decrease',
    icon: '🚚',
    color: '#722ed1'
  },
  {
    title: 'Customer Rating',
    value: '4.8/5',
    change: 0.3,
    changeType: 'increase',
    icon: '⭐',
    color: '#eb2f96'
  },
  {
    title: 'Cost per Delivery',
    value: '$4.23',
    change: 1.8,
    changeType: 'decrease',
    icon: '💵',
    color: '#13c2c2'
  }
];

// Weekly delivery trends using comprehensive types

export const mockWeeklyDeliveries: ChartData[] = [
  { label: 'Mon', value: 85, target: 80 },
  { label: 'Tue', value: 92, target: 85 },
  { label: 'Wed', value: 78, target: 85 },
  { label: 'Thu', value: 95, target: 90 },
  { label: 'Fri', value: 103, target: 95 },
  { label: 'Sat', value: 88, target: 85 },
  { label: 'Sun', value: 72, target: 70 }
];

export const mockHourlyDeliveries: ChartData[] = [
  { label: '6AM', value: 5 },
  { label: '7AM', value: 12 },
  { label: '8AM', value: 18 },
  { label: '9AM', value: 25 },
  { label: '10AM', value: 22 },
  { label: '11AM', value: 28 },
  { label: '12PM', value: 35 },
  { label: '1PM', value: 32 },
  { label: '2PM', value: 29 },
  { label: '3PM', value: 31 },
  { label: '4PM', value: 27 },
  { label: '5PM', value: 24 },
  { label: '6PM', value: 18 },
  { label: '7PM', value: 12 },
  { label: '8PM', value: 8 }
];

// Cost breakdown using comprehensive types

export const mockCostBreakdown: CostData[] = [
  { category: 'Fuel & Vehicle', amount: 2840, percentage: 42, color: '#1890ff' },
  { category: 'Driver Wages', amount: 2160, percentage: 32, color: '#52c41a' },
  { category: 'Insurance', amount: 810, percentage: 12, color: '#fa8c16' },
  { category: 'Maintenance', amount: 540, percentage: 8, color: '#722ed1' },
  { category: 'Other', amount: 405, percentage: 6, color: '#eb2f96' }
];

// Driver performance data using comprehensive types

// Complete delivery metrics for system overview
export const mockDeliveryMetrics: DeliveryMetrics = {
  period: 'MONTHLY',
  totalOrders: 1247,
  completedOrders: 1174,
  cancelledOrders: 31,
  onTimeDeliveries: 1107,
  onTimeRate: 94.2,
  averageDeliveryTime: 28,
  totalRevenue: 186420,
  averageOrderValue: 149.54,
  customerSatisfactionRating: 4.8,
  fuelCost: 2840,
  maintenanceCost: 540,
  laborCost: 8640,
  costPerDelivery: 4.23,
  driversActive: 8,
  vehiclesInUse: 6,
  routesCompleted: 156,
  milesDelivered: 3247,
  fuelEfficiency: 12.4
};

export const mockDriverPerformance: DriverPerformance[] = [
  {
    rank: 1,
    driverId: 'DRV-007',
    name: 'James Wilson',
    deliveries: 245,
    onTimeRate: 99.2,
    rating: 4.9,
    revenue: 3280,
    efficiency: 98,
    totalHours: 168,
    averageDeliveryTime: 24
  },
  {
    rank: 2,
    driverId: 'DRV-002',
    name: 'Sarah Chen',
    deliveries: 203,
    onTimeRate: 98.5,
    rating: 4.9,
    revenue: 2845,
    efficiency: 96,
    totalHours: 164,
    averageDeliveryTime: 26
  },
  {
    rank: 3,
    driverId: 'DRV-010',
    name: 'Maria Santos',
    deliveries: 198,
    onTimeRate: 97.9,
    rating: 4.8,
    revenue: 2720,
    efficiency: 94,
    totalHours: 160,
    averageDeliveryTime: 27
  },
  {
    rank: 4,
    driverId: 'DRV-005',
    name: 'David Kim',
    deliveries: 178,
    onTimeRate: 97.1,
    rating: 4.8,
    revenue: 2456,
    efficiency: 93
  },
  {
    rank: 5,
    driverId: 'DRV-001',
    name: 'Mike Thompson',
    deliveries: 156,
    onTimeRate: 96.8,
    rating: 4.8,
    revenue: 2189,
    efficiency: 91
  },
  {
    rank: 6,
    driverId: 'DRV-009',
    name: 'Robert Garcia',
    deliveries: 145,
    onTimeRate: 96.3,
    rating: 4.7,
    revenue: 2034,
    efficiency: 89
  },
  {
    rank: 7,
    driverId: 'DRV-004',
    name: 'Emily Johnson',
    deliveries: 134,
    onTimeRate: 95.8,
    rating: 4.7,
    revenue: 1876,
    efficiency: 87
  },
  {
    rank: 8,
    driverId: 'DRV-008',
    name: 'Anna Kowalski',
    deliveries: 112,
    onTimeRate: 93.8,
    rating: 4.6,
    revenue: 1598,
    efficiency: 84
  },
  {
    rank: 9,
    driverId: 'DRV-003',
    name: 'Carlos Rodriguez',
    deliveries: 89,
    onTimeRate: 94.2,
    rating: 4.6,
    revenue: 1247,
    efficiency: 82
  },
  {
    rank: 10,
    driverId: 'DRV-006',
    name: 'Lisa Martinez',
    deliveries: 67,
    onTimeRate: 92.5,
    rating: 4.5,
    revenue: 934,
    efficiency: 78
  }
];