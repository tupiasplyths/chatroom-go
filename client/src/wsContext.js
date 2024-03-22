import { createContext, useContext, useState, useEffect } from "react";

export const WebSocketContext = createContext(null);

// interface ISocketProvider {
//     children: React.ReactNode;
// }
export const SocketProvider = ({ children, username }) => {
    // const [socket, setSocket] = useState(null);
    
    // useEffect(() => {
    //     const tmpSocket = new WebSocket("ws://localhost:3789/ws?name=" + username)
    //     setSocket(tmpSocket)
    //     tmpSocket.addEventListener('open', (event) => {
    //         console.log("connected")
    //     });
    //     return () => socket.close();
    // }, []);
    const socket = new WebSocket("ws://localhost:3789/ws?name=" + username);
    return (
        <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>

    );
}

export const useSocket = () => {
    return useContext(WebSocketContext)
}