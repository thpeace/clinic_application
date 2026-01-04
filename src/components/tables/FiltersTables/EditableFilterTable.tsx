import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { Modal } from "../../ui/modal";

interface Order {
    id: number;
    user: {
        image: string;
        name: string;
        role: string;
    };
    projectName: string;
    team: {
        images: string[];
    };
    status: string;
    budget: string;
}

// Sample data - you can replace this with your actual data or pass as props
const initialData: Order[] = Array.from({ length: 150 }, (_, i) => ({
    id: i + 1,
    user: {
        image: `/images/user/user-${(i % 5) + 17}.jpg`,
        name: ["Lindsey Curtis", "Kaiya George", "Zain Geidt", "Abram Schleifer", "Carla George"][i % 5],
        role: ["Web Designer", "Project Manager", "Content Writing", "Digital Marketer", "Front-end Developer"][i % 5],
    },
    projectName: ["Agency Website", "Technology", "Blog Writing", "Social Media", "Website"][i % 5],
    team: {
        images: [
            `/images/user/user-${(i % 10) + 22}.jpg`,
            `/images/user/user-${((i + 1) % 10) + 22}.jpg`,
        ],
    },
    budget: `${((i + 1) * 1.5).toFixed(1)}K`,
    status: ["Active", "Pending", "Cancel"][i % 3],
}));

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 500];
const STATUS_OPTIONS = ["Active", "Pending", "Cancel"];

interface EditFormData {
    name: string;
    role: string;
    projectName: string;
    status: string;
    budget: string;
}

export default function EditableFilterTable() {
    const [data, setData] = useState<Order[]>(initialData);
    const [searchTerm, setSearchTerm] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [editFormData, setEditFormData] = useState<EditFormData>({
        name: "",
        role: "",
        projectName: "",
        status: "",
        budget: "",
    });

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data;
        const lowerSearch = searchTerm.toLowerCase();
        return data.filter(
            (item) =>
                item.user.name.toLowerCase().includes(lowerSearch) ||
                item.user.role.toLowerCase().includes(lowerSearch) ||
                item.projectName.toLowerCase().includes(lowerSearch) ||
                item.status.toLowerCase().includes(lowerSearch)
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
    const handleEditClick = (order: Order) => {
        setEditingOrder(order);
        setEditFormData({
            name: order.user.name,
            role: order.user.role,
            projectName: order.projectName,
            status: order.status,
            budget: order.budget,
        });
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingOrder(null);
        setEditFormData({
            name: "",
            role: "",
            projectName: "",
            status: "",
            budget: "",
        });
    };

    const handleFormChange = (field: keyof EditFormData, value: string) => {
        setEditFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveEdit = () => {
        if (!editingOrder) return;

        setData((prevData) =>
            prevData.map((item) =>
                item.id === editingOrder.id
                    ? {
                        ...item,
                        user: {
                            ...item.user,
                            name: editFormData.name,
                            role: editFormData.role,
                        },
                        projectName: editFormData.projectName,
                        status: editFormData.status,
                        budget: editFormData.budget,
                    }
                    : item
            )
        );
        handleCloseModal();
    };

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
                            placeholder="Search by name, role, project, or status..."
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
                                    Project Name
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Team
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
                                    Budget
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
                                paginatedData.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {order.id}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 overflow-hidden rounded-full">
                                                    <img
                                                        width={40}
                                                        height={40}
                                                        src={order.user.image}
                                                        alt={order.user.name}
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {order.user.name}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {order.user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.projectName}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex -space-x-2">
                                                {order.team.images.map((teamImage, index) => (
                                                    <div
                                                        key={index}
                                                        className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                                                    >
                                                        <img
                                                            width={24}
                                                            height={24}
                                                            src={teamImage}
                                                            alt={`Team member ${index + 1}`}
                                                            className="w-full size-6"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Badge
                                                size="sm"
                                                color={
                                                    order.status === "Active"
                                                        ? "success"
                                                        : order.status === "Pending"
                                                            ? "warning"
                                                            : "error"
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {order.budget}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <button
                                                onClick={() => handleEditClick(order)}
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
                                        No results found matching "{searchTerm}"
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
                            Edit Order
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Update the details for order #{editingOrder?.id}
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Name
                            </label>
                            <input
                                type="text"
                                value={editFormData.name}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Role Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Role
                            </label>
                            <input
                                type="text"
                                value={editFormData.role}
                                onChange={(e) => handleFormChange("role", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Project Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Project Name
                            </label>
                            <input
                                type="text"
                                value={editFormData.projectName}
                                onChange={(e) => handleFormChange("projectName", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Status Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Status
                            </label>
                            <select
                                value={editFormData.status}
                                onChange={(e) => handleFormChange("status", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Budget Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Budget
                            </label>
                            <input
                                type="text"
                                value={editFormData.budget}
                                onChange={(e) => handleFormChange("budget", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
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
