import { Navigate } from "react-router-dom";
import { getAccess, getRole } from "../utils/auth";

export default function PrivateRoute({ children, allowed }) {
    const token = getAccess();
    const role = getRole();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowed && role !== allowed) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
