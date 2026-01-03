import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FilterTableOne from "../../components/tables/FiltersTables/FilterTableOne";

export default function FiltersTable() {
    return (
        <>
            <PageMeta
                title="Filters Tables"
                description="Filters tables - clinic application"
            />
            <PageBreadcrumb pageTitle="Filters Tables" />
            <div className="space-y-6">
                <ComponentCard title="Filters Table">
                    <FilterTableOne />
                </ComponentCard>
            </div>
        </>
    );
}