'use client';
import Bot from '../Objects/Bot';
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
  FloatingContent,
  CollectorPin,
  CollectorStatus,
  CollectorInfo,
  CollectorName,
  CollectorDetails,
  LegendContainer,
  LegendToggle,
  LegendContent,
  LegendItem,
  LegendIcon,
  LegendText,
  CollectorList,
  CollectorListItem,
  CollectorAvatar,
  CollectorStatusBadge,
  CollectorTaskInfo,
  CommandCenterOverlay,
  CommandCenterHeader,
  CommandCenterTitle,
  CommandCenterControls,
  ControlButton,
  ToggleOverlayButton,
  TeamSection,
  TeamHeader,
  TeamInfo,
  TeamMember,
  MemberAvatar,
  MemberInfo,
  MemberName,
  MemberRole,
  TeamStats,
  StatItem,
  StatLabel,
  StatValue
} from './CollectorCCStyled';  // Make sure this path is correct
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Circle, Fill, Stroke, Icon, Text } from 'ol/style';
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
import  axiosInstance from '../backend/axiosInstance';
import {API_ENDPOINTS }  from '../backend/apiHelper';
import styled from 'styled-components';

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

const ChatModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  height: 80vh;
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 16px;
  background: ${props => props.isDarkMode ? '#2a2a2a' : '#ff840b'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#ffffff'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#333' : '#e5e5e5'};
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#f5f5f5'};
`;

const ChatMessage = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin: 4px 0;
  
  ${props => props.isOwn && `
    flex-direction: row-reverse;
    .message-content {
      background: ${props.isDarkMode ? '#ff840b' : '#ff840b'};
      color: white;
    }
  `}
`;

const MessageContent = styled.div`
  background: ${props => props.isDarkMode ? '#2a2a2a' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 70%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const ChatInput = styled.div`
  padding: 16px;
  background: ${props => props.isDarkMode ? '#2a2a2a' : '#ffffff'};
  border-top: 1px solid ${props => props.isDarkMode ? '#333' : '#e5e5e5'};
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid ${props => props.isDarkMode ? '#444' : '#e5e5e5'};
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  
  &:focus {
    outline: none;
    border-color: #ff840b;
  }
`;

const SendButton = styled.button`
  background: #ff840b;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background: #e67a0a;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MessageSender = styled.span`
  font-size: 0.8rem;
  color: ${props => props.isDarkMode ? '#999' : '#666'};
  ${props => props.isOwn && `
    text-align: right;
  `}
`;

const MessageTime = styled.span`
  font-size: 0.7rem;
  color: ${props => props.isDarkMode ? '#777' : '#999'};
`;

// Add these styled components after other styled components
const AnnouncementModal = styled(ChatModal)`
  max-width: 500px;
  height: auto;
  min-height: 300px;
  background: #1a1a1a;
  border: 1px solid #333;
`;

const IconSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px 0;
  width: 100%;
`;

const IconOption = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: #2a2a2a;
  color: ${props => props.isSelected ? '#ff840b' : '#ffffff'};
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #333;
  }

  ${props => props.isSelected && `
    background: #ff840b20;
    border: 1px solid #ff840b;
  `}

  svg {
    width: 24px;
    height: 24px;
  }
`;

const AnnouncementInput = styled.textarea`
  width: 100%;
  padding: 12px;
  height: 100px;
  border-radius: 8px;
  resize: none;
  background: #2a2a2a;
  border: 1px solid #333;
  color: #ffffff;
  margin-top: 16px;
  font-size: 14px;

  &::placeholder {
    color: #666;
  }

  &:focus {
    outline: none;
    border-color: #ff840b;
  }
`;

const AnnouncementTypeSelect = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #2a2a2a;
  color: #ffffff;
  appearance: none;
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #ff840b;
  }
`;

const SendAnnouncementButton = styled(SendButton)`
  background: #ff840b;
  padding: 12px 24px;
  border-radius: 8px;
  margin-top: 16px;
  width: 100%;
  justify-content: center;
  font-weight: 500;
`;

// Add these styled components after other styled components
const AnnouncementMessage = styled(MessageContent)`
  background: ${props => props.type === 'warning' ? '#fef3c7' : 
    props.type === 'urgent' ? '#fee2e2' : 
    props.type === 'success' ? '#dcfce7' : 
    '#eff6ff'};
  color: ${props => props.type === 'warning' ? '#92400e' : 
    props.type === 'urgent' ? '#991b1b' : 
    props.type === 'success' ? '#166534' : 
    '#1e40af'};
  border: 1px solid ${props => props.type === 'warning' ? '#fcd34d' : 
    props.type === 'urgent' ? '#fca5a5' : 
    props.type === 'success' ? '#86efac' : 
    '#93c5fd'};
  width: 100%;
  padding: 16px;
  margin: 8px 0;
  border-radius: 8px;
  position: relative;
`;

