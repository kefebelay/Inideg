"use client";

import React, { useEffect, useState } from "react";
import Axios from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users
  const getUsers = async () => {
    try {
      const res = await Axios.get("/user/all");
      setUsers(res.data.users);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await Axios.delete(`/user/${userId}`);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">
        Users
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-muted-foreground">No users found</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
