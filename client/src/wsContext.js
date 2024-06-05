import { createContext, useContext } from "react";
export const WebSocketContext = createContext(null);
const backend_url = process.env.REACT_APP_BACKEND_URL; 
export const SocketProvider = ({ children, username }) => {
    const socket = new WebSocket("ws://" + backend_url + ":3789/ws?name=" + username);
    return (
        <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>
    );
}

export const useSocket = () => {
    return useContext(WebSocketContext)
}