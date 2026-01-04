import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PatientTablesOne from "../../components/tables/PatientTables/PatientTablesOne";

export default function PatientTable() {

    return (
        <>
            <PageMeta
                title="Patient Tables"
                description="Patient tables - clinic application"
            />
            <PageBreadcrumb pageTitle="Patient Tables" />
            <div className="space-y-6">
                <ComponentCard title="Patient Table">
                    <PatientTablesOne />
                </ComponentCard>
            </div>
        </>
    );
}