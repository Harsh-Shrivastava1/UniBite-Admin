import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { X, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const AddUserModal = ({ isOpen, onClose }) => {
    const { addUser } = useAdmin();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'student'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay for "real feel"
        setTimeout(() => {
            addUser(formData);
            setIsLoading(false);
            setFormData({ name: '', email: '', role: 'student' });
            onClose();
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-foreground">Add New User</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:ring-1 focus:ring-foreground focus:border-foreground outline-none transition-colors"
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:ring-1 focus:ring-foreground focus:border-foreground outline-none transition-colors"
                            placeholder="e.g. john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:ring-1 focus:ring-foreground focus:border-foreground outline-none transition-colors"
                        >
                            <option value="student">Student</option>
                            <option value="shop_owner">Shop Owner</option>
                            <option value="delivery">Delivery Partner</option>
                        </select>
                    </div>

                    <div className="flex space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground py-2 rounded-lg transition-colors font-medium border border-border"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-foreground hover:bg-foreground/90 text-background py-2 rounded-lg transition-colors font-medium flex items-center justify-center disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
