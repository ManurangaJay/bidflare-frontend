"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { markAsRead, setNotifications } from "@/redux/slices/notificationSlice";
import { authFetch } from "../../lib/authFetch";
import { jwtDecode } from "jwt-decode";

export default function NotificationDropdown() {
  const dispatch = useDispatch();
  const { items, unreadCount, isConnected } = useSelector(
    (state: RootState) => state.notifications
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        console.error("Failed to decode JWT:", error);
        return null;
      }
    }
    return null;
  }, []);

  // 1. Fetch Notification History on Mount
  useEffect(() => {
    const fetchNotifications = async () => {
      // Get token from storage (safe to do inside useEffect in 'use client')
      const token = localStorage.getItem("token");

      if (!token || !userId) return;

      try {
        const res = await authFetch(`/notifications/user/${userId}`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        dispatch(setNotifications(data));
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [dispatch, userId]);

  // 2. Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Mark as Read Handler
  const handleMarkAsRead = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Optimistic Update: Update UI immediately before server responds
      dispatch(markAsRead(id));

      const res = await authFetch(`/notifications/${id}/read`, {
        method: "PATCH",
      });

      if (!res.ok) {
        // If server fails, you might want to revert the state (optional)
        console.error("Failed to mark as read on server");
      }
    } catch (e) {
      console.error("Error marking as read", e);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BELL ICON BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-foreground hover:text-orange-500 transition-colors"
      >
        <Bell className="w-6 h-6" />

        {/* Connection Status Dot */}
        <span
          className={`absolute top-2 right-2 h-2 w-2 rounded-full border border-background ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 w-[95vw] max-w-md md:absolute md:top-auto md:left-auto md:right-0 md:translate-x-0 md:w-96 md:max-w-none rounded-xl border-border bg-card/80 shadow-2xl backdrop-blur-3xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
            <h3 className="font-semibold text-sm text-foreground">
              Notifications
            </h3>
            <span className="text-xs text-muted-foreground">
              {items.length} total
            </span>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No notifications yet.
              </div>
            ) : (
              items.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border last:border-0 flex gap-3 transition-colors hover:bg-muted/50 ${
                    !notification.isRead
                      ? "bg-blue-50/10 dark:bg-blue-900/10"
                      : ""
                  }`}
                >
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        !notification.isRead
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Mark as Read Button */}
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent closing dropdown
                        handleMarkAsRead(notification.id);
                      }}
                      className="text-blue-500 hover:text-blue-700 h-fit p-1"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-6 h-6" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
