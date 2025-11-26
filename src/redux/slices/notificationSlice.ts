import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of a Notification object (match your Backend DTO)
interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  isConnected: boolean;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  isConnected: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Action to set initial history (fetched from API on login)
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    // Action when a NEW real-time notification arrives
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload); // Add to top of list
      state.unreadCount += 1;
    },
    // Action to mark as read
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    // Connection status helpers
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setNotifications, addNotification, markAsRead, setConnected } =
  notificationSlice.actions;
export default notificationSlice.reducer;
