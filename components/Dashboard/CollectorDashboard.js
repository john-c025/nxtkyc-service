'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Table,
  Button,
  Badge,
  Container,
} from 'react-bootstrap';
import NavPane from '../Objects/NavPane';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useTheme } from '../../context/ThemeContext';
import NotificationButton from '../Objects/NotificationButton';
import {
  DashboardContainer,
  Sidebar,
  MainContent,
  TopBar,
  Card,
  CardGrid,
  ThemeToggle,
  MapContainer,
  MobileMenuButton,
  MapStyleSelect,
  Overlay,
  StyledTable,
  AreaInfoBox,
  AreaLabel,
  AreaValue,
  AreaGrid,
  LocationDetailsContainer,
  LocationGrid,
  LocationInfoBox,
  LocationLabel,
  LocationValue,
  LocationHeader,
  MetricBox,
  MetricLabel,
  MetricValue,
  MetricChange,
  LoadingSpinner,
  SpinnerOverlay,
  Spinner
} from './CollectorDashboardStyled';  // Make sure this path is correct
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Circle, Fill, Stroke, Icon } from 'ol/style';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../backend/axiosInstance';
import { API_ENDPOINTS } from '../backend/apiHelper';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CollectorDashboard = () => {
  const [collections, setCollections] = useState([
    {
      id: 1,
      customerName: 'John Doe',
      amount: 1000,
      maturity:'2 Months',
      status: 'pending',
      isPaid: false,
      address: '123 Main St'

    },
    {
      id: 2,
      customerName: 'Jane Smith',
      amount: 2500,
      maturity:'2 Months',
      status: 'completed',
      isPaid: true,
      address: '456 Oak Ave'
    },
  ]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [activeNav, setActiveNav] = useState('collector');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { location, error } = useGeolocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const mapRef = useRef();
  const mapInstance = useRef(null);
  const [mapStyle, setMapStyle] = useState('osm');
  const [locationDetails, setLocationDetails] = useState(null);
  const [userId, setUserId] = useState("0000000001");
  const [assignedArea] = useState({
    mainArea: 'Pasig City',
    subArea: 'Ortigas Center',
    collectionTarget: '₱150,000',
    activeCollectors: 5
  });
  const [isTokenProcessed, setIsTokenProcessed] = useState(false);

  const [isMetricsExpanded, setIsMetricsExpanded] = useState(false);
  const [performanceData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    collections: [65, 59, 80, 81, 56, 55, 40],
    efficiency: [70, 62, 75, 85, 60, 58, 45]
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { title: 'Total Collections Today', value: '₱45,000', change: '+8.2%' },
    { title: 'Success Rate', value: '78%', change: '+5.1%' },
    { title: 'Pending Collections', value: '12', change: '-2' },
    { title: 'Daily Target', value: '₱100,000', change: '45% achieved' }
  ];

  const mapStyles = {
    osm: {
      name: 'Default',
      source: new OSM()
    },
    satellite: {
      name: 'Satellite',
      source: new XYZ({
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        maxZoom: 20,
        attributions: '© Google'
      })
    },
    terrain: {
      name: 'Terrain',
      source: new XYZ({
        url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
        maxZoom: 20,
        attributions: '© Google'
      })
    }
  };

  
  useEffect(() => {
    const getUserFromToken = async () => {
      try {
        const token = Cookies.get('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          const decodedUserId = decoded.UserId;
          console.log("Token decoded, userId:", decodedUserId); // Debug log
          
          if (!decodedUserId) {
            console.error("No UserId found in token");
            return;
          }
          
          // Set userId first
          setUserId(decodedUserId);
          setIsTokenProcessed(true);
          
          // Check password status
          const pwResponse = await axiosInstance.get(`${API_ENDPOINTS.PW_STATUS}?userId=${decodedUserId}`);
          if (pwResponse.data.data.pw_reset_req === "True") {
            setIsModalOpen(true);
          }

          // Fetch user details
          const userResponse = await axiosInstance.get(`${API_ENDPOINTS.USER_DETAILS}?userId=${decodedUserId}`);
          setUserDetails(userResponse.data.data);
          
          // Artificial delay of 5 seconds
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          setIsInitialLoading(false);
        }
      } catch (error) {
        console.error('Error in initialization:', error);
        setIsInitialLoading(false);
      }
    };

    getUserFromToken();
  }, []);


  // Fetch collections data
  useEffect(() => {
    const fetchCollections = async () => {
      const dummyData = [
        {
          id: 1,
          customerName: 'John Doe',
          amount: 1000,
          status: 'pending',
          isPaid: false,
          address: '123 Main St'
        },
        {
          id: 2,
          customerName: 'Jane Smith',
          amount: 2500,
          status: 'completed',
          isPaid: true,
          address: '456 Oak Ave'
        },
      ];
      setCollections(dummyData);
    };

    fetchCollections();
  }, []);

  // Add function to fetch location details using OSM
  const fetchLocationDetails = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'EagleEyeCollectionApp/1.0',
          }
        }
      );
      const data = await response.json();
      setLocationDetails(data);
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };

  // Update useEffect to fetch location details when coordinates change
  useEffect(() => {
    if (location) {
      fetchLocationDetails(location.latitude, location.longitude);
    }
  }, [location]);

  useEffect(() => {
    if (location && mapRef.current && !mapInstance.current) {
      // Initialize map first
      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: mapStyles[mapStyle].source
          })
        ],
        view: new View({
          center: fromLonLat([location.longitude, location.latitude]),
          zoom: 15
        })
      });

      // Create separate vector sources for circle and marker
      const circleSource = new VectorSource({
        features: [
          new Feature({
            geometry: new Point(fromLonLat([
              location.longitude,
              location.latitude
            ]))
          })
        ]
      });

      const markerSource = new VectorSource({
        features: [
          new Feature({
            geometry: new Point(fromLonLat([location.longitude, location.latitude]))
          })
        ]
      });

      // Create separate layers for circle and marker
      const circleLayer = new VectorLayer({
        source: circleSource,
        style: (feature) => {
          return feature.getStyle();
        }
      });

      const markerLayer = new VectorLayer({
        source: markerSource,
        style: new Style({
          image: new Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'https://files.logomakr.com/6D4wfo-LogoMakr.png',
            scale: 0.25
          })
        })
      });

      // Add layers to map
      mapInstance.current.addLayer(circleLayer);
      mapInstance.current.addLayer(markerLayer);

      let animationFrameId;
      let phase = 0;
      const animate = () => {
        if (!mapInstance.current) return; // Add check for map instance
        
        phase = (phase + 1) % 60;
        const baseRadius = 1500;
        const radius = baseRadius + (Math.sin(phase * Math.PI / 30) * 5);
        const resolution = mapInstance.current.getView().getResolution();
        const circleFeature = circleSource.getFeatures()[0];
        if (circleFeature) {
          circleFeature.setStyle(createCircleStyle(radius, resolution));
        }
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();

      // Add view change listener to update circle size when zooming
      mapInstance.current.getView().on('change:resolution', () => {
        const circleFeature = circleSource.getFeatures()[0];
        if (circleFeature) {
          const baseRadius = 50; // Base radius in meters
          const radius = baseRadius + (Math.sin(phase * Math.PI / 30) * 5);
          const resolution = mapInstance.current.getView().getResolution();
          circleFeature.setStyle(createCircleStyle(radius, resolution));
        }
      });

      // Cleanup
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        if (mapInstance.current) {
          mapInstance.current.setTarget(undefined);
          mapInstance.current = null;
        }
      };
    }

    // Update map style when mapStyle changes
    if (mapInstance.current) {
      const baseLayer = mapInstance.current.getLayers().getArray()[0];
      baseLayer.setSource(mapStyles[mapStyle].source);
    }

    // Update marker and circle positions when location changes
    if (location && mapInstance.current) {
      const view = mapInstance.current.getView();
      view.setCenter(fromLonLat([location.longitude, location.latitude]));
      
      const layers = mapInstance.current.getLayers().getArray();
      const circleLayer = layers[1];
      const markerLayer = layers[2];
      
      const circleFeature = circleLayer.getSource().getFeatures()[0];
      const markerFeature = markerLayer.getSource().getFeatures()[0];
      
      circleFeature.setGeometry(new Point(fromLonLat([
        location.longitude + 0.00005,
        location.latitude
      ])));
      markerFeature.setGeometry(new Point(fromLonLat([location.longitude, location.latitude])));
    }

  }, [location, mapStyle]);

  const handleUpdateStatus = async (id) => {
    // TODO: Implement status update logic
    console.log('Updating status for collection:', id);
  };

  const handlePaymentStatus = (id) => {
    setCollections(collections.map(collection => {
      if (collection.id === id) {
        return {
          ...collection,
          isPaid: !collection.isPaid
        };
      }
      return collection;
    }));
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Performance Metrics'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  const chartData = {
    labels: performanceData.labels,
    datasets: [
      {
        label: 'Collections Completed (%)',
        data: performanceData.collections,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.5)',
      },
      {
        label: 'Efficiency Score (%)',
        data: performanceData.efficiency,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.5)',
      }
    ]
  };

  // Create pulsating circle style
  const createCircleStyle = (radius, resolution) => {
    return new Style({
      image: new Circle({
        radius: radius / resolution, // Use passed resolution parameter
        fill: new Fill({
          color: 'rgba(255, 132, 11, 0.2)'
        }),
        stroke: new Stroke({
          color: 'rgba(255, 132, 11, 0.6)',
          width: 3
        })
      })
    });
  };

  return (
    <DashboardContainer isDarkMode={isDarkMode}>
      
      {isInitialLoading && (
        <SpinnerOverlay>
          <Spinner />
        </SpinnerOverlay>
        
      )}
      <Overlay 
        isOpen={isMobileMenuOpen} 
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <Sidebar isDarkMode={isDarkMode}>
        <div className="flex flex-col flex-1 mt-4">
          {isTokenProcessed && (
            <>
              <NavPane 
                activeNav={activeNav} 
                setActiveNav={setActiveNav}
                isDarkMode={isDarkMode}
                userId={userId}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
              
            </>
          )}
        </div>
      </Sidebar>
    

      <MainContent isDarkMode={isDarkMode}>
        <TopBar isDarkMode={isDarkMode}>
          <div className="flex items-center gap-4">
            <MobileMenuButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              isDarkMode={isDarkMode}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </MobileMenuButton>
            <div>
            <h1 className="text-2xl font-light dark:#ff840b">Collector Dashboard</h1>
              <p className="text-sm">Manage your collections</p>
            </div>
          </div>
          <div className="flex gap-4">
          <NotificationButton userId={userId} isDarkMode={isDarkMode} />
          <ThemeToggle onClick={toggleTheme} isDarkMode={isDarkMode}>
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </ThemeToggle>

          </div>
          
        </TopBar>

        <div className="p-6">
          
        {/* Assigned Area Card */}
        <Card isDarkMode={isDarkMode} className="mb-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Assigned Collection Area</h3>
        </div>
        <AreaGrid>
            <AreaInfoBox isDarkMode={isDarkMode}>
            <AreaLabel>Main Area</AreaLabel>
            <AreaValue isDarkMode={isDarkMode} large>
                {assignedArea.mainArea}
            </AreaValue>
            </AreaInfoBox>
            
            <AreaInfoBox isDarkMode={isDarkMode}>
            <AreaLabel>Sub Area</AreaLabel>
            <AreaValue isDarkMode={isDarkMode} large>
                {assignedArea.subArea}
            </AreaValue>
            </AreaInfoBox>
            
            <AreaInfoBox isDarkMode={isDarkMode}>
            <AreaLabel>Collection Target</AreaLabel>
            <AreaValue isDarkMode={isDarkMode} large>
                {assignedArea.collectionTarget}
            </AreaValue>
            </AreaInfoBox>
            
            <AreaInfoBox isDarkMode={isDarkMode}>
            <AreaLabel>Active Collectors</AreaLabel>
            <AreaValue isDarkMode={isDarkMode} large>
                {assignedArea.activeCollectors}
            </AreaValue>
            </AreaInfoBox>
        </AreaGrid>
        </Card>


          {/* Location Card */}
          <LocationDetailsContainer isDarkMode={isDarkMode}>
            <LocationHeader>
              <h3>Current Location</h3>
              <MapStyleSelect isDarkMode={isDarkMode}>
                <select 
                  value={mapStyle}
                  onChange={(e) => setMapStyle(e.target.value)}
                >
                  {Object.entries(mapStyles).map(([key, style]) => (
                    <option key={key} value={key}>
                      {style.name}
                    </option>
                  ))}
                </select>
              </MapStyleSelect>
            </LocationHeader>

            {location ? (
              <>
                <MapContainer ref={mapRef} isDarkMode={isDarkMode} />
                {locationDetails && (
                  <>
                    <LocationGrid>
                      <LocationInfoBox isDarkMode={isDarkMode}>
                        <LocationLabel>Coordinates</LocationLabel>
                        <LocationValue isDarkMode={isDarkMode}>
                          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </LocationValue>
                      </LocationInfoBox>

                      <LocationInfoBox isDarkMode={isDarkMode}>
                        <LocationLabel>Location</LocationLabel>
                        <LocationValue isDarkMode={isDarkMode}>
                          {locationDetails.display_name.split(',')[0]}
                        </LocationValue>
                      </LocationInfoBox>

                      <LocationInfoBox isDarkMode={isDarkMode}>
                        <LocationLabel>Area</LocationLabel>
                        <LocationValue isDarkMode={isDarkMode}>
                          {locationDetails.address?.city || 
                           locationDetails.address?.town || 
                           locationDetails.address?.municipality || 
                           locationDetails.address?.suburb || 
                           'N/A'}
                        </LocationValue>
                      </LocationInfoBox>
                    </LocationGrid>

                    <LocationInfoBox isDarkMode={isDarkMode} style={{ marginTop: '1rem' }}>
                      <LocationLabel>Full Address</LocationLabel>
                      <LocationValue isDarkMode={isDarkMode} small>
                        {locationDetails.display_name}
                      </LocationValue>
                    </LocationInfoBox>
                  </>
                )}
              </>
            ) : (
                <LoadingSpinner isDarkMode={isDarkMode}>
                <div className="spinner" />
                <span className="text">Getting your location...</span>
              </LoadingSpinner>
            )}
            {error && (
              <div className="alert alert-danger mt-3">
                Error getting location: {error}
              </div>
            )}
          </LocationDetailsContainer>

          

          {/* Collections Table */}
          <Card isDarkMode={isDarkMode}>
            <h3 className="mb-4">Assigned Collections</h3>
            <StyledTable isDarkMode={isDarkMode}>
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Maturity</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((collection) => (
                    <tr key={collection.id}>
                      <td>{collection.customerName}</td>
                      <td>₱{collection.amount.toLocaleString()}</td>
                      <td>{collection.maturity}</td>
                      <td>
                        <span className={`badge ${collection.status === 'pending' ? 'warning' : 'success'}`}>
                          {collection.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${collection.isPaid ? 'success' : 'danger'}`}>
                          {collection.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className={collection.isPaid ? 'warning' : 'success'}
                            onClick={() => handlePaymentStatus(collection.id)}
                          >
                            Mark as {collection.isPaid ? 'Unpaid' : 'Paid'}
                          </button>
                          
                          <button
                            className="primary"
                            onClick={() => handleUpdateStatus(collection.id)}
                          >
                            Update Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </StyledTable>
          </Card>

          {/* Stats Grid */}
          <CardGrid className="mt-6">
            {stats.map((stat, index) => (
              <Card key={index} isDarkMode={isDarkMode}>
                <h3>{stat.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">{stat.value}</span>
                  <span className={stat.change.includes('+') ? 'text-green-500' : 'text-orange-500'}>
                    {stat.change}
                  </span>
                </div>
              </Card>
            ))}
          </CardGrid>

          <Card isDarkMode={isDarkMode} className="mt-6">
            <div 
              className="flex justify-between items-center cursor-pointer p-4"
              onClick={() => setIsMetricsExpanded(!isMetricsExpanded)}
            >
              <h3 className="mb-0">Performance Metrics</h3>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`w-6 h-6 transform transition-transform ${isMetricsExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {isMetricsExpanded && (
              <div className="p-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <MetricBox isDarkMode={isDarkMode}>
                    <MetricLabel>Average Daily Collections</MetricLabel>
                    <MetricValue>₱62,500</MetricValue>
                    <MetricChange positive>+12% vs last week</MetricChange>
                  </MetricBox>
                  <MetricBox isDarkMode={isDarkMode}>
                    <MetricLabel>Collection Efficiency</MetricLabel>
                    <MetricValue>85%</MetricValue>
                    <MetricChange positive>+5% vs target</MetricChange>
                  </MetricBox>
                  
                </div>
                
                <div className="h-[400px]">
                  <Line options={chartOptions} data={chartData} />
                </div>
              </div>
            )}
          </Card>
        </div>
      </MainContent>
      
      
    </DashboardContainer>
  );
};

export default CollectorDashboard;
