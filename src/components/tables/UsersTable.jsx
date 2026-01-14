import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Ban, CheckCircle, Trash2, Search, Filter } from 'lucide-react';
import clsx from 'clsx';
import ConfirmationModal from '../ui/ConfirmationModal';

const UsersTable = () => {
    const { users, blockUser, unblockUser, deleteUser } = useAdmin();
    const [filterRole, setFilterRole] = useState('all');
    const [search, setSearch] = useState('');
    const [userToDelete, setUserToDelete] = useState(null);

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            deleteUser(userToDelete.id);
            setUserToDelete(null);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        return matchesRole && matchesSearch;
    });

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative">
                    <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-secondary text-foreground pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:border-foreground w-full sm:w-64"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="bg-secondary text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-foreground"
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Student</option>
                        <option value="shop_owner">Shop Owner</option>
                        <option value="delivery">Delivery Partner</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/50 text-muted-foreground text-sm uppercase">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Joined Date</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-secondary/30 transition-colors text-sm text-foreground">
                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium text-foreground">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 capitalize">{user.role.replace('_', ' ')}</td>
                                        <td className="p-4">
                                            <span className={clsx(
                                                "px-2 py-1 rounded-full text-xs font-medium capitalize border",
                                                user.status === 'active'
                                                    ? "bg-secondary text-foreground border-border"
                                                    : "bg-secondary text-muted-foreground border-border border-dashed"
                                            )}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="p-4">{user.joinedDate}</td>
                                        <td className="p-4 text-right space-x-2">
                                            {user.status === 'active' ? (
                                                <button
                                                    onClick={() => blockUser(user.id)}
                                                    className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors"
                                                    title="Block User"
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => unblockUser(user.id)}
                                                    className="p-1.5 hover:bg-secondary text-foreground rounded transition-colors"
                                                    title="Unblock User"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteClick(user)}
                                                className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
                confirmText="Delete User"
                isDanger={true}
            />
        </div>
    );
};

export default UsersTable;
