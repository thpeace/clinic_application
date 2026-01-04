import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserTable from "../../components/tables/UserTable/UserTable";
import { Modal } from "../../components/ui/modal";
import userApi from "../../api/userApi";
import type { User } from "../../types/user";
import { useAuth } from "../../context/AuthContext";
import { UserRole, RoleDisplayName } from "../../constants/userRoles";

export default function ProfilesTables() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add user modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: UserRole.PATIENT,
    enabled: true,
  });

  // Check if current user can set roles (only ADMIN and DOCTOR)
  const canSetRole = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.DOCTOR;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userApi.getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserUpdate = (updatedUser: User) => {
    // Update the local state with the edited user
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    // TODO: Call API to persist the update
    console.log("User updated:", updatedUser);
  };

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setAddFormData({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: UserRole.PATIENT,
      enabled: true,
    });
  };

  const handleAddFormChange = (field: string, value: string | boolean) => {
    setAddFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveNewUser = async () => {
    try {
      // TODO: Call API to create user
      console.log("Creating new user:", addFormData);

      // For now, just add to local state (replace with actual API call)
      const newUser: User = {
        id: users.length + 1, // Temporary ID
        username: addFormData.username,
        firstName: addFormData.firstName,
        lastName: addFormData.lastName,
        email: addFormData.email,
        phoneNumber: addFormData.phoneNumber || null,
        role: canSetRole ? addFormData.role : UserRole.PATIENT,
        enabled: addFormData.enabled,
        country: null,
        postalCode: null,
        province: null,
        profilePicture: null,
        createdDate: new Date(),
        updatedDate: new Date(),
      };

      setUsers((prev) => [...prev, newUser]);
      handleCloseAddModal();
    } catch (err) {
      console.error("Failed to create user:", err);
      // TODO: Show error message
    }
  };

  return (
    <>
      <PageMeta
        title="Team"
        description="Profiles table - clinic application"
      />
      <PageBreadcrumb pageTitle="Team" />
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            User Management
          </h2>
          <button
            onClick={handleAddUser}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New User
          </button>
        </div>

        <ComponentCard title="Users">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="w-12 h-12 text-red-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <UserTable
              users={users}
              loading={loading}
              onUserUpdate={handleUserUpdate}
            />
          )}
        </ComponentCard>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal} className="max-w-2xl p-6 lg:p-8">
        <div className="space-y-6">
          {/* Modal Header */}
          <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Add New User
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create a new user account
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addFormData.username}
                onChange={(e) => handleAddFormChange("username", e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={addFormData.password}
                onChange={(e) => handleAddFormChange("password", e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            {/* First Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addFormData.firstName}
                onChange={(e) => handleAddFormChange("firstName", e.target.value)}
                placeholder="Enter first name"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Last Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addFormData.lastName}
                onChange={(e) => handleAddFormChange("lastName", e.target.value)}
                placeholder="Enter last name"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={addFormData.email}
                onChange={(e) => handleAddFormChange("email", e.target.value)}
                placeholder="Enter email"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={addFormData.phoneNumber}
                onChange={(e) => handleAddFormChange("phoneNumber", e.target.value)}
                placeholder="e.g., +1 234 567 8900"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Role <span className="text-red-500">*</span>
              </label>
              {canSetRole ? (
                <select
                  value={addFormData.role}
                  onChange={(e) => handleAddFormChange("role", e.target.value as UserRole)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  {Object.values(UserRole).map((role) => (
                    <option key={role} value={role}>
                      {RoleDisplayName[role]}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input
                    type="text"
                    value={RoleDisplayName[UserRole.PATIENT]}
                    disabled
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400"
                  />
                  <p className="mt-1 text-xs text-gray-400">Only Admin or Doctor can set roles</p>
                </>
              )}
            </div>

            {/* Account Status Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Account Status <span className="text-red-500">*</span>
              </label>
              <select
                value={addFormData.enabled ? "active" : "inactive"}
                onChange={(e) => handleAddFormChange("enabled", e.target.value === "active")}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleCloseAddModal}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNewUser}
              className="px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
            >
              Create User
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
