import { useAdmin } from '../context/AdminContext';
import ShopCard from '../components/cards/ShopCard';
import MenuManagementModal from '../components/modals/MenuManagementModal';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import AddShopModal from '../components/modals/AddShopModal';

import ConfirmationModal from '../components/ui/ConfirmationModal';

const Shops = () => {
    const { shops, deleteShop } = useAdmin();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingShop, setEditingShop] = useState(null);
    const [shopToDelete, setShopToDelete] = useState(null);

    const handleEditClick = (shop) => {
        setEditingShop(shop);
    };

    const handleCloseEdit = () => {
        setEditingShop(null);
    };

    const handleDeleteClick = (shop) => {
        setShopToDelete(shop);
    };

    const confirmDelete = () => {
        if (shopToDelete) {
            deleteShop(shopToDelete.id);
            setShopToDelete(null);
        }
    };

    return (
        <PageWrapper>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Shops & Restaurants</h2>
                        <p className="text-muted-foreground text-sm mt-1">Manage all registered food vendors</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-foreground hover:bg-foreground/90 text-background px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Shop
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {shops.map(shop => (
                        <ShopCard
                            key={shop.id}
                            shop={shop}
                            onEdit={() => handleEditClick(shop)}
                            onDelete={() => handleDeleteClick(shop)}
                        />
                    ))}
                </div>

                <AddShopModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
                <MenuManagementModal isOpen={!!editingShop} onClose={handleCloseEdit} shop={editingShop} />

                <ConfirmationModal
                    isOpen={!!shopToDelete}
                    onClose={() => setShopToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Delete Shop"
                    message={`Are you sure you want to delete ${shopToDelete?.name}? This action cannot be undone.`}
                    confirmText="Delete Shop"
                    isDanger={true}
                />
            </div>
        </PageWrapper>
    );
};

export default Shops;
