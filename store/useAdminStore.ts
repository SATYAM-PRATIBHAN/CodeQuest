import { create } from "zustand";
import { User } from "@prisma/client";

interface AdminState {
  users: User[];
  fetchUsers: () => Promise<void>;
  addUser: (userData: Omit<User, "id" | "createdAt">) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],

  fetchUsers: async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    set({ users: data });
  },

  addUser: async (userData) => {
    const res = await fetch("/api/admin/addUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      console.error("Error adding user");
      return;
    }

    const newUser = await res.json();
    set((state) => ({ users: [...state.users, newUser] }));
  },

  deleteUser: async (userId) => {
    const res = await fetch(`/api/admin/deleteUser/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Error deleting user");
      return;
    }

    set((state) => ({ users: state.users.filter((user) => user.id !== userId) }));
  },
}));
