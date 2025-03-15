"use client";
import { useEffect, useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { users, fetchUsers, addUser, deleteUser } = useAdminStore();
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", image: "" });
  const [isAdding, setIsAdding] = useState(false); // Tracks if user is being added
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null); // Tracks which user is being deleted
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");

    if (isAdmin !== "true") {
      alert("Unauthorized access");
      router.push("/");
    }
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async () => {
    setIsAdding(true); // Disable button and show "Adding..."
    await addUser(newUser);
    setNewUser({ username: "", email: "", password: "", image: "" });
    setIsAdding(false); // Enable button after request completes
  };

  const handleDeleteUser = async (userId: string) => {
    setDeletingUserId(userId); // Disable delete button for this user
    await deleteUser(userId);
    setDeletingUserId(null); // Re-enable delete button after request completes
  };

  return (
    <div className="p-6 min-h-screen bg-[#0D1117] text-white">
      <h1 className="text-2xl font-bold text-[#1F6FEB]">Admin Dashboard</h1>

      {/* Add User Form */}
      <div className="mt-6 p-4 bg-[#161B22] rounded-lg border border-[#30363D]">
        <h2 className="text-xl font-semibold">Add New User</h2>
        <div className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className={`w-full px-4 py-2 rounded bg-[#0D1117] border border-gray-600 text-white focus:border-[#1F6FEB] focus:ring-[#1F6FEB] outline-none transition `}

          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className={`w-full px-4 py-2 rounded bg-[#0D1117] border border-gray-600 text-white focus:border-[#1F6FEB] focus:ring-[#1F6FEB] outline-none transition `}

          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className={`w-full px-4 py-2 rounded bg-[#0D1117] border border-gray-600 text-white focus:border-[#1F6FEB] focus:ring-[#1F6FEB] outline-none transition `}

          />
          <input
            type="text"
            placeholder="Image URL"
            value={newUser.image}
            onChange={(e) => setNewUser({ ...newUser, image: e.target.value })}
            className={`w-full px-4 py-2 rounded bg-[#0D1117] border border-gray-600 text-white focus:border-[#1F6FEB] focus:ring-[#1F6FEB] outline-none transition `}

          />
          <Button 
            onClick={handleAddUser} 
            disabled={isAdding}
            className={`w-full ${isAdding ? "bg-gray-500 cursor-not-allowed" : "bg-[#1F6FEB] hover:bg-opacity-80"}`}
          >
            {isAdding ? "Adding..." : "Add User"}
          </Button>
        </div>
      </div>

      {/* User List */}
      <div className="mt-6 p-4 bg-[#161B22] rounded-lg border border-[#30363D]">
        <h2 className="text-xl font-semibold">Users</h2>
        {Array.isArray(users) && users.length === 0 ? (
          <p className="text-gray-400 mt-4">No users found.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {Array.isArray(users) ? (
              users.map((user) => (
                <div key={user.id} className="flex justify-between items-center bg-[#0D1117] p-4 rounded">
                  <div>
                    <p className="text-white font-semibold">{user.username}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  <Button 
                    onClick={() => handleDeleteUser(user.id)} 
                    disabled={deletingUserId === user.id}
                    className={`bg-red-500 ${deletingUserId === user.id ? "bg-gray-500 cursor-not-allowed" : "hover:bg-red-700"}`}
                  >
                    {deletingUserId === user.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 mt-4">Loading users...</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
