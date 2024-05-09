import {jwtDecode} from "jwt-decode";

const isAdminRole = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    try {
        const decoded = jwtDecode(token);
        const roles = decoded.authorities;
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            console.log('Token has expired.');
            return false;
        }

        return roles.includes('ROLE_ADMIN');
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
};

export default isAdminRole;