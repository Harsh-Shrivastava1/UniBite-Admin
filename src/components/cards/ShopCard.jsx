import { MapPin, Star, MoreVertical, Edit, Power, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useAdmin } from '../../context/AdminContext';

const ShopCard = ({ shop, onEdit, onDelete }) => {
    const { toggleShopStatus } = useAdmin();

    return (
        <div className={clsx(
            "bg-card rounded-xl border transition-all duration-200 overflow-hidden",
            shop.status === 'disabled' ? "border-border border-dashed opacity-75" : "border-border hover:border-foreground/20"
        )}>
            {/* Image Header */}
            <div className="h-32 w-full relative">
                <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white flex items-center border border-white/10">
                    <Star className="w-3 h-3 text-white mr-1" fill="currentColor" />
                    {shop.rating}
                </div>
                <div className={clsx(
                    "absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold uppercase border",
                    shop.status === 'approved'
                        ? "bg-white text-black border-white"
                        : "bg-black text-white border-white/20"
                )}>
                    {shop.status}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-foreground">{shop.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">Owner: {shop.owner}</p>

                <div className="flex justify-between items-center text-sm border-t border-border pt-4">
                    <div>
                        <p className="text-muted-foreground text-xs uppercase">Revenue</p>
                        <p className="font-semibold text-foreground">₹{shop.revenue.toLocaleString()}</p>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={onEdit}
                            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
                            title="Edit Shop"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => toggleShopStatus(shop.id)}
                            className={clsx(
                                "p-2 rounded-lg transition-colors hover:bg-secondary",
                                shop.status === 'approved' ? "text-muted-foreground" : "text-foreground"
                            )}
                            title={shop.status === 'approved' ? "Disable Shop" : "Enable Shop"}
                        >
                            <Power className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                            title="Delete Shop"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopCard;
