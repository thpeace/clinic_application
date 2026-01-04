import { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import patientApi from "../../../api/patientApi";
import type { Patient, CreatePatientRequest } from "../../../types/patient";
import type { PaginatedResponse } from "../../../types/common";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 500];

export default function PatientTablesOne() {
    // API data state
    const [paginatedResponse, setPaginatedResponse] = useState<PaginatedResponse<Patient> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI state
    const [searchTerm, setSearchTerm] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0); // Backend uses 0-based indexing
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Patient | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPatient, setNewPatient] = useState<Partial<Patient>>({
        hn: "",
        fname: "",
        lname: "",
        tel1: "",
    });

    // Fetch patients from API
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await patientApi.getAll(currentPage, pageSize);
                console.log("data", data);
                setPaginatedResponse(data);
            } catch (err) {
                console.error("Failed to fetch patients:", err);
                setError("Failed to load patients. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [currentPage, pageSize]);

    const patients = paginatedResponse?.content || [];

    // Filter data based on search term (client-side filtering for current page)
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return patients;
        const lowerSearch = searchTerm.toLowerCase();
        return patients.filter(
            (patient) =>
                (patient.hn?.toLowerCase().includes(lowerSearch) ?? false) ||
                (patient.fname?.toLowerCase().includes(lowerSearch) ?? false) ||
                (patient.lname?.toLowerCase().includes(lowerSearch) ?? false) ||
                (patient.nname?.toLowerCase().includes(lowerSearch) ?? false) ||
                (patient.tel1?.includes(lowerSearch) ?? false)
        );
    }, [searchTerm, patients]);

    // Use server-side pagination data directly
    const paginatedData = filteredData;
    const totalPages = paginatedResponse?.totalPages || 0;
    const totalElements = paginatedResponse?.totalElements || 0;

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(0); // Reset to first page
    };

    // Edit handlers
    const handleEditClick = (patient: Patient) => {
        setEditingId(patient.id || null);
        setEditForm({ ...patient });
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const handleEditSave = async () => {
        if (editForm && editForm.id) {
            try {
                // TODO: Call API to update patient
                await patientApi.update(editForm.id, editForm);
                // Refresh data
                const data = await patientApi.getAll(currentPage, pageSize);
                setPaginatedResponse(data);
                setEditingId(null);
                setEditForm(null);
            } catch (err) {
                console.error("Failed to update patient:", err);
            }
        }
    };

    const handleEditChange = (field: keyof Patient, value: string) => {
        if (editForm) {
            setEditForm({ ...editForm, [field]: value });
        }
    };

    // Add new patient handlers
    const handleAddPatient = async () => {
        try {
            // TODO: Call API to create patient
            await patientApi.create(newPatient as CreatePatientRequest);
            // Refresh data
            const data = await patientApi.getAll(currentPage, pageSize);
            setPaginatedResponse(data);
            setNewPatient({
                hn: "",
                fname: "",
                lname: "",
                nname: "",
                tel1: "",
            });
            setIsAddModalOpen(false);
        } catch (err) {
            console.error("Failed to create patient:", err);
        }
    };

    const handleNewPatientChange = (field: keyof Patient, value: string) => {
        setNewPatient({ ...newPatient, [field]: value });
    };

    // Loading state
    if (loading && !paginatedResponse) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                    <svg className="w-8 h-8 animate-spin text-brand-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Loading patients...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <svg className="w-12 h-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
                >
                    Retry
                </button>
            </div>
        );
    }

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
                                Full Name
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Nickname
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Phone Number
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                TAX ID
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Edit
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
                                                    value={editForm?.fname || ""}
                                                    onChange={(e) => handleEditChange("fname", e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                />
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <input
                                                    type="text"
                                                    value={editForm?.lname || ""}
                                                    onChange={(e) => handleEditChange("lname", e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                />
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <input
                                                    type="text"
                                                    value={editForm?.nname || ""}
                                                    onChange={(e) => handleEditChange("nname", e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                />
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <input
                                                    type="text"
                                                    value={editForm?.tel1 || ""}
                                                    onChange={(e) => handleEditChange("tel1", e.target.value)}
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
                                                {patient.fname + " " + patient.lname}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                                {patient.nname}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                                {patient.tel3}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                                {patient.personalid}
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
                        {totalElements > 0 ? currentPage * pageSize + 1 : 0}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                        {Math.min((currentPage + 1) * pageSize, totalElements)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                        {totalElements}
                    </span>{" "}
                    patients
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(0)}
                        disabled={currentPage === 0}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
                    >
                        First
                    </button>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
                    >
                        Previous
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i;
                            } else if (currentPage <= 2) {
                                pageNum = i;
                            } else if (currentPage >= totalPages - 3) {
                                pageNum = totalPages - 5 + i;
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
                                    {pageNum + 1}
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
                                    value={newPatient.fname}
                                    onChange={(e) => handleNewPatientChange("fname", e.target.value)}
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
                                    value={newPatient.lname}
                                    onChange={(e) => handleNewPatientChange("lname", e.target.value)}
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
                                    value={newPatient.nname}
                                    onChange={(e) => handleNewPatientChange("nname", e.target.value)}
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
                                    value={newPatient.tel1}
                                    onChange={(e) => handleNewPatientChange("tel1", e.target.value)}
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
                                disabled={!newPatient.hn || !newPatient.fname || !newPatient.lname}
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
