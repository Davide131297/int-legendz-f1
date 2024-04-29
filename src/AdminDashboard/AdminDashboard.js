import React, {useContext, useEffect} from "react";
import { AccessTokenContext } from "../utils/AccesTokenContext";

const AdminDashboard = () => {
    const { accessToken } = useContext(AccessTokenContext);
    
    useEffect(() => {
        console.log("accessToken:", accessToken);
    }, [accessToken]);
    return (
        <>
            {accessToken === null ? (
                <h1>Kein Zugriff, bitte Einloggen.</h1> 
            ) : (
            <div>
                <h1>Admin Dashboard</h1>
            </div>
            )}
        </>
    );
}
export default AdminDashboard;