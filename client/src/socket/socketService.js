import { io } from "socket.io-client";

const defaultSocketURL = typeof window !== "undefined"
  ? `${window.location.protocol}//${window.location.hostname}:3000`
  : "http://localhost:3000";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || defaultSocketURL;

let socket = null;

export const initializeSocket = () => {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emit = (eventName, data, callback) => {
  const sock = getSocket();
  if (sock) {
    sock.emit(eventName, data, callback);
  }
};

export const on = (eventName, callback) => {
  const sock = getSocket();
  if (sock) {
    sock.on(eventName, callback);
  }
};

export const off = (eventName, callback) => {
  const sock = getSocket();
  if (sock) {
    sock.off(eventName, callback);
  }
};
