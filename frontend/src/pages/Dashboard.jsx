import { useEffect, useState } from "react";
import { getEmails } from "../api/emailAPI";
import EmailTable from "../components/EmailTable";

const filters = ["ALL", "SCHEDULED", "SENT", "FAILED"];

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");

  const fetchEmails = () => {
    setLoading(true);
    getEmails(status === "ALL" ? null : status)
      .then((res) => {
        setEmails(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 10000); // every 10s
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Email Scheduler Dashboard</h1>

      {/* Status Filters */}
      <div className="flex gap-3 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setStatus(f)}
            className={`px-4 py-2 rounded border ${
              status === f
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? <p>Loading emails...</p> : <EmailTable emails={emails} />}
    </div>
  );
}
