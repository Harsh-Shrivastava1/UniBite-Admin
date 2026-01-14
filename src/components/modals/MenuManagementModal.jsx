import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { X, Save, Plus, Trash2, ToggleRight, ToggleLeft, Utensils, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';
import ConfirmationModal from '../ui/ConfirmationModal';

const MenuManagementModal = ({ isOpen, onClose, shop }) => {
    // We reuse this modal for both Shop Details and Menu Management
    const { editShop, toggleMenuItemAvailability, addMenuItem, deleteMenuItem } = useAdmin();
    const [activeTab, setActiveTab] = useState('details'); // details, menu
    const [newItem, setNewItem] = useState({ name: '', price: '', category: '', available: true });

    // Shop Details Form State
    const [formData, setFormData] = useState({ name: '', owner: '', status: '' });

    useEffect(() => {
        if (shop) {
            setFormData({ name: shop.name, owner: shop.owner, status: shop.status });
        }
    }, [shop]);

    if (!isOpen || !shop) return null;

    const handleSaveDetails = (e) => {
        e.preventDefault();
        editShop(shop.id, formData);
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price) return;
        addMenuItem(shop.id, { ...newItem, price: Number(newItem.price) });
        setNewItem({ name: '', price: '', category: '', available: true }); // Reset
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <div className="flex items-center gap-4">
                        <img src={shop.image} alt={shop.name} className="w-12 h-12 rounded-lg object-cover border border-border" />
                        <div>
                            <h3 className="text-xl font-bold text-foreground">{shop.name}</h3>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">{shop.menu?.length || 0} Menu Items</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tags */}
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={clsx(
                            "flex-1 py-3 text-sm font-medium transition-colors border-b-2",
                            activeTab === 'details' ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:bg-secondary/20"
                        )}
                    >
                        Shop Details
                    </button>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={clsx(
                            "flex-1 py-3 text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-2",
                            activeTab === 'menu' ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:bg-secondary/20"
                        )}
                    >
                        <Utensils className="w-4 h-4" />
                        Menu Management
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

                    {/* DETAILS TAB */}
                    {activeTab === 'details' && (
                        <form onSubmit={handleSaveDetails} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Shop Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:ring-1 focus:ring-foreground outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Owner</label>
                                <input
                                    type="text"
                                    value={formData.owner}
                                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:ring-1 focus:ring-foreground outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:ring-1 focus:ring-foreground outline-none"
                                >
                                    <option value="approved">Approved (Active)</option>
                                    <option value="disabled">Disabled</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-foreground/90 transition-colors">
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}

                    {/* MENU TAB */}
                    {activeTab === 'menu' && (
                        <div className="space-y-6">
                            {/* Add Item Form */}
                            <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add New Item
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <input placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="bg-background border border-border rounded px-2 py-1.5 text-sm text-foreground" />
                                    <input placeholder="Price (₹)" type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} className="bg-background border border-border rounded px-2 py-1.5 text-sm text-foreground" />
                                    <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="bg-background border border-border rounded px-2 py-1.5 text-sm text-foreground" />
                                    <button onClick={handleAddItem} className="bg-foreground text-background rounded text-sm font-medium hover:bg-foreground/90">Add</button>
                                </div>
                            </div>

                            {/* Menu List */}
                            <div className="space-y-2">
                                {shop.menu && shop.menu.length > 0 ? shop.menu.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/10 hover:bg-secondary/30 border border-border rounded-lg transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-muted-foreground overflow-hidden">
                                                {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground text-sm">{item.name}</div>
                                                <div className="text-xs text-muted-foreground">₹{item.price} • {item.category}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={clsx("text-xs px-2 py-0.5 rounded-full font-medium", item.available ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
                                                {item.available ? "Stock" : "Out"}
                                            </div>
                                            <button
                                                onClick={() => toggleMenuItemAvailability(shop.id, item.id)}
                                                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                                title="Toggle Availability"
                                            >
                                                {item.available ? <ToggleRight className="w-5 h-5 text-green-500/80" /> : <ToggleLeft className="w-5 h-5 text-red-500/80" />}
                                            </button>
                                            <button
                                                onClick={() => deleteMenuItem(shop.id, item.id)}
                                                className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                                                title="Delete Item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        No items in menu. Add one above.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default MenuManagementModal;
