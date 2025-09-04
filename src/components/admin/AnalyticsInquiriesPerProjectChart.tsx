import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartTypes = ["bar", "line", "pie"] as const;
type ChartType = typeof chartTypes[number];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

const AnalyticsInquiriesPerProjectChart: React.FC = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "inquiries"));
      const projectCounts: Record<string, number> = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        const project = data.property || "Unknown";
        projectCounts[project] = (projectCounts[project] || 0) + 1;
      });
      setCounts(projectCounts);
      setLoading(false);
    };
    fetchData();
  }, []);

  const chartData = {
    labels: Object.keys(counts).map(label => {
      if (isMobile) return getInitials(label);
      if (label === "Shang Residences at Wack Wack") return ["Shang Residences at", "Wack Wack"];
      return label;
    }),
    datasets: [
      {
        label: "Inquiries",
        data: Object.values(counts),
        backgroundColor: chartType === "pie"
          ? ["#b08b2e", "#eab308", "#f59e42", "#a3e635", "#38bdf8", "#f472b6", "#f87171"]
          : "#b08b2e",
        borderRadius: chartType === "bar" ? 6 : 0,
      },
    ],
  };

  const renderChart = () => {
    if (chartType === "bar") return <Bar data={chartData} options={{ responsive: true }} />;
    if (chartType === "line") return <Line data={chartData} options={{ responsive: true }} />;
    if (chartType === "pie") {
      return (
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <ul className="flex-1 mb-4 md:mb-0 md:mr-8">
            {chartData.labels.map((label, idx) => (
              <li key={idx} className="flex items-center mb-2">
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: chartData.datasets[0].backgroundColor[idx] }}
                ></span>
                <span className="text-sm text-slate-700 font-medium">
                  {Array.isArray(label) ? label.join(" ") : label}
                </span>
                <span className="ml-auto text-xs text-slate-500 font-semibold">{chartData.datasets[0].data[idx]}</span>
              </li>
            ))}
          </ul>
          <div className="flex-1 flex justify-center">
            <Pie
              data={chartData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#b08b2e]">Inquiries per Project</h2>
        <div className="flex gap-2">
          {chartTypes.map((type) => (
            <button
              key={type}
              className={`px-2 py-1 rounded text-xs border transition ${chartType === type ? "bg-[#b08b2e] text-white border-[#b08b2e]" : "bg-white text-[#b08b2e] border-[#b08b2e] hover:bg-[#f3e8d2]"}`}
              onClick={() => setChartType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : Object.keys(counts).length > 0 ? (
        renderChart()
      ) : (
        <div className="text-slate-400">No data available.</div>
      )}
    </div>
  );
};

export default AnalyticsInquiriesPerProjectChart;
