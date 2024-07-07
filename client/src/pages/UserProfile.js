import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Form, Alert } from 'react-bootstrap';
import { Rating } from '@mui/material';
import axios from "axios";
import UserProfileAvatarComponent from '../components/UserProfileAvatarComponent';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function UserProfile({ show, onClose }) {
    const [user, setUser] = useState({ username: '', email: '', phone: '', emailNotifications: false, city: '', lat: 52.237049, lng: 19.015615 });
    const [tempLocation, setTempLocation] = useState({ lat: user.lat, lng: user.lng });
    const [tempCity, setTempCity] = useState(user.city);
    const [editMode, setEditMode] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [validationError, setValidationError] = useState('');
    const [rating, setRating] = useState(0);
    const [ratingValue, setRatingValue] = useState(0);
    const [avatarUpdated, setAvatarUpdated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get('http://localhost:8080/api/user/getUser');
                setUser(prevUser => ({
                    ...prevUser,
                    ...userResponse.data,
                    lat: userResponse.data.lat || 52.237049,
                    lng: userResponse.data.lng || 19.015615
                }));

                setTempLocation({ lat: userResponse.data.lat || 52.237049, lng: userResponse.data.lng || 19.015615 });
                setTempCity(userResponse.data.city || '');

                const ratingResponse = await axios.get('http://localhost:8080/api/user/getUserRating');
                const averageRating = ratingResponse.data;
                const roundedRating = Math.round(averageRating * 2) / 2;

                setRating(roundedRating);
                setRatingValue(averageRating);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setStatusMessage('Error fetching user data.');
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setUser(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (name === 'phone') setValidationError('');
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleSave = async () => {
        if (user.phone && !validatePhoneNumber(user.phone)) {
            setValidationError('Invalid phone number format.');
            return;
        }

        setUser(prevState => ({
            ...prevState,
            lat: tempLocation.lat,
            lng: tempLocation.lng,
            city: tempCity
        }));

        try {
            const response = await axios.put('http://localhost:8080/api/user/modifyUserDetails', {
                ...user,
                lat: tempLocation.lat,
                lng: tempLocation.lng,
                city: tempCity
            });
            setStatusMessage('Profil pomyślnie zaktualizowany.');
            setEditMode(false);
        } catch (error) {
            console.error("Failed to update user profile:", error);
            setStatusMessage('Błąd podczas aktualizacji profilu');
        }
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('userId', user.userId);
            formData.append('file', file);

            try {
                await axios.post('http://localhost:8080/api/user/uploadAvatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setAvatarUpdated(true);
                setStatusMessage('Avatar updated successfully.');
            } catch (error) {
                console.error('Error uploading avatar:', error);
                setStatusMessage('Failed to update avatar.');
            }
        }
    };

    const geocodeLocation = async (lat, lng) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const city = response.data.address.city || response.data.address.town || response.data.address.village || '';
            setTempCity(city);
        } catch (error) {
            console.error("Geocoding failed:", error);
        }
    };

    const LocationMarker = () => {
        const map = useMapEvents({
            click(e) {
                setTempLocation({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng
                });
                geocodeLocation(e.latlng.lat, e.latlng.lng);
            }
        });

        return tempLocation ? (
            <Marker position={tempLocation} icon={customIcon}></Marker>
        ) : null;
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Moje Dane</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center mb-3">
                    <UserProfileAvatarComponent userId={user.userId} key={avatarUpdated} />
                    {editMode && (
                        <Form.Group>
                            <Form.Label>Zmień zdjęcie profilowe</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} />
                        </Form.Group>
                    )}
                </div>
                <ListGroup>
                    <ListGroup.Item>Login: {user.username}</ListGroup.Item>
                    <ListGroup.Item>
                        Email: {editMode ? (
                        <Form.Control
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            required
                        />
                    ) : user.email}
                    </ListGroup.Item>
                    {/*     <ListGroup.Item>
                        Telefon: {editMode ? (
                        <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Add number"
                        value={user.phone}
                        onChange={handleInputChange}
                        />
                        ) : (user.phone || 'Add number')}
                        </ListGroup.Item>
                    */}
                    <ListGroup.Item>
                        Miasto: {editMode ? (
                        <Form.Control
                            type="text"
                            name="city"
                            placeholder="Wybierz miasto na mapie"
                            value={tempCity}
                            onChange={handleInputChange}
                            readOnly
                        />
                    ) : (user.city || 'Dodaj miasto')}
                    </ListGroup.Item>
                    {editMode && (
                        <ListGroup.Item>
                            Lokalizacja:
                            <div>
                                <MapContainer
                                    style={{ height: "200px", width: "100%" }}
                                    center={[tempLocation.lat, tempLocation.lng]}
                                    zoom={6}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <LocationMarker />
                                </MapContainer>
                                <Form.Control
                                    type="hidden"
                                    name="location"
                                    value={`${tempLocation.lat},${tempLocation.lng}`}
                                />
                            </div>
                        </ListGroup.Item>
                    )}
                    <ListGroup.Item>
                        Powiadomienia: {editMode ? (
                        <Form.Check
                            type="checkbox"
                            name="emailNotifications"
                            checked={user.emailNotifications}
                            onChange={handleInputChange}
                        />
                    ) : (user.emailNotifications ? 'Tak' : 'Nie')}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Ocena profilu:
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Rating name="read-only" value={rating} precision={0.1} readOnly />
                            <span style={{ marginLeft: '10px' }}>{ratingValue.toFixed(2)}</span>
                        </div>
                    </ListGroup.Item>
                </ListGroup>
                {validationError && <Alert variant="danger">{validationError}</Alert>}
                {statusMessage && <Alert variant="success">{statusMessage}</Alert>}
            </Modal.Body>
            <Modal.Footer>
                {editMode ? (
                    <>
                        <Button variant="primary" onClick={handleSave}>Zapisz</Button>
                        <Button variant="secondary" onClick={() => {
                            setEditMode(false);
                            setTempLocation({ lat: user.lat, lng: user.lng });
                            setTempCity(user.city);
                        }}>Anuluj</Button>
                    </>
                ) : (
                    <Button variant="secondary" onClick={() => setEditMode(true)}>Edytuj</Button>
                )}
                <Button variant="secondary" onClick={onClose}>Zamknij</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserProfile;
