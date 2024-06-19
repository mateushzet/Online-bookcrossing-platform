import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const customIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const Map = () => {
    const mapRef = useRef(null);
    const [offers, setOffers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            console.log('Fetching data...');
            try {
                const response = await axios.get('http://localhost:8080/api/user/fetchExchanges');
                const validOffers = response.data.filter(offer => offer.lat !== 0 && offer.lng !== 0);
                console.log('Fetched offers:', validOffers);
                setOffers(validOffers);
            } catch (error) {
                console.error('Error fetching offers:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!mapRef.current) {
            console.log('Creating map');
            mapRef.current = L.map('map').setView([52.237049, 19.015615], 6);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);
        }

        if (mapRef.current && offers.length > 0) {
            console.log('Adding markers to map');
            const markers = L.markerClusterGroup();
            offers.forEach(offer => {
                console.log(offer.city);
                console.log('Adding marker for offer:', offer);
                const marker = L.marker([offer.lat, offer.lng], { icon: customIcon })
                    .bindPopup(`
                        <h5>${offer.title}</h5>
                        <p>${offer.author}</p>
                        <button onclick="window.location.href='/exchangeOffers?title=${encodeURIComponent(offer.title)}&author=${encodeURIComponent(offer.author)}&genre=${encodeURIComponent(offer.genre)}&lat=${offer.lat}&lng=${offer.lng}&city=${encodeURIComponent(offer.city || '')}'">Zobacz oferty</button>
                    `);
                markers.addLayer(marker);
            });
            mapRef.current.addLayer(markers);
            console.log('Markers added to cluster group:', markers.getLayers().length);
        }
    }, [offers, navigate]);

    return (
        <div id="map" style={{ height: '100vh', width: '100%' }}></div>
    );
};

export default Map;