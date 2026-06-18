import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

let socket: Socket | null = null;

/**
 * Get or create the singleton Socket.IO instance.
 * Connects with JWT from the `token` cookie.
 */
export function getSocket(): Socket {
  if (socket) return socket;

  const token = Cookies.get("token");
  if (!token) {
    throw new Error("No auth token available for Socket.IO connection");
  }


  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  // Strip any trailing path like /api/v1 — Socket.IO connects to the root
  const origin = baseUrl.replace(/\/api\/v\d+\/?$/, "");

  socket = io(origin, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  });

  return socket;
}

/**
 * Disconnect and destroy the socket instance.
 * Call this on logout or when the chat feature unmounts.
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

/**
 * Check if the socket is currently connected.
 */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}
