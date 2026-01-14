import { useAdmin } from '../../context/AdminContext';
import { Eye, Check, X, Truck } from 'lucide-react';
import clsx from 'clsx';

const OrdersTable = ({ limit, orders: propOrders }) => {
    const { orders: contextOrders, updateOrderStatus } = useAdmin();
    const orders = propOrders || contextOrders;

    const displayOrders = limit ? orders.slice(0, limit) : orders;

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-secondary text-foreground border border-border';
            case 'pending': return 'bg-secondary text-muted-foreground border border-border border-dashed';
            case 'cancelled': return 'bg-secondary text-muted-foreground line-through opacity-70';
            case 'picked': return 'bg-secondary text-foreground border border-foreground/50';
            case 'ready': return 'bg-foreground text-background font-bold';
            default: return 'bg-secondary text-muted-foreground border border-border';
        }
    };

    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/50 text-muted-foreground text-sm uppercase">
                            <th className="p-4 font-medium">Order ID</th>
                            <th className="p-4 font-medium">Customer</th>
                            <th className="p-4 font-medium">Shop</th>
                            <th className="p-4 font-medium">Items</th>
                            <th className="p-4 font-medium">Amount</th>
                            <th className="p-4 font-medium">Status</th>
                            {!limit && <th className="p-4 font-medium text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {displayOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-secondary/30 transition-colors text-sm text-muted-foreground">
                                <td className="p-4 font-medium text-foreground">{order.id}</td>
                                <td className="p-4">{order.user}</td>
                                <td className="p-4">{order.shop}</td>
                                <td className="p-4 text-muted-foreground truncate max-w-[200px]">
                                    {order.items.join(', ')}
                                </td>
                                <td className="p-4 font-medium text-foreground">₹{order.amount.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={clsx("px-2 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(order.status))}>
                                        {order.status}
                                    </span>
                                </td>
                                {!limit && (
                                    <td className="p-4 text-right space-x-2">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'accepted')}
                                                className="p-1.5 hover:bg-foreground hover:text-background rounded transition-colors border border-transparent hover:border-foreground"
                                                title="Accept Order"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        {order.status === 'accepted' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'ready')}
                                                className="p-1.5 hover:bg-foreground hover:text-background rounded transition-colors border border-transparent hover:border-foreground"
                                                title="Mark Ready"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        {order.status === 'ready' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'picked')}
                                                className="p-1.5 hover:bg-foreground hover:text-background rounded transition-colors border border-transparent hover:border-foreground"
                                                title="Mark Picked"
                                            >
                                                <Truck className="w-4 h-4" />
                                            </button>
                                        )}
                                        {order.status === 'picked' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                className="p-1.5 hover:bg-foreground hover:text-background rounded transition-colors border border-transparent hover:border-foreground"
                                                title="Mark Delivered"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        {['pending', 'accepted'].includes(order.status) && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors"
                                                title="Cancel Order"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onViewOrder && onViewOrder(order)}
                                            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTable;
