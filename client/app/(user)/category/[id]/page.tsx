"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { Card } from "@/components/ui/card";
import Axios from "@/lib/axios";
import Link from "next/link";

interface Item {
  _id: string;
  name: string;
  description: string;
  profile?: string;
  // Add other fields as needed
}

const CategoryItemsPage: React.FC = () => {
  const params = useParams();
  const categoryId = params?.id as string;
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await Axios.get(
          `/business/category/${categoryId}?page=${page}&limit=9`
        );
        setItems(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err: any) {
        setError("Failed to load items.");
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) fetchItems();
  }, [categoryId, page]);

  if (loading)
    return (
      <div className="flex justify-center py-10 mt-20">
        <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 inline-block"></span>
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Category Items</h1>
      {items.length === 0 ? (
        <div className="text-center text-gray-500">
          No items found in this category.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item._id}
                href={`/businesses/${item._id}`}
                className="hover:shadow-lg transition-shadow"
              >
                <Card className="p-4 flex flex-col items-center cursor-pointer">
                  {item.profile && (
                    <img
                      src={item.profile}
                      alt={item.name}
                      className="w-full h-full object-cover rounded mb-3"
                    />
                  )}
                  <h2 className="text-lg font-semibold mb-1">{item.name}</h2>
                  <p className="text-gray-600 text-sm text-center">
                    {item.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryItemsPage;
