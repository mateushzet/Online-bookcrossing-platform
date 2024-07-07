import { jwtDecode } from "jwt-decode";

const isAdminRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const { authorities: roles, exp } = jwtDecode(token);
        if (exp < Date.now() / 1000) return false;
        return roles.includes('ROLE_ADMIN');
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
};

export default isAdminRole;

