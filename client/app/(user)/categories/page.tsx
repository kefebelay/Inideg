import React from "react";

export default function Categories() {
  const categories: string[] = [
    "category1",
    "category 2",
    "category 3",
    "category 4",
  ];
  return (
    <div className="mt-28 pb-10">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-3 text-center">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="h-60 w-full bg-primary/20 rounded-md"></div>
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}
