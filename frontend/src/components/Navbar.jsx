import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 border-b flex gap-6">
      <Link to="/" className="font-semibold hover:underline">
        Dashboard
      </Link>
      <Link to="/compose" className="font-semibold hover:underline">
        Compose
      </Link>
    </nav>
  );
}
