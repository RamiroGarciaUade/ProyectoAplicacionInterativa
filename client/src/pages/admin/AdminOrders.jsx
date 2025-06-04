import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const statusColors = {
  PENDING: "bg-yellow-400 text-white",
  CONFIRMED: "bg-green-700 text-white",
  CANCELLED: "bg-red-600 text-white"
};

const statusLabels = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado"
};

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/purchase-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar órdenes");
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirm = async (id) => {
    if (!window.confirm("¿Confirmar esta orden?")) return;
    try {
      const res = await fetch(`http://localhost:8080/purchase-orders/${id}/confirm`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al confirmar orden");
      fetchOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("¿Cancelar esta orden?")) return;
    try {
      const res = await fetch(`http://localhost:8080/purchase-orders/${id}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cancelar orden");
      fetchOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("es-AR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return <div>Cargando órdenes...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-green-800 font-['Merriweather']">Panel de Órdenes</h1>
      <table className="w-full border rounded-lg bg-white">
        <thead>
          <tr className="bg-green-100">
            <th className="py-2 px-4 text-left font-semibold">ID</th>
            <th className="py-2 px-4 text-left font-semibold">Fecha</th>
            <th className="py-2 px-4 text-left font-semibold">ID Usuario</th>
            <th className="py-2 px-4 text-left font-semibold">Email Usuario</th>
            <th className="py-2 px-4 text-left font-semibold">Subtotal</th>
            <th className="py-2 px-4 text-left font-semibold">Estado</th>
            <th className="py-2 px-4 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-t">
              <td className="py-2 px-4 text-left">{order.id}</td>
              <td className="py-2 px-4 text-left">{formatDate(order.orderDate)}</td>
              <td className="py-2 px-4 text-left">{order.user?.id}</td>
              <td className="py-2 px-4 text-left">{order.user?.email}</td>
              <td className="py-2 px-4 text-left">{new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(order.subtotal)}</td>
              <td className="py-2 px-4 text-left">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-gray-300 text-gray-700"}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </td>
              <td className="py-2 px-4 flex gap-2">
                {order.status === "PENDING" && (
                  <>
                    <button
                      className="bg-green-700 hover:bg-green-800 text-white p-2 rounded transition-colors"
                      onClick={() => handleConfirm(order.id)}
                      title="Aceptar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                      onClick={() => handleCancel(order.id)}
                      title="Cancelar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders; 