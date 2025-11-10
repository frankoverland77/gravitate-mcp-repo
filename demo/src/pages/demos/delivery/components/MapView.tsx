import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Button, Select, Card, Switch } from 'antd';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useDelivery } from '../contexts/DeliveryContext';
import { Order, Route, Driver, Vehicle } from '../types/delivery.types';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Define bakery location (Mission District, SF)
const BAKERY_LOCATION: [number, number] = [37.7599, -122.4148];

// Realistic SF delivery locations across different neighborhoods
const SF_DELIVERY_LOCATIONS: { [key: string]: [number, number] } = {
  // Mission District
  'mission-1': [37.7556, -122.4194],
  'mission-2': [37.7599, -122.4148],
  'mission-3': [37.7644, -122.4145],
  'mission-4': [37.7612, -122.4181],
  
  // Castro
  'castro-1': [37.7609, -122.4350],
  'castro-2': [37.7626, -122.4364],
  'castro-3': [37.7594, -122.4336],
  
  // Hayes Valley
  'hayes-1': [37.7749, -122.4244],
  'hayes-2': [37.7767, -122.4259],
  'hayes-3': [37.7731, -122.4228],
  
  // Marina District
  'marina-1': [37.8021, -122.4363],
  'marina-2': [37.8006, -122.4406],
  'marina-3': [37.8043, -122.4324],
  
  // Pacific Heights
  'pac-heights-1': [37.7949, -122.4376],
  'pac-heights-2': [37.7919, -122.4411],
  'pac-heights-3': [37.7963, -122.4345],
  
  // Richmond District
  'richmond-1': [37.7806, -122.4644],
  'richmond-2': [37.7822, -122.4683],
  'richmond-3': [37.7789, -122.4706],
  
  // Sunset District
  'sunset-1': [37.7439, -122.4644],
  'sunset-2': [37.7456, -122.4683],
  'sunset-3': [37.7422, -122.4706],
  
  // SOMA
  'soma-1': [37.7849, -122.4094],
  'soma-2': [37.7794, -122.4078],
  'soma-3': [37.7749, -122.4106],
  
  // Tenderloin
  'tenderloin-1': [37.7844, -122.4156],
  'tenderloin-2': [37.7864, -122.4172],
  'tenderloin-3': [37.7824, -122.4139],
  
  // North Beach
  'north-beach-1': [37.8062, -122.4084],
  'north-beach-2': [37.8078, -122.4106],
  'north-beach-3': [37.8046, -122.4062],
  
  // Russian Hill
  'russian-hill-1': [37.8019, -122.4194],
  'russian-hill-2': [37.8002, -122.4217],
  'russian-hill-3': [37.8035, -122.4172],
  
  // Chinatown
  'chinatown-1': [37.7944, -122.4072],
  'chinatown-2': [37.7956, -122.4089],
  'chinatown-3': [37.7931, -122.4056]
};

