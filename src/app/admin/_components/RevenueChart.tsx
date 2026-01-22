"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 4200, costs: 1200 },
  { month: "Feb", revenue: 5100, costs: 1400 },
  { month: "Mar", revenue: 4800, costs: 1300 },
  { month: "Apr", revenue: 6200, costs: 1600 },
  { month: "May", revenue: 7100, costs: 1800 },
  { month: "Jun", revenue: 8300, costs: 2100 },
];

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="month" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "8px",
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#8b5cf6"
          strokeWidth={2}
          name="Revenue"
        />
        <Line
          type="monotone"
          dataKey="costs"
          stroke="#f97316"
          strokeWidth={2}
          name="Costs"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
