import AdminLogin from "./screens/AdminLogin";
import AdminDashboard from "./screens/AdminDashboard";

export default function App() {
  const token = localStorage.getItem("token");
  return token ? <AdminDashboard /> : <AdminLogin />;
}