// Custom icons for different delivery states
const createCustomIcon = (color: string, emoji: string) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">${emoji}</div>
    `,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const ICONS = {
  bakery: createCustomIcon('#8B4513', '🏪'),
  pending: createCustomIcon('#fa8c16', '📍'),
  inTransit: createCustomIcon('#1890ff', '🚐'),
  delivered: createCustomIcon('#52c41a', '✅'),
  driver: createCustomIcon('#722ed1', '👤'),
  cluster: createCustomIcon('#666', '📦')
};

// Get realistic SF coordinates for orders
const getRealisticCoordinates = (baseId: string): [number, number] => {
  const locationKeys = Object.keys(SF_DELIVERY_LOCATIONS);
  const hash = baseId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const locationIndex = hash % locationKeys.length;
  const selectedKey = locationKeys[locationIndex];
  return SF_DELIVERY_LOCATIONS[selectedKey];
};

interface MapViewProps {
  height?: string;
  showLegend?: boolean;
  showControls?: boolean;
  focusedRouteId?: string;
  showDrivers?: boolean;
  showClusters?: boolean;
}

export function MapView({ 
  height = '400px', 
  showLegend = true, 
  showControls = true,
  focusedRouteId,
  showDrivers = true,
  showClusters = false
}: MapViewProps) {
  const { 
    orders, 
    routes, 
    drivers, 
    vehicles, 
    simulationState 
  } = useDelivery();
  
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const mapRef = useRef<L.Map>(null);

  // Filter data based on view options
  const filteredRoutes = useMemo(() => {
    let filtered = routes;
    if (showOnlyActive) {
      filtered = filtered.filter(route => route.status === 'ACTIVE');
    }
    if (focusedRouteId) {
      filtered = filtered.filter(route => route.id === focusedRouteId);
    }
    return filtered;
  }, [routes, showOnlyActive, focusedRouteId]);

  const filteredOrders = useMemo(() => {
    if (focusedRouteId) {
      const focusedRoute = routes.find(r => r.id === focusedRouteId);
      if (focusedRoute) {
        return orders.filter(order => focusedRoute.orderIds.includes(order.id));
      }
    }
    return orders;
  }, [orders, routes, focusedRouteId]);

  // Generate coordinates for orders and routes
  const orderCoordinates = useMemo(() => {
    const coords: Record<string, [number, number]> = {};
    filteredOrders.forEach(order => {
      coords[order.id] = getRealisticCoordinates(order.id);
    });
    return coords;
  }, [filteredOrders]);

  const driverCoordinates = useMemo(() => {
    const coords: Record<string, [number, number]> = {};
    drivers.forEach(driver => {
      coords[driver.id] = getRealisticCoordinates(`driver-${driver.id}`);
    });
    return coords;
  }, [drivers]);

  // Get route colors
  const getRouteColor = (route: Route) => {
    if (route.status === 'ACTIVE') return '#52c41a';
    if (route.status === 'COMPLETED') return '#1890ff';
    if (route.status === 'DELAYED') return '#fa8c16';
    return '#999';
  };

  // Get order status for icon selection
  const getOrderStatus = (order: Order) => {
    if (order.status === 'DELIVERED') return 'delivered';
    const activeRoute = filteredRoutes.find(r => 
      r.orderIds.includes(order.id) && r.status === 'ACTIVE'
    );
    if (activeRoute) return 'inTransit';
    return 'pending';
  };

  // Major SF street intersections and waypoints for realistic routing
  const SF_MAJOR_STREETS = {
    // Major east-west streets
    'market-st': [37.7749, -122.4194],
    'geary-blvd': [37.7818, -122.4365],
    'california-st': [37.7930, -122.4161],
    'union-st': [37.7989, -122.4161],
    'lombard-st': [37.8022, -122.4161],
    'broadway': [37.7956, -122.4161],
    'fillmore-st': [37.7874, -122.4330],
    'van-ness': [37.7874, -122.4194],
    'mission-st': [37.7599, -122.4194],
    'valencia-st': [37.7599, -122.4214],
    'castro-st': [37.7609, -122.4350],
    'divisadero-st': [37.7749, -122.4386],
    // Major north-south streets
    '19th-ave': [37.7749, -122.4750],
    'park-presidio': [37.7749, -122.4500],
    'masonic-ave': [37.7749, -122.4461],
    'hayes-st': [37.7749, -122.4244],
    'franklin-st': [37.7874, -122.4244],
    'gough-st': [37.7874, -122.4275],
    'octavia-blvd': [37.7749, -122.4244],
    'polk-st': [37.7874, -122.4214],
    'hyde-st': [37.7874, -122.4161],
    'larkin-st': [37.7874, -122.4175],
    'jones-st': [37.7874, -122.4125],
    'taylor-st': [37.7874, -122.4111],
    'mason-st': [37.7874, -122.4097],
    'powell-st': [37.7874, -122.4083],
    'stockton-st': [37.7874, -122.4069],
    'grant-ave': [37.7874, -122.4056],
    'kearny-st': [37.7874, -122.4042],
    'montgomery-st': [37.7874, -122.4028],
    'sansome-st': [37.7874, -122.4014],
    'battery-st': [37.7874, -122.4000],
    'front-st': [37.7874, -122.3986],
    'embarcadero': [37.7874, -122.3958]
  };

  // Create realistic street-following path using major intersections
  const createRealisticStreetPath = (start: [number, number], end: [number, number]): [number, number][] => {
    const waypoints: [number, number][] = [start];
    
    // Find closest major streets to start and end points
    const findClosestStreet = (point: [number, number]) => {
      let closest = 'market-st';
      let minDistance = Number.MAX_VALUE;
      
      Object.entries(SF_MAJOR_STREETS).forEach(([name, coords]) => {
        const distance = Math.sqrt(
          Math.pow(point[0] - coords[0], 2) + Math.pow(point[1] - coords[1], 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          closest = name;
        }
      });
      
      return { name: closest, coords: SF_MAJOR_STREETS[closest], distance: minDistance };
    };
    
    const startStreet = findClosestStreet(start);
    const endStreet = findClosestStreet(end);
    
    // If points are close to each other (same neighborhood), use simple path
    const distance = Math.sqrt(
      Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)
    );
    
    if (distance < 0.01) {
      // Short distance - add just one intermediate point
      const midpoint: [number, number] = [
        start[0] + (end[0] - start[0]) * 0.5,
        start[1] + (end[1] - start[1]) * 0.5
      ];
      waypoints.push(midpoint);
    } else {
      // Longer distance - route through major streets
      
      // Go to nearest major street first (if not already close)
      if (startStreet.distance > 0.003) {
        waypoints.push(startStreet.coords);
      }
      
      // Route through intermediate major streets
      const latDiff = endStreet.coords[0] - startStreet.coords[0];
      const lngDiff = endStreet.coords[1] - startStreet.coords[1];
      
      // Add intermediate waypoints along major streets
      if (Math.abs(latDiff) > 0.02 || Math.abs(lngDiff) > 0.02) {
        // For cross-city routes, add intermediate major intersections
        
        if (Math.abs(lngDiff) > Math.abs(latDiff)) {
          // Primarily east-west movement
          const intermediatePoint: [number, number] = [
            startStreet.coords[0] + latDiff * 0.3,
            startStreet.coords[1] + lngDiff * 0.7
          ];
          waypoints.push(intermediatePoint);
          
          if (Math.abs(latDiff) > 0.01) {
            // Add north-south segment
            const turnPoint: [number, number] = [
              endStreet.coords[0],
              intermediatePoint[1]
            ];
            waypoints.push(turnPoint);
          }
        } else {
          // Primarily north-south movement
          const intermediatePoint: [number, number] = [
            startStreet.coords[0] + latDiff * 0.7,
            startStreet.coords[1] + lngDiff * 0.3
          ];
          waypoints.push(intermediatePoint);
          
          if (Math.abs(lngDiff) > 0.01) {
            // Add east-west segment
            const turnPoint: [number, number] = [
              intermediatePoint[0],
              endStreet.coords[1]
            ];
            waypoints.push(turnPoint);
          }
        }
      }
      
      // Go to destination's nearest major street
      if (endStreet.distance > 0.003 && 
          (endStreet.coords[0] !== waypoints[waypoints.length - 1][0] || 
           endStreet.coords[1] !== waypoints[waypoints.length - 1][1])) {
        waypoints.push(endStreet.coords);
      }
    }
    
    waypoints.push(end);
    return waypoints;
  };

  // Create route paths with street-following navigation
  const routePaths = useMemo(() => {
    return filteredRoutes.map(route => {
      const routeOrders = route.orderIds
        .map(orderId => filteredOrders.find(o => o.id === orderId))
        .filter(Boolean) as Order[];
      
      let coordinates: [number, number][] = [];
      let currentPosition = BAKERY_LOCATION;
      
      // Create path from bakery to first delivery
      if (routeOrders.length > 0) {
        const firstOrder = routeOrders[0];
        if (orderCoordinates[firstOrder.id]) {
          const pathTofirst = createRealisticStreetPath(currentPosition, orderCoordinates[firstOrder.id]);
          coordinates = coordinates.concat(pathTofirst);
          currentPosition = orderCoordinates[firstOrder.id];
        }
      }
      
      // Create paths between deliveries
      for (let i = 1; i < routeOrders.length; i++) {
        const order = routeOrders[i];
        if (orderCoordinates[order.id]) {
          const pathSegment = createRealisticStreetPath(currentPosition, orderCoordinates[order.id]);
          // Skip the first point to avoid duplication
          coordinates = coordinates.concat(pathSegment.slice(1));
          currentPosition = orderCoordinates[order.id];
        }
      }
      
      return {
        route,
        coordinates,
        color: getRouteColor(route)
      };
    });
  }, [filteredRoutes, filteredOrders, orderCoordinates]);

  // Group nearby orders for clustering
  const orderClusters = useMemo(() => {
    if (!showClusters) return [];
    
    const clusters: { center: [number, number]; orders: Order[]; count: number }[] = [];
    const processed = new Set<string>();
    const clusterRadius = 0.01; // degrees
    
    filteredOrders.forEach(order => {
      if (processed.has(order.id)) return;
      
      const orderCoord = orderCoordinates[order.id];
      if (!orderCoord) return;
      
      const nearbyOrders = filteredOrders.filter(other => {
        if (processed.has(other.id) || other.id === order.id) return false;
        const otherCoord = orderCoordinates[other.id];
        if (!otherCoord) return false;
        
        const distance = Math.sqrt(
          Math.pow(orderCoord[0] - otherCoord[0], 2) + 
          Math.pow(orderCoord[1] - otherCoord[1], 2)
        );
        return distance <= clusterRadius;
      });
      
      if (nearbyOrders.length > 0) {
        const clusterOrders = [order, ...nearbyOrders];
        const center: [number, number] = [
          clusterOrders.reduce((sum, o) => sum + orderCoordinates[o.id][0], 0) / clusterOrders.length,
          clusterOrders.reduce((sum, o) => sum + orderCoordinates[o.id][1], 0) / clusterOrders.length
        ];
        
        clusters.push({
          center,
          orders: clusterOrders,
          count: clusterOrders.length
        });
        
        clusterOrders.forEach(o => processed.add(o.id));
      }
    });
    
    return clusters;
  }, [filteredOrders, orderCoordinates, showClusters]);

  // Map tile URLs
  const tileUrls = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  return (
    <div style={{ height, position: 'relative' }}>
      {/* Map Controls */}
      {showControls && (
        <Card 
          size="small" 
          style={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            zIndex: 1000,
            minWidth: '200px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px' }}>Map Style:</span>
              <Select
                value={mapStyle}
                onChange={setMapStyle}
                size="small"
                style={{ width: 100 }}
              >
                <Select.Option value="streets">Streets</Select.Option>
                <Select.Option value="satellite">Satellite</Select.Option>
              </Select>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px' }}>Active Only:</span>
              <Switch 
                size="small" 
                checked={showOnlyActive} 
                onChange={setShowOnlyActive} 
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px' }}>Clustering:</span>
              <Switch 
                size="small" 
                checked={showClusters} 
                onChange={() => {}} 
                disabled
              />
            </div>
          </div>
        </Card>
      )}

      {/* Map Legend */}
      {showLegend && (
        <Card 
          size="small" 
          style={{ 
            position: 'absolute', 
            bottom: 10, 
            left: 10, 
            zIndex: 1000,
            maxWidth: '200px'
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
            Map Legend
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '16px' }}>🏪</div>
              <span>Bakery Location</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '16px' }}>📍</div>
              <span>Pending Delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '16px' }}>🚐</div>
              <span>In Transit</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '16px' }}>✅</div>
              <span>Delivered</span>
            </div>
            {showDrivers && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '16px' }}>👤</div>
                <span>Driver Location</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Leaflet Map */}
      <MapContainer
        center={BAKERY_LOCATION}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url={tileUrls[mapStyle]}
          attribution={
            mapStyle === 'streets' 
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              : '&copy; <a href="https://www.esri.com/">Esri</a>'
          }
        />

        {/* Bakery Marker */}
        <Marker position={BAKERY_LOCATION} icon={ICONS.bakery}>
          <Popup>
            <div style={{ minWidth: '200px' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>🏪 Sweet Dreams Bakery</div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                Main Distribution Center
              </div>
              <div style={{ fontSize: '11px' }}>
                <div>📍 123 Baker Street, San Francisco, CA</div>
                <div>📞 (415) 555-CAKE</div>
                <div>⏰ 6:00 AM - 8:00 PM</div>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Route Lines */}
        {routePaths.map(({ route, coordinates, color }) => (
          <Polyline
            key={route.id}
            positions={coordinates}
            color={color}
            weight={4}
            opacity={0.7}
            dashArray={route.status === 'ACTIVE' ? undefined : '10, 10'}
          />
        ))}

        {/* Order Markers (if not clustering) */}
        {!showClusters && filteredOrders.map(order => {
          const coords = orderCoordinates[order.id];
          if (!coords) return null;
          
          const status = getOrderStatus(order);
          const icon = ICONS[status as keyof typeof ICONS];
          const route = filteredRoutes.find(r => r.orderIds.includes(order.id));
          
          return (
            <Marker key={order.id} position={coords} icon={icon}>
              <Popup>
                <div style={{ minWidth: '250px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600 }}>{order.id}</div>
                    <div style={{ 
                      fontSize: '10px', 
                      padding: '2px 6px', 
                      borderRadius: '3px',
                      backgroundColor: status === 'delivered' ? '#f6ffed' : 
                                     status === 'inTransit' ? '#e6f7ff' : '#fff7e6',
                      color: status === 'delivered' ? '#52c41a' : 
                             status === 'inTransit' ? '#1890ff' : '#fa8c16'
                    }}>
                      {status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                    {order.customerName}
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    📍 {order.deliveryAddress}<br/>
                    📞 {order.phone}<br/>
                    ⏰ {order.timeWindow.start} - {order.timeWindow.end}
                  </div>
                  
                  <div style={{ fontSize: '11px', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 500, marginBottom: '2px' }}>
                      Items ({order.products.length}):
                    </div>
                    {order.products.slice(0, 3).map((product, idx) => (
                      <div key={idx}>• {product.quantity}x {product.name}</div>
                    ))}
                    {order.products.length > 3 && (
                      <div>• ... and {order.products.length - 3} more</div>
                    )}
                  </div>
                  
                  {route && (
                    <div style={{ 
                      fontSize: '11px', 
                      padding: '4px 8px', 
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '4px',
                      marginTop: '8px'
                    }}>
                      🚚 Route: {route.name}<br/>
                      👤 Driver: {drivers.find(d => d.id === route.driverId)?.name || 'Unknown'}
                    </div>
                  )}
                  
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    marginTop: '8px', 
                    textAlign: 'right' 
                  }}>
                    ${order.value.toFixed(2)}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Cluster Markers */}
        {showClusters && orderClusters.map((cluster, idx) => (
          <CircleMarker
            key={idx}
            center={cluster.center}
            radius={Math.min(20, 8 + cluster.count * 2)}
            fillColor="#1890ff"
            color="#fff"
            weight={3}
            fillOpacity={0.7}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                  📦 Order Cluster ({cluster.count} orders)
                </div>
                <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                  Orders in this area:
                </div>
                <div style={{ fontSize: '11px', maxHeight: '150px', overflowY: 'auto' }}>
                  {cluster.orders.map(order => (
                    <div key={order.id} className="mb-1">
                      <strong>{order.id}</strong> - {order.customerName}
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Driver Locations */}
        {showDrivers && filteredRoutes.map(route => {
          const driver = drivers.find(d => d.id === route.driverId);
          const vehicle = vehicles.find(v => v.id === route.vehicleId);
          const coords = driverCoordinates[route.driverId];
          
          if (!driver || !coords || route.status !== 'ACTIVE') return null;
          
          return (
            <Marker key={`driver-${driver.id}`} position={coords} icon={ICONS.driver}>
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                    👤 {driver.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    {vehicle?.name} • {vehicle?.licensePlate}
                  </div>
                  <div style={{ fontSize: '11px' }}>
                    <div>📞 {driver.phone}</div>
                    <div>🚚 Route: {route.name}</div>
                    <div>📦 Orders: {route.orderIds.length}</div>
                    <div>📍 Progress: {route.progress.completed}/{route.progress.total}</div>
                    {simulationState.isRunning && (
                      <div style={{ 
                        marginTop: '4px', 
                        color: '#52c41a', 
                        fontWeight: 600 
                      }}>
                        🟢 LIVE TRACKING
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}