import { useState } from 'react';
import {
    Search,
    AlertCircle,
    Eye,
    X,
    CheckCircle,
    XCircle
} from 'lucide-react';
import clsx from 'clsx';

const Complaints = () => {
    // MOCK DATA as requested
    const [complaints, setComplaints] = useState([
        {
            id: "CMP-001",
            student: "Rahul Sharma",
            orderId: "ORD-1023",
            shop: "Juice Junction",
            deliveryPartner: "Amit",
            amount: 120,
            issue: "Order not delivered",
            description: "Order marked delivered but I never received it.",
            time: "2026-01-10 18:45",
            status: "open"
        },
        {
            id: "CMP-002",
            student: "Priya Singh",
            orderId: "ORD-1028",
            shop: "Egg World",
            deliveryPartner: "Ravi",
            amount: 80,
            issue: "Wrong item",
            description: "I ordered cheese omelette but received plain omelette.",
            time: "2026-01-10 19:10",
            status: "resolved"
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredComplaints = complaints.filter(c =>
        c.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleView = (complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    const handleResolve = () => {
        if (!selectedComplaint) return;

        const updatedComplaints = complaints.map(c =>
            c.id === selectedComplaint.id ? { ...c, status: 'resolved' } : c
        );

        setComplaints(updatedComplaints);

        // Update the selected complaint in the modal view as well
        setSelectedComplaint(prev => ({ ...prev, status: 'resolved' }));
    };

    const handleReopen = () => {
        if (!selectedComplaint) return;

        const updatedComplaints = complaints.map(c =>
            c.id === selectedComplaint.id ? { ...c, status: 'open' } : c
        );

        setComplaints(updatedComplaints);

        // Update the selected complaint in the modal view as well
        setSelectedComplaint(prev => ({ ...prev, status: 'open' }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedComplaint(null);
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in-up">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Complaints</h1>
                    <p className="text-muted-foreground text-sm">Manage user reported issues</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search users, orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-secondary/50 border border-transparent focus:border-border rounded-lg text-sm w-full md:w-64 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-3">Complaint ID</th>
                                <th className="px-6 py-3">Student Name</th>
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Shop</th>
                                <th className="px-6 py-3">Issue Type</th>
                                <th className="px-6 py-3">Time</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredComplaints.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-muted-foreground">
                                        No complaints found.
                                    </td>
                                </tr>
                            ) : (
                                filteredComplaints.map((complaint) => (
                                    <tr key={complaint.id} className="hover:bg-secondary/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">{complaint.id}</td>
                                        <td className="px-6 py-4">{complaint.student}</td>
                                        <td className="px-6 py-4">{complaint.orderId}</td>
                                        <td className="px-6 py-4">{complaint.shop}</td>
                                        <td className="px-6 py-4">{complaint.issue}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{complaint.time}</td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                                complaint.status === 'resolved'
                                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                    : "bg-red-500/10 text-red-500 border-red-500/20"
                                            )}>
                                                {complaint.status === 'resolved' ? 'Resolved' : 'Open'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleView(complaint)}
                                                className="px-3 py-1.5 text-xs font-medium bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors inline-flex items-center gap-1.5"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {isModalOpen && selectedComplaint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/30">
                            <div>
                                <h3 className="font-semibold text-foreground text-lg">Complaint Details</h3>
                                <p className="text-xs text-muted-foreground">{selectedComplaint.id}</p>
                            </div>
                            <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Student</label>
                                    <p className="text-foreground font-medium">{selectedComplaint.student}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Order ID</label>
                                    <p className="text-foreground font-medium">{selectedComplaint.orderId}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Shop</label>
                                    <p className="text-foreground font-medium">{selectedComplaint.shop}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Delivery Partner</label>
                                    <p className="text-foreground font-medium">{selectedComplaint.deliveryPartner}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Amount</label>
                                    <p className="text-foreground font-medium">₹{selectedComplaint.amount}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Date & Time</label>
                                    <p className="text-foreground font-medium">{selectedComplaint.time}</p>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-border/50">
                                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Issue Type</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <p className="text-foreground font-medium">{selectedComplaint.issue}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Description</label>
                                <div className="mt-1 p-3 bg-secondary/30 rounded-lg border border-border/50 text-sm text-foreground/90">
                                    {selectedComplaint.description}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <span className="text-sm text-muted-foreground">Current Status:</span>
                                <span className={clsx(
                                    "px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5",
                                    selectedComplaint.status === 'resolved'
                                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                                        : "bg-red-500/10 text-red-500 border-red-500/20"
                                )}>
                                    {selectedComplaint.status === 'resolved' ? (
                                        <><CheckCircle className="w-3 h-3" /> Resolved</>
                                    ) : (
                                        <><AlertCircle className="w-3 h-3" /> Open</>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-secondary/30 border-t border-border flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Close
                            </button>

                            {selectedComplaint.status !== 'resolved' ? (
                                <button
                                    onClick={handleResolve}
                                    className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Mark as Resolved
                                </button>
                            ) : (
                                <button
                                    onClick={handleReopen}
                                    className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    Reopen Complaint
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Complaints;
