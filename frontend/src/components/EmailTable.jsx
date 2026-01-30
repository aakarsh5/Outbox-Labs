export default function EmailTable({ emails }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">To</th>
            <th className="p-3 text-left">Subject</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Scheduled At</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => (
            <tr key={email.id} className="border-t">
              <td className="p-3">{email.to}</td>
              <td className="p-3">{email.subject}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    email.status === "SENT"
                      ? "bg-green-100 text-green-700"
                      : email.status === "FAILED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {email.status}
                </span>
              </td>
              <td className="p-3">
                {new Date(email.scheduledAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
