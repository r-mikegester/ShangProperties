import React, { useEffect, useState } from "react";
import { getPageViewsByRoute } from "../../utils/analyticsQueries";
import { Bar } from "react-chartjs-2";

const AnalyticsPageViewsChart: React.FC = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Last 7 days
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 6);
      const data = await getPageViewsByRoute(start, end);
      setCounts(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const chartData = {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Page Views",
        data: Object.values(counts),
        backgroundColor: "#b08b2e",
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-[#b08b2e]">Page Views by Route (Last 7 Days)</h2>
      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : Object.keys(counts).length > 0 ? (
        <Bar data={chartData} options={{ responsive: true }} />
      ) : (
        <div className="text-slate-400">No data available.</div>
      )}
    </div>
  );
};

export default AnalyticsPageViewsChart;
