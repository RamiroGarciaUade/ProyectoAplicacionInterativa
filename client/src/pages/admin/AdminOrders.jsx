import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated } from "../../redux/userSlice";
import { 
  selectAdminOrders, 
  selectAdminLoading, 
  selectAdminError,
  fetchAllOrders,
  updateOrderStatus 
} from "../../redux/adminSlice";
import { useEffect } from "react";

const AdminOrders = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const orders = useSelector(selectAdminOrders);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);
  const dispatch = useDispatch();

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'CONFIRMED':
        return 'bg-green-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return 'PENDIENTE';
      case 'CONFIRMED':
        return 'CONFIRMADA';
      case 'CANCELLED':
        return 'CANCELADA';
      default:
        return status;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAllOrders());
    }
  }, [isAuthenticated, dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
    } catch (err) {
      alert("Error al actualizar el estado de la orden");
    }
  };

  if (loading.orders) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error.orders) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error.orders}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-['Merriweather'] font-bold text-green-800 mb-8 text-center">
        Gestión de Órdenes
      </h1>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-600">
          No hay órdenes disponibles
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Orden #{order.id}
                  </h2>
                  <p className="text-gray-600">
                    Cliente: {order.user?.firstName} {order.user?.lastName}
                  </p>
                  <p className="text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    ${order.subtotal?.toFixed(2)}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getStatusColor(order.status)}`}>
                    {translateStatus(order.status)}
                  </span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Productos:</h3>
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {item.productName} x{item.quantity}
                      </span>
                      <span className="text-gray-800">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Cambiar Estado:</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(order.id, 'PENDING')}
                    className={`px-3 py-1 rounded text-sm ${
                      order.status === 'PENDING' 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'
                    }`}
                  >
                    Pendiente
                  </button>
                  <button
                    onClick={() => handleStatusChange(order.id, 'CONFIRMED')}
                    className={`px-3 py-1 rounded text-sm ${
                      order.status === 'CONFIRMED' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                    }`}
                  >
                    Confirmada
                  </button>
                  <button
                    onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                    className={`px-3 py-1 rounded text-sm ${
                      order.status === 'CANCELLED' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                    }`}
                  >
                    Cancelada
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 