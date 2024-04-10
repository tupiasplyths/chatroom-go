import { createContext, useContext } from "react";

export const WebSocketContext = createContext(null);

export const SocketProvider = ({ children, username }) => {
    // const [socket, setSocket] = useState(null);
    
    const socket = new WebSocket("ws://localhost:3789/ws?name=" + username);
    return (
        <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>

    );
}

export const useSocket = () => {
    return useContext(WebSocketContext)
}