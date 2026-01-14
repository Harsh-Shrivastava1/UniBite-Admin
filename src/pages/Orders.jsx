import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import OrdersTable from '../components/tables/OrdersTable';
import SlideOver from '../components/ui/SlideOver';
import clsx from 'clsx';

import PageWrapper from '../components/layout/PageWrapper';

const Orders = () => {
    const { orders, updateOrderStatus } = useAdmin();
    const [activeTab, setActiveTab] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const tabs = [
        { id: 'all', label: 'All Orders' },
        { id: 'pending', label: 'Pending' },
        { id: 'accepted', label: 'Accepted' },
        { id: 'ready', label: 'Ready' },
        { id: 'picked', label: 'Picked Up' },
        { id: 'delivered', label: 'Delivered' },
        { id: 'cancelled', label: 'Cancelled' },
    ];

    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter(o => o.status === activeTab);

    return (
        <PageWrapper>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Orders Management</h2>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-border pb-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2",
                                activeTab === tab.id
                                    ? "border-primary text-primary bg-secondary/50"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <OrdersTable orders={filteredOrders} onViewOrder={setSelectedOrder} />

                <SlideOver
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    title={`Order #${selectedOrder?.id}`}
                    footer={
                        <div className="flex justify-between w-full items-center">
                            <div className="flex gap-2">
                                {selectedOrder?.status === 'pending' && (
                                    <button onClick={() => { updateOrderStatus(selectedOrder.id, 'accepted'); setSelectedOrder(null); }} className="px-3 py-1.5 bg-foreground text-background text-xs font-bold rounded">Accept</button>
                                )}
                                {selectedOrder?.status === 'accepted' && (
                                    <button onClick={() => { updateOrderStatus(selectedOrder.id, 'ready'); setSelectedOrder(null); }} className="px-3 py-1.5 bg-foreground text-background text-xs font-bold rounded">Ready</button>
                                )}
                                {['pending', 'accepted'].includes(selectedOrder?.status) && (
                                    <button onClick={() => { updateOrderStatus(selectedOrder.id, 'cancelled'); setSelectedOrder(null); }} className="px-3 py-1.5 bg-secondary text-red-500 text-xs font-bold rounded hover:bg-red-500/10">Cancel</button>
                                )}
                            </div>
                            <button
                                className="bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                onClick={() => setSelectedOrder(null)}
                            >
                                Close
                            </button>
                        </div>
                    }
                >
                    {selectedOrder && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Status</p>
                                    <p className="text-foreground capitalize font-medium">{selectedOrder.status}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase text-right">Amount</p>
                                    <p className="text-foreground font-bold text-lg">₹{selectedOrder.amount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Customer Details</h3>
                                <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between border-b border-border pb-2">
                                        <span className="text-muted-foreground text-sm">Name</span>
                                        <span className="text-foreground text-sm font-medium">{selectedOrder.user}</span>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <span className="text-muted-foreground text-sm">Order ID</span>
                                        <span className="text-foreground text-sm font-mono">#{selectedOrder.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Order Items</h3>
                                <div className="bg-card border border-border rounded-lg overflow-hidden">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="p-3 border-b border-border last:border-0 flex justify-between items-center bg-card">
                                            <span className="text-foreground text-sm">{item}</span>
                                            <span className="text-muted-foreground text-xs">x1</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wider">Timeline</h3>
                                <div className="relative pl-4 border-l-2 border-border space-y-6">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-foreground rounded-full border-2 border-background"></div>
                                        <p className="text-sm text-foreground">Order Placed</p>
                                        <p className="text-xs text-muted-foreground">{selectedOrder.date}</p>
                                    </div>
                                    {/* Mock Timeline */}
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-secondary border-2 border-border rounded-full"></div>
                                        <p className="text-sm text-muted-foreground">Preparing...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </SlideOver>
            </div>
        </PageWrapper>
    );
};

export default Orders;
