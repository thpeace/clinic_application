import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { useUser } from "../hooks/useUser";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function UserProfiles() {
  const { t } = useTranslation()
  // Use the custom useUser hook for data fetching
  const { user, isLoading, error } = useUser();
  const [title, setTitle] = useState("")

  useEffect(() => {
    setTitle(t("profile.title"))
  }, [t])

  return (
    <>
      <PageMeta
        title={title}
        description=""
      />
      <PageBreadcrumb pageTitle={title} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          {title}
        </h3>
        <div className="space-y-6">
          {isLoading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {user && (
            <>
              <UserMetaCard dataUser={user} />
              <UserInfoCard dataUser={user} />
              <UserAddressCard dataUser={user} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
