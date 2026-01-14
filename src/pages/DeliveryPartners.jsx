import { useAdmin } from '../context/AdminContext';
import { Truck, Star, Ban, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import PageWrapper from '../components/layout/PageWrapper';

import { useState } from 'react';
import AddDeliveryPartnerModal from '../components/modals/AddDeliveryPartnerModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const DeliveryPartners = () => {
    const { deliveryPartners, blockDeliveryPartner, removeDeliveryPartner } = useAdmin();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [partnerToRemove, setPartnerToRemove] = useState(null);

    const handleRemoveClick = (partner) => {
        setPartnerToRemove(partner);
    };

    const confirmRemove = () => {
        if (partnerToRemove) {
            removeDeliveryPartner(partnerToRemove.id);
            setPartnerToRemove(null);
        }
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

                <AddDeliveryPartnerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/50 text-muted-foreground text-sm uppercase">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Deliveries</th>
                                <th className="p-4 font-medium">Rating</th>
                                <th className="p-4 font-medium">Joined</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {deliveryPartners.map((partner) => (
                                <tr key={partner.id} className="hover:bg-secondary/30 transition-colors text-sm text-muted-foreground">
                                    <td className="p-4 flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                            <Truck className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-medium text-foreground">{partner.name}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={clsx(
                                            "px-2 py-1 rounded-full text-xs font-medium capitalize border",
                                            partner.status === 'active'
                                                ? "bg-secondary text-foreground border-border"
                                                : "bg-secondary text-muted-foreground border-border border-dashed"
                                        )}>
                                            {partner.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{partner.completedDeliveries}</td>
                                    <td className="p-4 flex items-center text-foreground">
                                        <Star className="w-4 h-4 fill-current mr-1" />
                                        {partner.rating}
                                    </td>
                                    <td className="p-4">{partner.joined}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => blockDeliveryPartner(partner.id)}
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
                            ))}
                        </tbody>
                    </table>
                </div>

                <ConfirmationModal
                    isOpen={!!partnerToRemove}
                    onClose={() => setPartnerToRemove(null)}
                    onConfirm={confirmRemove}
                    title="Remove Partner"
                    message={`Are you sure you want to remove ${partnerToRemove?.name}? This action cannot be undone.`}
                    confirmText="Remove Partner"
                    isDanger={true}
                />
            </div>
        </PageWrapper>
    );
};

export default DeliveryPartners;
