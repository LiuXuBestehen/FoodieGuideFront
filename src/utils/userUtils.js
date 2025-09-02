
import { jwtDecode } from "jwt-decode";

export const getUserFromToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return null; // token 过期
        }
        return decoded;
    } catch {
        return null;
    }
};