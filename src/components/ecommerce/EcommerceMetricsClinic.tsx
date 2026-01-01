import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { useTranslation } from "react-i18next";

interface EcommerceMetricsClinicProps {
  totalPatients: number;
  totalPatientsToday: number;
}

export default function EcommerceMetricsClinic({ totalPatients, totalPatientsToday }: EcommerceMetricsClinicProps) {

  const { t } = useTranslation();

  const [order, setOrder] = useState("0");
  const [customer, setCustomer] = useState("0");
  const [percentOrder, setPercentOrder] = useState("0");
  const [percentCustomer, setPercentCustomer] = useState("0");

  useEffect(() => {
    // Guard against division by zero
    const percentCustomer = totalPatients > 0
      ? ((totalPatientsToday / totalPatients) * 100).toFixed(2)
      : "0";
    setOrder("123");
    setCustomer(totalPatients.toString());
    setPercentCustomer(percentCustomer);
    setPercentOrder("9.05");
  }, [totalPatients, totalPatientsToday]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("dashboard.customers")}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {customer}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {percentCustomer}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("dashboard.orders")}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {order}
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            {percentOrder}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
