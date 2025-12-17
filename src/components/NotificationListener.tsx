"use client";

import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { jwtDecode } from "jwt-decode";
import {
  addNotification,
  setConnected,
} from "@/redux/slices/notificationSlice";

export default function NotificationListener() {
  const dispatch = useDispatch();

  const userId = useMemo(() => {
    // This check ensures localStorage is only accessed on the client-side.
    if (typeof window === "undefined") {
      return null;
    }
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: { userId: string } = jwtDecode(token);
        return decodedToken.userId;
      } catch (error) {
        console.error("Failed to decode JWT for listener:", error);
        return null;
      }
    }
    return null;
  }, []);

  useEffect(() => {
    if (!userId) return; // Don't connect if there's no user ID

    // 1. Configure the Client
    const client = new Client({
      // We use SockJS as a factory because standard ws:// might get blocked
      webSocketFactory: () => {
        const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        return new SockJS(`${url}/ws`);
      },

      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        dispatch(setConnected(true));

        // 2. Subscribe to the private user topic
        client.subscribe(`/topic/user/${userId}/notifications`, (message) => {
          if (message.body) {
            const newNotification = JSON.parse(message.body);
            console.log("🔔 New Notification:", newNotification);
            // 3. Dispatch to Redux
            dispatch(addNotification(newNotification));
          }
        });
      },
      onDisconnect: () => {
        console.log("❌ Disconnected");
        dispatch(setConnected(false));
      },
      // Keep trying to reconnect if connection drops
      reconnectDelay: 5000,
    });

    // 4. Activate connection
    client.activate();

    // 5. Cleanup on unmount
    return () => {
      client.deactivate();
    };
  }, [dispatch, userId]);

  return null; // This component renders nothing visually
}
