import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function ProfilesTables() {

  return (
    <>
      <PageMeta
        title="Profiles Tables"
        description="Profiles table - clinic application"
      />
      <PageBreadcrumb pageTitle="Profiles Tables" />
      <div className="space-y-6">
        <ComponentCard title="Users">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
