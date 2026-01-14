import UsersTable from '../components/tables/UsersTable';
import PageWrapper from '../components/layout/PageWrapper';

import { useState } from 'react';
import AddUserModal from '../components/modals/AddUserModal';

const Users = () => {
    const [isIdAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <PageWrapper>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-foreground">User Management</h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-foreground hover:bg-foreground/90 text-background px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Add New User
                    </button>
                </div>

                <UsersTable />

                <AddUserModal isOpen={isIdAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            </div>
        </PageWrapper>
    );
};

export default Users;
