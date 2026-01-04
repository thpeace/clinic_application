import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

export default function PatientProfile() {
    return (
        <>
            <PageMeta title="Patient Profile" description={""} />
            <PageBreadcrumb pageTitle="Patient" />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            </div>
        </>
    );
}