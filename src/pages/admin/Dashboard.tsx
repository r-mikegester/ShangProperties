import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "../../context/DashboardStatsContext";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Bar } from "react-chartjs-2";
import AnalyticsInquiriesPerProjectChart from "../../components/admin/AnalyticsInquiriesPerProjectChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { Icon } from "@iconify/react";
import { SmoothHoverMenuItem } from "../../components/admin/SmoothHoverMenuItem";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VERCEL_ANALYTICS_TOKEN = "VKIv2CJK6FiJ8Q39DYtU8kis";
const VERCEL_PROJECT_ID = "shangproperties"; // Change if your project id is different

const Dashboard: React.FC = () => {
  
  const navigate = useNavigate();
  const [totalInquiries, setTotalInquiries] = useState<number>(0);
  const [unreadInquiries, setUnreadInquiries] = useState<number>(0);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [visitsData, setVisitsData] = useState<any>({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);
  const [modalInquiry, setModalInquiry] = useState<any>(null);

  const { subscribe } = useDashboardStats();

  // Fetch Firestore inquiries stats
  const fetchInquiries = useCallback(async () => {
    try {
      const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTotalInquiries(all.length);
      setUnreadInquiries(all.filter((i: any) => !i.read).length);
      setRecentInquiries(all.slice(0, 7));
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setTotalInquiries(0);
      setUnreadInquiries(0);
      setRecentInquiries([]);
    }
  }, []);

  // Fetch Vercel Analytics
  const fetchVisits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/analytics");
      const analytics = res.data;
      let labels: string[] = [];
      let data: number[] = [];
      if (analytics && Array.isArray(analytics.ranges)) {
        labels = analytics.ranges.map((r: any) => r.timestamp.split("T")[0]);
        data = analytics.ranges.map((r: any) => r.visits);
      } else if (analytics && Array.isArray(analytics.data)) {
        labels = analytics.data.map((r: any) => r.date || r.timestamp || "");
        data = analytics.data.map((r: any) => r.visits || r.value || 0);
      }
      setVisitsData({ labels, data });
    } catch (err) {
      console.error("Error fetching analytics:", err);
      // Provide default data when API is not available
      setVisitsData({ 
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], 
        data: [0, 0, 0, 0, 0, 0, 0] 
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    
    fetchInquiries();
    fetchVisits();
  }, [fetchInquiries, fetchVisits]);

  // Subscribe to refresh events
  useEffect(() => {
    subscribe(() => {
      fetchInquiries();
      fetchVisits();
    });
  }, [subscribe, fetchInquiries, fetchVisits]);

  return (
    <div className=" max-w-full w-full p-3 pb-20 md:pb-3 box-border">
      <div className="grid grid-cols-2 md:grid-cols-6 grid-rows-[2rem,auto,auto,auto] gap-4 min-h-0 md:h-screen">
        {/* 1 */}
        <div 
          className="bg-white rounded-lg shadow p-3 flex flex-row items-center justify-between cols-span-1 md:col-span-2 row-span-1 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => navigate("/Admin/Inquiries")}
        >
          <div className="flex items-center justify-center space-x-3">
            <Icon icon="solar:letter-broken" className="size-10" />
            <div className="text-slate-600 hidden md:flex text-xl">Total Inquiries</div>
          </div>
          <div className="text-4xl font-bold text-[#b08b2e]">{totalInquiries}</div>
        </div>
        {/* 2 */}
        <div 
          className="bg-white rounded-lg shadow p-3 flex flex-row items-center justify-between col-span-1 md:col-span-2 row-span-1 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => navigate("/Admin/Inquiries?unread=true")}
        >
          <div className="flex items-center justify-center space-x-3">
            <Icon icon="solar:letter-unread-broken" className="size-10" />
            <div className="text-slate-600 hidden md:flex text-xl">Unread Inquiries</div>
          </div>
          <div className="text-4xl font-bold text-red-500">{unreadInquiries}</div>
        </div>
        {/* 5: Recent Inquiries */}
        <div className="bg-white rounded-lg shadow p-6 col-span-2 row-span-2 h-96 md:h-full md:row-span-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-[#b08b2e]">Recent Inquiries</h2>
          <ul className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {recentInquiries.length === 0 && <li className="text-slate-400 p-4">No inquiries yet.</li>}
            {recentInquiries.map((inq: any) => (
              <li key={inq.id} className="my-1">
                <SmoothHoverMenuItem onClick={() => setModalInquiry(inq)}>
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4 justify-between w-full">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">{inq.firstName} {inq.lastName}</span>
                      <span className="text-xs text-slate-500">{inq.email}</span>
                    </div>
                    <div className="text-xs text-slate-400 ml-auto">
                      {inq.createdAt && inq.createdAt.toDate ? inq.createdAt.toDate().toLocaleString() : ""}
                    </div>
                  </div>
                </SmoothHoverMenuItem>
              </li>
            ))}
          </ul>
        </div>
        {/* 6: Inquiries per Project Chart */}
        <div className=" col-span-2 md:col-span-4 row-span-3 row-start-2 flex flex-col">
          <AnalyticsInquiriesPerProjectChart />
        </div>
      </div>
      {/* Add more analytics cards/graphs here as needed */}

    </div>
  );
};

export default Dashboard;