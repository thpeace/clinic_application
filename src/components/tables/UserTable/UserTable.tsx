import { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { Modal } from "../../ui/modal";
import type { User } from "../../../types/user";
import { useTranslation } from "react-i18next";
import { UserRole, RoleDisplayName } from "../../../constants/userRoles";
import { useAuth } from "../../../context/AuthContext";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 500];

interface EditFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    enabled: boolean;
}

interface UserTableProps {
    users: User[];
    loading?: boolean;
    onUserUpdate?: (user: User) => void;
}

export default function UserTable({ users, loading = false, onUserUpdate }: UserTableProps) {
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();

    // Check if current user can edit roles (only ADMIN and DOCTOR)
    const canEditRole = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.DOCTOR;
    const [data, setData] = useState<User[]>(users);
    const [searchTerm, setSearchTerm] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editFormData, setEditFormData] = useState<EditFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        role: "",
        enabled: true,
    });

    // Update data when users prop changes
    useEffect(() => {
        setData(users);
    }, [users]);

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data;
        const lowerSearch = searchTerm.toLowerCase();
        return data.filter(
            (user) =>
                (user.firstName?.toLowerCase().includes(lowerSearch) ?? false) ||
                (user.lastName?.toLowerCase().includes(lowerSearch) ?? false) ||
                (user.email?.toLowerCase().includes(lowerSearch) ?? false) ||
                (user.username?.toLowerCase().includes(lowerSearch) ?? false) ||
                (user.role?.toLowerCase().includes(lowerSearch) ?? false)
        );
    }, [searchTerm, data]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    // Reset to page 1 when search or page size changes
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    // Edit handlers
    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setEditFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber || "",
            role: user.role || "",
            enabled: user.enabled,
        });
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
        setEditFormData({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            role: "",
            enabled: true,
        });
    };

    const handleFormChange = (field: keyof EditFormData, value: string | boolean) => {
        setEditFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveEdit = () => {
        if (!editingUser) return;

        const updatedUser: User = {
            ...editingUser,
            firstName: editFormData.firstName,
            lastName: editFormData.lastName,
            email: editFormData.email,
            phoneNumber: editFormData.phoneNumber || null,
            role: canEditRole ? (editFormData.role as UserRole) : editingUser.role,
            enabled: editFormData.enabled,
        };

        setData((prevData) =>
            prevData.map((user) =>
                user.id === editingUser.id ? updatedUser : user
            )
        );

        // Call the callback if provided
        if (onUserUpdate) {
            onUserUpdate(updatedUser);
        }

        handleCloseModal();
    };

    // Get profile picture URL or default
    const getProfilePicture = (user: User) => {
        if (user.profilePicture) {
            return user.profilePicture;
        }
        // Default avatar based on user id
        return `/images/user/user-${(user.id % 10) + 17}.jpg`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                    <svg className="w-8 h-8 animate-spin text-brand-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Loading users...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                {/* Search and Page Size Controls */}
                <div className="flex flex-col gap-4 p-4 border-b border-gray-100 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, email, username, or role..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-lg sm:w-80 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>

                    {/* Page Size Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Show
                        </span>
                        <select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            entries
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    #
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    User
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Email
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Phone
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Role
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Status
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {user.id}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                                    <img
                                                        width={40}
                                                        height={40}
                                                        src={getProfilePicture(user)}
                                                        alt={`${user.firstName} ${user.lastName}`}
                                                        className="object-cover w-full h-full"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = `/images/user/user-17.jpg`;
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {user.firstName} {user.lastName}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        @{user.username}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {user.email}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {user.phoneNumber || "-"}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                {RoleDisplayName[user.role] || "Guest"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Badge
                                                size="sm"
                                                color={user.enabled ? "success" : "error"}
                                            >
                                                {user.enabled ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-brand-500 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors dark:bg-brand-500/10 dark:hover:bg-brand-500/20"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                                Edit
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell className="px-5 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={7}>
                                        {searchTerm ? `No results found matching "${searchTerm}"` : "No users found"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Footer */}
                <div className="flex flex-col gap-4 p-4 border-t border-gray-100 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
                    {/* Results Info */}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {Math.min(currentPage * pageSize, filteredData.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {filteredData.length}
                        </span>{" "}
                        results
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
                        >
                            First
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-1.5 text-sm rounded-lg ${currentPage === pageNum
                                            ? "bg-brand-500 text-white"
                                            : "border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
                        >
                            Next
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
                        >
                            Last
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={handleCloseModal} className="max-w-lg p-6 lg:p-8">
                <div className="space-y-6">
                    {/* Modal Header */}
                    <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Edit User
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Update profile for {editingUser?.firstName} {editingUser?.lastName}
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Profile Picture Preview */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 ring-4 ring-brand-100 dark:ring-brand-900/30">
                                <img
                                    src={editingUser ? getProfilePicture(editingUser) : ""}
                                    alt="Profile"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>

                        {/* First Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={editFormData.firstName}
                                onChange={(e) => handleFormChange("firstName", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Last Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={editFormData.lastName}
                                onChange={(e) => handleFormChange("lastName", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => handleFormChange("email", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={editFormData.phoneNumber}
                                onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
                                placeholder="e.g., +1 234 567 8900"
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Role Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Role
                            </label>
                            {canEditRole ? (
                                <select
                                    value={editFormData.role}
                                    onChange={(e) => handleFormChange("role", e.target.value)}
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
                                        value={editFormData.role ? RoleDisplayName[editFormData.role as UserRole] || editFormData.role : ""}
                                        disabled
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400"
                                    />
                                    <p className="mt-1 text-xs text-gray-400">Only Admin or Doctor can change roles</p>
                                </>
                            )}
                        </div>

                        {/* Account Status Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Account Status
                            </label>
                            <select
                                value={editFormData.enabled ? "active" : "inactive"}
                                onChange={(e) => handleFormChange("enabled", e.target.value === "active")}
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
                            onClick={handleCloseModal}
                            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
