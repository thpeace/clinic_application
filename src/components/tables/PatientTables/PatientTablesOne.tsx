import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";

interface Patient {
    id: number;
    hn: string;
    firstName: string;
    lastName: string;
    nickname: string;
    phoneNumber: string;
}

// Sample data - replace with API data
const samplePatients: Patient[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    hn: `HN${String(i + 1).padStart(6, "0")}`,
    firstName: ["สมชาย", "สมหญิง", "สมศักดิ์", "สมศรี", "สมบัติ"][i % 5],
    lastName: ["ใจดี", "รักสงบ", "มีสุข", "สุขใจ", "ดีงาม"][i % 5],
    nickname: ["ชาย", "หญิง", "เก่ง", "ศรี", "บัติ"][i % 5],
    phoneNumber: `08${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
}));

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function PatientTablesOne() {
    const [patients, setPatients] = useState<Patient[]>(samplePatients);
    const [searchTerm, setSearchTerm] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Patient | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPatient, setNewPatient] = useState<Omit<Patient, "id">>({
        hn: "",
        firstName: "",
        lastName: "",
        nickname: "",
        phoneNumber: "",
    });

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return patients;
        const lowerSearch = searchTerm.toLowerCase();
        return patients.filter(
            (patient) =>
                patient.hn.toLowerCase().includes(lowerSearch) ||
                patient.firstName.toLowerCase().includes(lowerSearch) ||
                patient.lastName.toLowerCase().includes(lowerSearch) ||
                patient.nickname.toLowerCase().includes(lowerSearch) ||
                patient.phoneNumber.includes(lowerSearch)
        );
    }, [searchTerm, patients]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    // Edit handlers
    const handleEditClick = (patient: Patient) => {
        setEditingId(patient.id);
        setEditForm({ ...patient });
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const handleEditSave = () => {
        if (editForm) {
            setPatients(patients.map((p) => (p.id === editForm.id ? editForm : p)));
            setEditingId(null);
            setEditForm(null);
        }
    };

    const handleEditChange = (field: keyof Patient, value: string) => {
        if (editForm) {
            setEditForm({ ...editForm, [field]: value });
        }
    };

    // Add new patient handlers
    const handleAddPatient = () => {
        const newId = Math.max(...patients.map((p) => p.id), 0) + 1;
        setPatients([...patients, { ...newPatient, id: newId }]);
        setNewPatient({
            hn: "",
            firstName: "",
            lastName: "",
            nickname: "",
            phoneNumber: "",
        });
        setIsAddModalOpen(false);
    };

    const handleNewPatientChange = (field: keyof Omit<Patient, "id">, value: string) => {
        setNewPatient({ ...newPatient, [field]: value });
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            {/* Header Controls */}
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
                        placeholder="Search by HN, name, nickname, phone..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-lg sm:w-80 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* Page Size Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Show</span>
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
                        <span className="text-sm text-gray-500 dark:text-gray-400">entries</span>
                    </div>

                    {/* Add Patient Button */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Patient
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                HN
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                First Name
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Last Name
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Nickname
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Phone Number
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((patient) => (
                                <TableRow key={patient.id}>
                                    {editingId === patient.id ? (
                                        <>
                                            <TableCell className="px-5 py-4">
                                                <input
                                                    type="text"
                                                    value={editForm?.hn || ""}
                                                    onChange={(e) => handleEditChange("hn", e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                />
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <input
                                                    type="text"
                                                    value={editForm?.firstName || ""}
                                                    onChange={(e) => handleEditChange("firstName", e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                />
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <input
                                                    type="text"
                                                    value={editForm?.lastName || ""}
                                                    onChange={(e) => handleEditChange("lastName", e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                />
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <input
                                                    type="text"
                                                    value={editForm?.nickname || ""}
                                                    onChange={(e) => handleEditChange("nickname", e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                />
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <input
                                                    type="text"
                                                    value={editForm?.phoneNumber || ""}
                                                    onChange={(e) => handleEditChange("phoneNumber", e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                />
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={handleEditSave}
                                                        className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleEditCancel}
                                                        className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                                                {patient.hn}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                                {patient.firstName}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                                {patient.lastName}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                                {patient.nickname}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                                {patient.phoneNumber}
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        onClick={() => handleEditClick(patient)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 dark:text-brand-400 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="px-5 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={6}>
                                    No patients found matching "{searchTerm}"
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col gap-4 p-4 border-t border-gray-100 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
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
                    patients
                </div>

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

            {/* Add Patient Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md p-6 bg-white rounded-xl dark:bg-gray-800 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Add New Patient
                            </h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    HN
                                </label>
                                <input
                                    type="text"
                                    value={newPatient.hn}
                                    onChange={(e) => handleNewPatientChange("hn", e.target.value)}
                                    placeholder="Enter HN"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={newPatient.firstName}
                                    onChange={(e) => handleNewPatientChange("firstName", e.target.value)}
                                    placeholder="Enter first name"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={newPatient.lastName}
                                    onChange={(e) => handleNewPatientChange("lastName", e.target.value)}
                                    placeholder="Enter last name"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nickname
                                </label>
                                <input
                                    type="text"
                                    value={newPatient.nickname}
                                    onChange={(e) => handleNewPatientChange("nickname", e.target.value)}
                                    placeholder="Enter nickname"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={newPatient.phoneNumber}
                                    onChange={(e) => handleNewPatientChange("phoneNumber", e.target.value)}
                                    placeholder="Enter phone number"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddPatient}
                                disabled={!newPatient.hn || !newPatient.firstName || !newPatient.lastName}
                                className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Add Patient
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