const AnnouncementIcon = styled.div`
  position: absolute;
  top: -12px;
  left: 16px;
  background: ${props => props.type === 'warning' ? '#fef3c7' : 
    props.type === 'urgent' ? '#fee2e2' : 
    props.type === 'success' ? '#dcfce7' : 
    '#eff6ff'};
  padding: 4px;
  border-radius: 50%;
  border: 1px solid ${props => props.type === 'warning' ? '#fcd34d' : 
    props.type === 'urgent' ? '#fca5a5' : 
    props.type === 'success' ? '#86efac' : 
    '#93c5fd'};
`;

const AnnouncementHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 600;
`;

const CollectorCC= () => {
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
  
  // Add collectors state with sample data
  const [collectors, setCollectors] = useState([
    {
      id: 1,
      name: 'John Smith',
      status: 'Actively working',
      location: { lat: 14.5794, lng: 121.0359 }, // Manila, Philippines
      image: '/assets/placeholder-person.png',
      currentTask: 'Collection at Makati City',
      lastUpdate: '5 minutes ago',
      efficiency: 92
    },
    {
      id: 2,
      name: 'Maria Garcia',
      status: 'On traffic',
      location: { lat: 14.5823, lng: 121.0614 }, // Quezon City
      image: '/assets/placeholder-person.png',
      currentTask: 'Heading to Pasig City',
      lastUpdate: '2 minutes ago',
      efficiency: 88
    },
    {
      id: 3,
      name: 'Robert Santos',
      status: 'On Lunch Break',
      location: { lat: 14.5649, lng: 121.0389 }, // San Juan
      image: '/assets/placeholder-person.png',
      currentTask: 'Break time',
      lastUpdate: '15 minutes ago',
      efficiency: 85
    },
    {
      id: 4,
      name: 'Ana Reyes',
      status: 'Inactive for 30 minutes',
      location: { lat: 14.5547, lng: 121.0244 }, // Manila
      image: '/assets/placeholder-person.png',
      currentTask: 'No active task',
      lastUpdate: '30 minutes ago',
      efficiency: 78
    },
    {
      id: 5,
      name: 'Carlos Mendoza',
      status: 'Lost Signal',
      location: { lat: 14.5995, lng: 121.0614 }, // Quezon City
      image: '/assets/placeholder-person.png',
      currentTask: 'Unknown',
      lastUpdate: '1 hour ago',
      efficiency: 82
    }
  ]);
  
  // Add sample tasks itinerary for each collector ----> Will get from itinerary table
  const [collectorsItinerary] = useState({
    1: [ // John Smith's itinerary
      { lat: 14.5794, lng: 121.0359, title: 'Starting Point', status: 'completed' },
      { lat: 14.5950, lng: 121.0480, title: 'Collect from ABC Store', status: 'completed' },
      { lat: 14.6100, lng: 121.0580, title: 'Visit VIP Customer', status: 'active' },
      { lat: 14.6250, lng: 121.0720, title: 'Lunch Break', status: 'pending' }
    ],
    2: [ // Maria Garcia's itinerary
      { lat: 14.5823, lng: 121.0614, title: 'Starting Point', status: 'completed' },
      { lat: 14.6050, lng: 121.0840, title: 'Morning Collection', status: 'completed' },
      { lat: 14.6280, lng: 121.0920, title: 'Bank Deposit', status: 'active' },
      { lat: 14.6500, lng: 121.1090, title: 'Afternoon Collection', status: 'pending' }
    ],
    3: [ // Robert Santos's itinerary
      { lat: 14.5649, lng: 121.0389, title: 'Starting Point', status: 'completed' },
      { lat: 14.5870, lng: 121.0610, title: 'Visit Client A', status: 'completed' },
      { lat: 14.6090, lng: 121.0830, title: 'Visit Client B', status: 'completed' },
      { lat: 14.6310, lng: 121.1050, title: 'Visit Client C', status: 'pending' }
    ],
    4: [ // Ana Reyes's itinerary
      { lat: 14.5547, lng: 121.0244, title: 'Starting Point', status: 'completed' },
      { lat: 14.5770, lng: 121.0460, title: 'Team Meeting', status: 'completed' },
      { lat: 14.5990, lng: 121.0680, title: 'Client Visit', status: 'completed' },
      { lat: 14.6210, lng: 121.0900, title: 'End of Day Report', status: 'pending' }
    ],
    5: [ // Carlos Mendoza's itinerary
      { lat: 14.5995, lng: 121.0614, title: 'Starting Point', status: 'completed' },
      { lat: 14.6210, lng: 121.0830, title: 'Mall Collection', status: 'completed' },
      { lat: 14.6430, lng: 121.1050, title: 'Office Collection', status: 'pending' },
      { lat: 14.6650, lng: 121.1270, title: 'End of Day', status: 'pending' }
    ]
  });
  
  const [activeNav, setActiveNav] = useState('collector');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { location, error } = useGeolocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const mapRef = useRef();
  const mapInstance = useRef(null);
  const [mapStyle, setMapStyle] = useState('osm');
  const [locationDetails, setLocationDetails] = useState(null);
  const [userId, setUserId] = useState("0000000001");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [isTokenProcessed, setIsTokenProcessed] = useState(false);
  const [assignedArea] = useState({
    mainArea: 'Pasig City',
    subArea: 'Ortigas Center',
    collectionTarget: '₱150,000',
    activeCollectors: 5
  });
  const [isMetricsExpanded, setIsMetricsExpanded] = useState(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState(true);
  const [performanceData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    collections: [65, 59, 80, 81, 56, 55, 40],
    efficiency: [70, 62, 75, 85, 60, 58, 45]
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [isCollectorsExpanded, setIsCollectorsExpanded] = useState(false);
  const [isOverlayExpanded, setIsOverlayExpanded] = useState(false);
  const [isTeamExpanded, setIsTeamExpanded] = useState(true);
  const [teamData] = useState({
    name: "Team Details",
    members: [
      {
        id: 1,
        name: "Sarah Johnson",
        role: "Team Lead",
        image: "/assets/placeholder-person.png",
        status: "online"
      },
      {
        id: 2,
        name: "John Smith",
        role: "Collector",
        image: "/assets/placeholder-person.png",
        status: "online"
      },
      {
        id: 3,
        name: "Lisa Rodriguez",
        role: "Telecollector",
        image: "/assets/placeholder-person.png",
        status: "offline"
      }
    ],
    stats: {
      completionRate: "92%",
      activeMembers: "3/3",
      assignedAreas: "4",
      totalCollections: "₱245,000"
    }
  });

  const stats = [
    { title: 'Total Collections Today', value: '₱45,000', change: '+8.2%' },
    // { title: 'Success Rate', value: '78%', change: '+5.1%' },
    { title: 'Pending Collections', value: '12', change: '-2' },
    { title: 'Total Target Today', value: '₱100,000', change: '45% achieved' },
    { title: 'Total Collectors', value: '5', change: '' }
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

  // Status icons for collectors - replace emojis with SVG paths
  const statusIcons = {
    'Actively working': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    'On traffic': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    'On Lunch Break': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    'Inactive for 30 minutes': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    'Lost Signal': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
  };

  // Status colors for collectors
  const statusColors = {
    'Actively working': '#22c55e',
    'On traffic': '#eab308',
    'On Lunch Break': '#f97316',
    'Inactive for 30 minutes': '#9ca3af',
    'Lost Signal': '#ef4444'
  };

  // Status icons for the legend - replace emojis with SVG paths
  const statusLegendIcons = {
    'Actively working': 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    'On traffic': 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
    'On Lunch Break': 'M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z',
    'Inactive for 30 minutes': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-4.42 3.58-8 8-8 4.42 0 8 3.58 8 8 0 4.42-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
    'Lost Signal': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-4.42 3.58-8 8-8 4.42 0 8 3.58 8 8 0 4.42-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'
  };

  // Function to calculate pin size based on zoom level
  const getPinSize = (resolution) => {
    // Increase the base size for larger pins
    const baseRadius = 30;
    const minRadius = 17;
    const maxRadius = 40;
    
    // Resolution is inversely proportional to zoom level
    const zoomFactor = 1 / (resolution * 10);
    const adjustedRadius = baseRadius * zoomFactor;
    
    // Constrain the size between min and max values
    return Math.min(Math.max(adjustedRadius, minRadius), maxRadius);
  };

  // Function to handle collector selection from the panel
  const handleCollectorSelect = (collector) => {
    setSelectedCollector(collector);
    
    // Zoom and pan to the selected collector
    if (mapInstance.current) {
      const view = mapInstance.current.getView();
      const collectorLocation = fromLonLat([
        collector.location.lng,
        collector.location.lat
      ]);
      
      view.animate({
        center: collectorLocation,
        zoom: 16,
        duration: 1000
      });

      // Reset itinerary visibility when selecting a new collector
      setShowItinerary(false);
      
      // Remove previous itinerary layers if they exist
      if (itineraryLayerRef.current) {
        mapInstance.current.removeLayer(itineraryLayerRef.current);
        itineraryLayerRef.current = null;
      }
      
      if (taskMarkersLayerRef.current) {
        mapInstance.current.removeLayer(taskMarkersLayerRef.current);
        taskMarkersLayerRef.current = null;
      }
    }
  };

  // Function to toggle itinerary display
  const toggleItinerary = () => {
    // Toggle itinerary state
    setShowItinerary(!showItinerary);
    
    if (mapInstance.current && selectedCollector) {
      // If turning off, remove the layers
      if (showItinerary) {
        if (itineraryLayerRef.current) {
          mapInstance.current.removeLayer(itineraryLayerRef.current);
          itineraryLayerRef.current = null;
        }
        
        if (taskMarkersLayerRef.current) {
          mapInstance.current.removeLayer(taskMarkersLayerRef.current);
          taskMarkersLayerRef.current = null;
        }
        return;
      }
      
      // Get itinerary for the selected collector
      const itinerary = collectorsItinerary[selectedCollector.id];
      if (!itinerary || itinerary.length < 2) return;
      
      // Create line coordinates from itinerary points
      const lineCoordinates = itinerary.map(point => fromLonLat([point.lng, point.lat]));
      
      // Create line feature
      const lineFeature = new Feature({
        geometry: new LineString(lineCoordinates)
      });
      
      // Style for the line
      lineFeature.setStyle(new Style({
        stroke: new Stroke({
          color: '#ff840b',
          width: 4,
          lineDash: [5, 8]
        })
      }));
      
      // Create source and layer for the line
      const lineSource = new VectorSource({
        features: [lineFeature]
      });
      
      // Create and add the line layer
      const lineLayer = new VectorLayer({
        source: lineSource,
        zIndex: 10
      });
      
      // Store the layer reference for future removal
      itineraryLayerRef.current = lineLayer;
      mapInstance.current.addLayer(lineLayer);
      
      // Create task markers
      const taskFeatures = itinerary.map((task, index) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([task.lng, task.lat])),
          task: task,
          index: index
        });
        
        // Style based on task status
        let color = '#9ca3af'; // default gray
        if (task.status === 'completed') {
          color = '#22c55e'; // green
        } else if (task.status === 'active') {
          color = '#ff840b'; // orange
        } else if (task.status === 'pending') {
          color = '#eab308'; // yellow
        }
        
        feature.setStyle(new Style({
          image: new Circle({
            radius: 10,
            fill: new Fill({
              color: color
            }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 2
            })
          }),
          text: new Text({
            text: (index + 1).toString(),
            fill: new Fill({
              color: '#ffffff'
            }),
            font: 'bold 12px sans-serif'
          })
        }));
        
        return feature;
      });
      
      // Create source and layer for task markers
      const taskSource = new VectorSource({
        features: taskFeatures
      });
      
      const taskLayer = new VectorLayer({
        source: taskSource,
        zIndex: 11
      });
      
      // Store the layer reference for future removal
      taskMarkersLayerRef.current = taskLayer;
      mapInstance.current.addLayer(taskLayer);
      
      // Adjust view to show all tasks
      const view = mapInstance.current.getView();
      view.setZoom(15); // Zoom out a bit to show more of the itinerary
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
      // Initialize map centered on the Philippines location provided
      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: mapStyles[mapStyle].source
          })
        ],
        view: new View({
          center: fromLonLat([121.0359, 14.5794]), // Philippines coordinates
          zoom: 14
        })
      });

      // Create vector source for collector markers   -- [[MAIN]]
      const collectorSource = new VectorSource({ 
        features: collectors.map(collector => {
          const feature = new Feature({
            geometry: new Point(fromLonLat([
              collector.location.lng,
              collector.location.lat
            ])),
            collector: collector
          });
          
          // Get the current resolution for size calculation
          const resolution = mapInstance.current ? mapInstance.current.getView().getResolution() : 10;
          const pinSize = getPinSize(resolution);
          
          // Create custom pin style for the map
          feature.setStyle([
            // Pin base (vertical bar)
            new Style({
              image: new Icon({
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: '/assets/pin.png',
                scale: 0.070,
                zIndex: 1
              })
            }),
            // Circle for profile background
            new Style({
              image: new Circle({
                radius: pinSize,
                fill: new Fill({
                  color: '#000000'
                }),
                stroke: new Stroke({
                  color: '#ffffff',
                  width: 2.5
                }),
                displacement: [0, 52], // Position above pin
                zIndex: 2
              })
            }),
            // Display collector name as text on profile
            new Style({
              text: new Text({
                text: collector.name.split(' ')[0].substring(0, 7), // First 5 chars of first name
                offsetY: -80,
                font: `bold ${Math.max(10, pinSize * 1.0)}px sans-serif`,
                fill: new Fill({
                  color: '#000000'
                }),
                stroke: new Stroke({
                  color: '#ffffff',
                  width: 1
                }),
                
                zIndex: 3
              })
            }),
            // Status indicator
            new Style({
              image: new Circle({
                radius: pinSize * 0.40,
                fill: new Fill({
                  color: statusColors[collector.status] || '#9ca3af'
                }),
                stroke: new Stroke({
                  color: '#000000',
                  width: 1
                }),
                displacement: [0, 65], // Center on the profile
                zIndex: 4
              })
            })
          ]);
          
          return feature;
        })
      });

      // Create collector layer
      const collectorLayer = new VectorLayer({
        source: collectorSource
      });

      // Add collector layer to map
      mapInstance.current.addLayer(collectorLayer);

      // Add click event to collector markers
      mapInstance.current.on('click', (event) => {
        const feature = mapInstance.current.forEachFeatureAtPixel(event.pixel, (feature) => feature);
        if (feature && feature.get('collector')) {
          setSelectedCollector(feature.get('collector'));
        }
      });

      // Create separate vector sources for circle and marker
      const circleSource = new VectorSource({
        features: [
          new Feature({
            geometry: new Point(fromLonLat([121.0359, 14.5794])) // Philippines coordinates
          })
        ]
      });

      // Create separate layers for circle and marker
      /*
      const circleLayer = new VectorLayer({
        source: circleSource,
        style: (feature) => {
          return feature.getStyle();
        }
      });
      */

      // Add layers to map
      // mapInstance.current.addLayer(circleLayer); // Comment out this line

      let animationFrameId;
      /*
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
      */

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
      // const markerLayer = layers[2]; // Comment out this line
      
      const circleFeature = circleLayer.getSource().getFeatures()[0];
      // const markerFeature = markerLayer.getSource().getFeatures()[0]; // Comment out this line
      
      circleFeature.setGeometry(new Point(fromLonLat([
        location.longitude + 0.00005,
        location.latitude
      ])));
      // Comment out the marker geometry update
      /*
      markerFeature.setGeometry(new Point(fromLonLat([
        location.longitude,
        location.latitude
      ])));
      */
    }

    // Update collector markers when collectors data changes
    if (mapInstance.current && collectors.length > 0) {
      const collectorLayer = mapInstance.current.getLayers().getArray().find(
        layer => layer instanceof VectorLayer && layer.getSource().getFeatures().length > 0 && 
        layer.getSource().getFeatures()[0].get('collector')
      );
      
      if (collectorLayer) {
        const collectorSource = collectorLayer.getSource();
        collectorSource.clear();
        
        collectors.forEach(collector => {
          const feature = new Feature({
            geometry: new Point(fromLonLat([
              collector.location.lng,
              collector.location.lat
            ])),
            collector: collector
          });
          
          // Get the current resolution for size calculation
          const resolution = mapInstance.current ? mapInstance.current.getView().getResolution() : 10;
          const pinSize = getPinSize(resolution);
          
          // Create custom pin style for the map
          feature.setStyle([
            // Pin base (vertical bar)
            new Style({
              image: new Icon({
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: 'https://files.logomakr.com/pin-base-black.png',
                scale: 1,
                zIndex: 1
              })
            }),
            // Circle for profile background
            new Style({
              image: new Circle({
                radius: pinSize,
                fill: new Fill({
                  color: '#000000'
                }),
                stroke: new Stroke({
                  color: '#ffffff',
                  width: 2
                }),
                displacement: [0, -15], // Position above pin
                zIndex: 2
              })
            }),
            // Display collector name as text on profile
            new Style({
              text: new Text({
                text: collector.name.split(' ')[0].substring(0, 6), // First 5 chars of first name
                offsetY: -15,
                font: `bold ${Math.max(10, pinSize * 1)}px sans-serif`,
                fill: new Fill({
                  color: '#000000'
                }),
                stroke: new Stroke({
                  color: '#000000',
                  width: 1
                }),
                zIndex: 3
              })
            }),
            // Status indicator
            new Style({
              image: new Circle({
                radius: pinSize * 0.25,
                fill: new Fill({
                  color: statusColors[collector.status] || '#9ca3af'
                }),
                stroke: new Stroke({
                  color: '#ffffff',
                  width: 1
                }),
                displacement: [0, 0], // Center on the profile
                zIndex: 4
              })
            })
          ]);
          
          collectorSource.addFeature(feature);
        });
      }
    }

  }, [location, mapStyle, collectors]);

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

  // Update createCircleStyle to include shadow
  const createCircleStyle = (radius, resolution) => {
    return new Style({
      image: new Circle({
        radius: radius / resolution,
        fill: new Fill({
          color: 'rgba(255, 132, 11, 0.2)'
        }),
        stroke: new Stroke({
          color: 'rgba(255, 132, 11, 0.6)',
          width: 3
        }),
        // Add shadow effect
        displacement: [1, 1],
        rotateWithView: true
      })
    });
  };

  // Add state for itinerary visibility
  const [showItinerary, setShowItinerary] = useState(false);
  const itineraryLayerRef = useRef(null);
  const taskMarkersLayerRef = useRef(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Sarah Johnson',
      content: 'Good morning team! Please update your collection status.',
      timestamp: '09:00 AM',
      avatar: '/assets/placeholder-person.png',
      isOwn: true
    },
    {
      id: 2,
      sender: 'John Smith',
      content: 'On the way to my 1st collection ',
      timestamp: '09:05 AM',
      avatar: '/assets/placeholder-person.png',
      isOwn: false
    },
    {
      id: 3,
      sender: 'Maria Garcia',
      content: 'Heading to my 1st collection task of the day sir.',
      timestamp: '09:10 AM',
      avatar: '/assets/placeholder-person.png',
      isOwn: false
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatBodyRef = useRef(null);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: messages.length + 1,
      sender: 'You',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: '/assets/placeholder-person.png',
      isOwn: true
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Scroll to bottom after message is added
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 100);
  };

  // Add these states to your CollectorCC component
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('megaphone');
  const [announcementType, setAnnouncementType] = useState('info');

  // Add this array of announcement icons
  const announcementIcons = [
    {
      id: 'megaphone',
      path: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
    },
    {
      id: 'bell',
      path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    },
    {
      id: 'exclamation',
      path: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    },
    {
      id: 'info',
      path: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    }
  ];

  // Update the handleSendAnnouncement function
  const handleSendAnnouncement = () => {
    if (!announcementText.trim()) return;
    
    // Here you would typically send the announcement to your backend
    console.log('Sending announcement:', {
      text: announcementText,
      icon: selectedIcon,
      type: announcementType
    });
    
    // Add announcement to messages with special formatting
    const newMsg = {
      id: messages.length + 1,
      sender: 'You',
      content: announcementText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: '/assets/placeholder-person.png',
      isOwn: true,
      isAnnouncement: true,
      icon: selectedIcon,
      type: announcementType
    };
    
    setMessages([...messages, newMsg]);
    setAnnouncementText('');
    setIsAnnouncementModalOpen(false);
  };

  return (
    <DashboardContainer isDarkMode={isDarkMode}>
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
              
              {/* Remove collector list from sidebar */}
            </>
          )}
        </div>
      </Sidebar>

      <MainContent isDarkMode={isDarkMode}>
      
        <MapContainer ref={mapRef} isDarkMode={isDarkMode}>
          {/* Map Style Selector */}
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
          
          {/* Legend */}
          <LegendContainer isDarkMode={isDarkMode}>
            <LegendToggle 
              onClick={() => setIsLegendExpanded(!isLegendExpanded)}
              isDarkMode={isDarkMode}
            >
              <span>Status Legend</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`w-5 h-5 transform transition-transform ${isLegendExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </LegendToggle>
            
            {isLegendExpanded && (
              <LegendContent isDarkMode={isDarkMode}>
                {Object.entries(statusIcons).map(([status, icon]) => (
                  <LegendItem key={status} isDarkMode={isDarkMode}>
                    <LegendIcon>
                      <div 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          borderRadius: '50%', 
                          backgroundColor: statusColors[status], 
                          border: '1px solid #ffffff'
                        }}
                      ></div>
                    </LegendIcon>
                    <LegendText>{status}</LegendText>
                  </LegendItem>
                ))}
              </LegendContent>
            )}
            
          </LegendContainer>
          <Bot userId={userId} /> 
          {/* Remove the absolute positioned status indicators */}
        </MapContainer>
        
        <FloatingContent isDarkMode={isDarkMode}>
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
                <h1 className="text-xl font-light">Collector Command Center</h1>
                <p className="text-sm">Monitor collector activities</p>
              </div>
            </div>
            <div className="flex gap-4">
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

          {/* Stats Grid */}
          <CardGrid>
            {stats.slice(0, 4).map((stat, index) => (
              <Card key={index} isDarkMode={isDarkMode}>
                <h3>{stat.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold">{stat.value}</span>
                  <span className={stat.change.includes('+') ? 'text-green-500' : 'text-orange-500'}>
                    {stat.change}
                  </span>
                </div>
              </Card>
            ))}
          </CardGrid>
          
          {/* Active Collectors Panel - Collapsible */}
          <Card isDarkMode={isDarkMode}>
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsCollectorsExpanded(!isCollectorsExpanded)}
            >
              <h3 className="mb-0">Active Collectors</h3>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`w-6 h-6 transform transition-transform ${isCollectorsExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
                        </div>
            
            {isCollectorsExpanded && (
              <div className="mt-4">
                <CollectorList>
                  {collectors.map(collector => (
                    <CollectorListItem 
                      key={collector.id}
                      isDarkMode={isDarkMode}
                      isSelected={selectedCollector && selectedCollector.id === collector.id}
                      onClick={() => handleCollectorSelect(collector)}
                    >
                      <CollectorAvatar>
                        <Image 
                          src={collector.image || '/assets/placeholder-person.png'} 
                          alt={collector.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </CollectorAvatar>
                      <div className="ml-3 flex-1">
                        <CollectorName>{collector.name}</CollectorName>
                        <CollectorStatusBadge status={collector.status}>
                          {collector.status}
                        </CollectorStatusBadge>
                      </div>
                    </CollectorListItem>
                  ))}
                </CollectorList>
              </div>
            )}
          </Card>

          {/* Selected Collector Details */}
          {selectedCollector ? (
          <Card isDarkMode={isDarkMode}>
              <div className="flex items-center gap-4 mb-4">
                <Image 
                  src={selectedCollector.image || '/assets/placeholder-person.png'} 
                  alt={selectedCollector.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{selectedCollector.name}</h3>
                  <CollectorStatusBadge status={selectedCollector.status}>
                    {selectedCollector.status}
                  </CollectorStatusBadge>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold">Current Location</h4>
                <button 
                  onClick={toggleItinerary}
                  className={`text-sm px-3 py-1 rounded-full transition-all ${
                    showItinerary 
                      ? (isDarkMode ? 'bg-orange-700 text-white' : 'bg-orange-600 text-white')
                      : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')
                  }`}
                >
                  {showItinerary ? 'Hide Itinerary' : 'Show Itinerary'}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <CollectorInfo isDarkMode={isDarkMode}>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Task</div>
                  <div className="text-base font-semibold">{selectedCollector.currentTask}</div>
                </CollectorInfo>
                <CollectorInfo isDarkMode={isDarkMode}>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Update</div>
                  <div className="text-base font-semibold">{selectedCollector.lastUpdate}</div>
                </CollectorInfo>
                <CollectorInfo isDarkMode={isDarkMode}>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Efficiency</div>
                  <div className="text-base font-semibold">{selectedCollector.efficiency}%</div>
                </CollectorInfo>
                <CollectorInfo isDarkMode={isDarkMode}>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</div>
                  <div className="text-base font-semibold">
                    {selectedCollector.location.lat.toFixed(4)}, {selectedCollector.location.lng.toFixed(4)}
                  </div>
                </CollectorInfo>
              </div>
              
              {showItinerary && (
                <div className="mb-4 p-3 rounded-lg border border-dashed" style={{
                  background: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  borderColor: isDarkMode ? '#333333' : '#f0f0f0'
                }}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold">Today's Itinerary</h4>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span className="text-xs ml-1">Completed • Active • Pending</span>
                    </div>
                  </div>
                  {collectorsItinerary[selectedCollector.id].map((task, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-5 h-5 mr-2 rounded-full flex items-center justify-center ${
                          task.status === 'completed' ? 'bg-green-600' : 
                          task.status === 'active' ? 'bg-orange-500' : 
                          'bg-yellow-500'}`}>
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{task.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {task.status === 'completed' && 'Completed • ' + Math.floor(Math.random() * 3 + 1) + ' hrs ago'}
                            {task.status === 'active' && 'In Progress'}
                            {task.status === 'pending' && 'Upcoming'}
                          </div>
                        </div>
                        <div className="text-xs text-right whitespace-nowrap">
                          {task.lat.toFixed(4)}, {task.lng.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 text-right">
                    <button className="text-xs px-2 py-1 rounded bg-orange-500 text-white">
                      Optimize Route
                    </button>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Assigned Collections</h4>
            <StyledTable isDarkMode={isDarkMode}>
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((collection) => (
                    <tr key={collection.id}>
                      <td>{collection.customerName}</td>
                      <td>₱{collection.amount.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${collection.status === 'pending' ? 'warning' : 'success'}`}>
                          {collection.status}
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </StyledTable>
              </div>
          </Card>
          ) : (
            <Card isDarkMode={isDarkMode}>
              <div className="text-center py-8">
                <p className="text-lg">Select a collector from the list or map to view details</p>
              </div>
            </Card>
          )}
          <Card isDarkMode={isDarkMode}>
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsTeamExpanded(!isTeamExpanded)}
            >
              <div className="flex items-center gap-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 flex-shrink-0" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  style={{ color: isDarkMode ? '#fdba74' : '#ff840b' }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
                <h3 className="mb-0 text-lg font-semibold">{teamData.name}</h3>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`w-6 h-6 transform transition-transform ${isTeamExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {isTeamExpanded && (
              <div className="mt-4">
                {/* Team Stats */}
                <TeamStats isDarkMode={isDarkMode}>
                  <StatItem>
                    <StatLabel isDarkMode={isDarkMode}>Completion Rate</StatLabel>
                    <StatValue isDarkMode={isDarkMode}>{teamData.stats.completionRate}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel isDarkMode={isDarkMode}>Active Members</StatLabel>
                    <StatValue isDarkMode={isDarkMode}>{teamData.stats.activeMembers}</StatValue>
                  </StatItem>
                </TeamStats>

                {/* Team Members */}
                <div className="mt-4">
                  <div className="text-sm font-semibold mb-2">Team Members</div>
                  {teamData.members.map(member => (
                    <TeamMember key={member.id} isDarkMode={isDarkMode}>
                      <MemberAvatar isDarkMode={isDarkMode}>
                        <Image 
                          src={member.image} 
                          alt={member.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </MemberAvatar>
                      <MemberInfo>
                        <MemberName isDarkMode={isDarkMode}>{member.name}</MemberName>
                        <MemberRole isDarkMode={isDarkMode}>{member.role}</MemberRole>
                      </MemberInfo>
                      <div className={`w-2 h-2 rounded-full ${
                        member.status === 'online' 
                          ? 'bg-green-500' 
                          : 'bg-gray-400'
                      }`} />
                    </TeamMember>
                  ))}
                </div>

                {/* Telecollector Assignment */}
                <div className="mt-4 p-3 bg-opacity-50 rounded-lg border border-dashed" style={{
                  background: isDarkMode ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0.05)',
                  borderColor: isDarkMode ? '#ff840b' : '#f97316'
                }}>
                  <div className="text-sm font-semibold mb-2">Telecollector Assignment</div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Lisa Rodriguez - North District</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Active calls today: 23 | Success rate: 78%
                  </div>
                </div>
              </div>
            )}
          </Card>
          {/* Performance Metrics */}
          <Card isDarkMode={isDarkMode}>
            <div 
              className="flex justify-between items-center cursor-pointer"
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
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                
                <div className="h-[200px]">
                  <Line options={chartOptions} data={chartData} />
                </div>
              </div>
            )}
          </Card>

          
        </FloatingContent>
      </MainContent>

      <ToggleOverlayButton 
        isDarkMode={isDarkMode}
        isExpanded={isOverlayExpanded}
        onClick={() => setIsOverlayExpanded(!isOverlayExpanded)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </ToggleOverlayButton>
      
      <CommandCenterOverlay isDarkMode={isDarkMode} isExpanded={isOverlayExpanded}>
        <CommandCenterHeader isDarkMode={isDarkMode}>
          <CommandCenterTitle isDarkMode={isDarkMode}>
            <h3>Command Center Controls</h3>
            <span className="version">v1.0.0 - experimental</span>
            
          </CommandCenterTitle>
        </CommandCenterHeader>
        
        <CommandCenterControls>
          
          <ControlButton isDarkMode={isDarkMode} onClick={() => setIsAnnouncementModalOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Broadcast Announcement
          </ControlButton>

          <ControlButton isDarkMode={isDarkMode} onClick={() => setIsChatOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Team Chat
          </ControlButton>

          <ControlButton isDarkMode={isDarkMode}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Report
          </ControlButton>

          <ControlButton isDarkMode={isDarkMode}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View & Edit Itineraries
          </ControlButton>

          {/* <ControlButton isDarkMode={isDarkMode}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Analytics
          </ControlButton> */}
        </CommandCenterControls>

        <Card isDarkMode={isDarkMode}>
          <h3>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-sm">
              <div className="font-medium mb-2">Active Collectors</div>
              <div className="text-2xl font-bold text-orange-500">{collectors.length}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium mb-2">Pending Tasks</div>
              <div className="text-2xl font-bold text-orange-500">12</div>
            </div>
          </div>
        </Card>
      </CommandCenterOverlay>

      {isChatOpen && (
        <>
          <ModalOverlay onClick={() => setIsChatOpen(false)} />
          <ChatModal isDarkMode={isDarkMode}>
            <ChatHeader isDarkMode={isDarkMode}>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <div>
                  <h3 className="font-semibold">Team Chat</h3>
                  <span className="text-sm opacity-75">5 members</span>
                </div>
              </div>
              <CloseButton onClick={() => setIsChatOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </CloseButton>
            </ChatHeader>
            
            <ChatBody ref={chatBodyRef} isDarkMode={isDarkMode}>
              {messages.map(message => (
                <ChatMessage key={message.id} isOwn={message.isOwn} isDarkMode={isDarkMode}>
                  <UserAvatar>
                    <Image
                      src={message.avatar}
                      alt={message.sender}
                      width={32}
                      height={32}
                    />
                  </UserAvatar>
                  <MessageInfo>
                    <MessageSender isDarkMode={isDarkMode} isOwn={message.isOwn}>
                      {message.sender}
                    </MessageSender>
                    {message.isAnnouncement ? (
                      <AnnouncementMessage type={message.type}>
                        <AnnouncementIcon type={message.type}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {message.icon === 'megaphone' && (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            )}
                            {message.icon === 'bell' && (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            )}
                            {message.icon === 'exclamation' && (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            )}
                            {message.icon === 'info' && (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </AnnouncementIcon>
                        <AnnouncementHeader>
                          {message.type.charAt(0).toUpperCase() + message.type.slice(1)} Announcement
                        </AnnouncementHeader>
                        {message.content}
                      </AnnouncementMessage>
                    ) : (
                      <MessageContent className="message-content" isDarkMode={isDarkMode}>
                        {message.content}
                      </MessageContent>
                    )}
                    <MessageTime isDarkMode={isDarkMode}>
                      {message.timestamp}
                    </MessageTime>
                  </MessageInfo>
                </ChatMessage>
              ))}
            </ChatBody>
            
            <ChatInput isDarkMode={isDarkMode}>
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                isDarkMode={isDarkMode}
              />
              <SendButton onClick={handleSendMessage}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send
              </SendButton>
            </ChatInput>
          </ChatModal>
        </>
      )}

      {isAnnouncementModalOpen && (
        <>
          <ModalOverlay onClick={() => setIsAnnouncementModalOpen(false)} />
          <AnnouncementModal>
            <ChatHeader isDarkMode={true}>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <div>
                  <h3 className="text-white font-semibold">Broadcast Announcement</h3>
                  <span className="text-sm text-gray-400">Send to all team members</span>
                </div>
              </div>
              <CloseButton onClick={() => setIsAnnouncementModalOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </CloseButton>
            </ChatHeader>

            <div className="p-4">
              <AnnouncementTypeSelect 
                value={announcementType}
                onChange={(e) => setAnnouncementType(e.target.value)}
              >
                <option value="info">Information</option>
                <option value="warning">Warning</option>
                <option value="urgent">Urgent</option>
                <option value="success">Success</option>
              </AnnouncementTypeSelect>

              <IconSelector>
                {announcementIcons.map(icon => (
                  <IconOption
                    key={icon.id}
                    isSelected={selectedIcon === icon.id}
                    onClick={() => setSelectedIcon(icon.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon.path} />
                    </svg>
                  </IconOption>
                ))}
              </IconSelector>

              <AnnouncementInput
                placeholder="Type your announcement..."
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
              />

              <SendAnnouncementButton onClick={handleSendAnnouncement}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Send Announcement
              </SendAnnouncementButton>
            </div>
          </AnnouncementModal>
        </>
      )}
    </DashboardContainer>
  );
};

export default CollectorCC;
