import { useState } from "react";
import { scheduleEmail } from "../api/emailAPI";
import { useNavigate } from "react-router-dom";

export default function Compose() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    to: "",
    subject: "",
    body: "",
    scheduledAt: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await scheduleEmail({
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(), // IMPORTANT
      });

      alert("Email scheduled successfully");
      navigate("/");
    } catch (err) {
      alert("Failed to schedule email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Compose Email</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          name="to"
          placeholder="Recipient Email"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="subject"
          placeholder="Subject"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <textarea
          name="body"
          placeholder="Email Body"
          rows={4}
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="datetime-local"
          name="scheduledAt"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          {loading ? "Scheduling..." : "Schedule Email"}
        </button>
      </form>
    </div>
  );
}
