import {jwtDecode} from "jwt-decode";

// Funkcja sprawdzająca, czy zalogowany użytkownik ma rolę ADMIN
const isAdminRole = () => {
    const token = localStorage.getItem('token'); // Pobranie tokena z localStorage
    if (!token) {
        return false; // Jeśli nie ma tokena, zwróć false
    }

    try {
        const decoded = jwtDecode(token); // Dekodowanie tokena
        const roles = decoded.authorities; // Pobranie ról z dekodowanego tokena
        const currentTime = Date.now() / 1000; // Aktualny czas w sekundach

        if (decoded.exp < currentTime) {
            console.log('Token has expired.');
            return false; // Jeśli token wygasł, zwróć false
        }

        return roles.includes('ROLE_ADMIN'); // Sprawdzenie, czy użytkownik jest adminem
    } catch (error) {
        console.error('Error decoding token:', error);
        return false; // W przypadku błędu dekodowania również zwróć false
    }
};

export default isAdminRole;