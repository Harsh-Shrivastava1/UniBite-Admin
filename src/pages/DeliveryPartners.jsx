import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { supabase } from '../lib/supabaseClient';
import { Truck, Star, Ban, Trash2, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import PageWrapper from '../components/layout/PageWrapper';
import AddDeliveryPartnerModal from '../components/modals/AddDeliveryPartnerModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const DeliveryPartners = () => {
    // Actions from context (optional, or we can reimplement locally if needed for state sync)
    // We'll use local state for data as requested.
    const { blockDeliveryPartner, removeDeliveryPartner } = useAdmin();

    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [partnerToRemove, setPartnerToRemove] = useState(null);

    // Fetch Data
    const fetchPartners = async () => {
        setLoading(true);
        try {
            console.log("Fetching delivery partners...");

            // Fetch delivery profiles
            const { data: deliveryData, error: deliveryError } = await supabase
                .from("delivery_profiles")
                .select("*")
                .order("created_at", { ascending: false });

            if (deliveryError) throw deliveryError;
            console.log("Delivery Data:", deliveryData);

            // Fetch users (Manual Join to bypass missing FK constraints)
            // We fetch all users to map them to profiles. 
            // Optimization: In a large app, we would collect IDs and filter, 
            // but for admin panel with reasonable size, this is robust.
            const { data: usersData, error: usersError } = await supabase
                .from("users")
                .select("*");

            if (usersError) {
                console.warn("Could not fetch users for mapping", usersError);
            } else {
                console.log("Users Data:", usersData);
            }

            // Merge data
            const mergedData = (deliveryData || []).map(profile => {
                // Find matching user by ID
                const user = (usersData || []).find(u => u.id === profile.user_id) || {};
                return {
                    ...profile,
                    users: user // mapped user object
                };
            });

            console.log("Merged Data:", mergedData);
            setPartners(mergedData);

        } catch (error) {
            console.error("Error fetching delivery partners:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleRemoveClick = (partner) => {
        setPartnerToRemove(partner);
    };

    const confirmRemove = async () => {
        if (partnerToRemove) {
            try {
                // Use user_id as the identifier for deletion
                const { error } = await supabase
                    .from('delivery_profiles')
                    .delete()
                    .eq('user_id', partnerToRemove.user_id);

                if (!error) {
                    setPartners(partners.filter(p => p.user_id !== partnerToRemove.user_id));
                }
            } catch (err) {
                console.error("Failed to delete", err);
            }
            setPartnerToRemove(null);
        }
    };

    // Helper to extract display name safely
    // Prioritize delivery_profiles text fields, then fallback to users table
    const getDisplayName = (partner) => {
        if (partner.name) return partner.name;
        const u = partner.users || {};
        if (u.full_name) return u.full_name;
        if (u.name) return u.name;
        if (partner.user_id) return `User ${partner.user_id.slice(0, 6)}...`;
        return 'Unknown User';
    };

    const getPhone = (partner) => {
        if (partner.phone) return partner.phone;
        const u = partner.users || {};
        return u.phone || u.phone_number || null;
    };

    const getHostel = (partner) => {
        if (partner.hostel_name) return partner.hostel_name;
        const u = partner.users || {};
        return u.hostel_name || u.hostel || null;
    };

    const getRoom = (partner) => {
        if (partner.room_number) return partner.room_number;
        const u = partner.users || {};
        return u.room_number || u.room || null;
    };

    return (
        <PageWrapper>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-foreground">Delivery Partners</h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-foreground hover:bg-foreground/90 text-background px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Add Partner
                    </button>
                </div>

                <AddDeliveryPartnerModal
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        fetchPartners(); // Refresh after add
                    }}
                />

                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/50 text-muted-foreground text-sm uppercase">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Enrollment No</th>
                                <th className="p-4 font-medium">Mess Card</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Phone</th>
                                <th className="p-4 font-medium">Hostel</th>
                                <th className="p-4 font-medium">Room</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="p-8 text-center text-muted-foreground">Loading partners...</td>
                                </tr>
                            ) : partners.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-8 text-center text-muted-foreground">No delivery partners found.</td>
                                </tr>
                            ) : (
                                partners.map((partner) => {
                                    return (
                                        <tr key={partner.user_id} className="hover:bg-secondary/30 transition-colors text-sm text-muted-foreground">
                                            {/* Name */}
                                            <td className="p-4 flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                                    <Truck className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="font-medium text-foreground truncate max-w-[150px]" title={partner.user_id}>
                                                    {getDisplayName(partner)}
                                                </span>
                                            </td>

                                            {/* Enrollment No */}
                                            <td className="p-4">
                                                {partner.enrollment_no || <span className="text-muted-foreground/50">-</span>}
                                            </td>

                                            {/* Mess Card */}
                                            <td className="p-4">
                                                {partner.mess_card_url ? (
                                                    <a
                                                        href={partner.mess_card_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-primary hover:underline"
                                                    >
                                                        View <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground/50">Not uploaded</span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="p-4">
                                                <span className={clsx(
                                                    "px-2 py-1 rounded-full text-xs font-medium border",
                                                    partner.is_online
                                                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                        : "bg-secondary text-muted-foreground border-border border-dashed"
                                                )}>
                                                    {partner.is_online ? "Online" : "Offline"}
                                                </span>
                                            </td>

                                            {/* Phone */}
                                            <td className="p-4">
                                                {getPhone(partner) || <span className="text-muted-foreground/50">Not provided</span>}
                                            </td>

                                            {/* Hostel */}
                                            <td className="p-4">
                                                {getHostel(partner) || <span className="text-muted-foreground/50">Not provided</span>}
                                            </td>

                                            {/* Room */}
                                            <td className="p-4">
                                                {getRoom(partner) || <span className="text-muted-foreground/50">Not provided</span>}
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 text-right space-x-2">
                                                <button
                                                    className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors"
                                                    title="Block Partner"
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveClick(partner)}
                                                    className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors"
                                                    title="Remove Partner"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <ConfirmationModal
                    isOpen={!!partnerToRemove}
                    onClose={() => setPartnerToRemove(null)}
                    onConfirm={confirmRemove}
                    title="Remove Partner"
                    message={`Are you sure you want to remove this partner? This action cannot be undone.`}
                    confirmText="Remove Partner"
                    isDanger={true}
                />
            </div>
        </PageWrapper>
    );
};

export default DeliveryPartners;
