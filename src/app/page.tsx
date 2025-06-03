'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/inventory/monitor')
      .then(res => res.json())
      .then(d => setData([d]));
  }, []);

  return (
    <main className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">🎮 Inventory Dashboard</h1>
      {data.map((item) => (
        <div key={item.id} className="border p-4 rounded mb-2 bg-gray-100">
          <div className="text-lg font-semibold">{item.name}</div>
          <div>📦 Box: {item.box}</div>
          <div>✅ Available: {item.available}</div>
          <a className="text-blue-600 underline" href={item.guideUrl} target="_blank">Setup Guide</a>
        </div>
      ))}
    </main>
  );
}