import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import EcommerceMetricsClinic from "../../components/ecommerce/EcommerceMetricsClinic";
import MonthlyTargetClinic from "../../components/ecommerce/MonthlyTargetClinic";
import MonthlySalesChartClinic from "../../components/ecommerce/MonthlySalesChartClinic";

export default function MyHome() {
    // const [title, setTitle] = useState("");
    // const [description, setDescription] = useState("");

    useEffect(() => {
        const loadData = async () => {
            // setTitle("Dashboard Clinic");
            // setDescription("Dashboard Clinic");
        };
        loadData();
    }, []);

    return (
        <>
            {/* This for dashboard page */}
            <PageMeta
                title="Dashboard Clinic"
                description="Dashboard Clinic">
                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    <div className="col-span-12 space-y-6 xl:col-span-7">
                        {/* Customer | Order | Appointment */}
                        <EcommerceMetricsClinic />
                        <MonthlySalesChartClinic />
                    </div>

                    <div className="col-span-12 xl:col-span-5">
                        {/*  */}
                        <MonthlyTargetClinic />
                    </div>

                    <div className="col-span-12">
                        {/*  */}

                    </div>

                    <div className="col-span-12 xl:col-span-5">
                        {/*  */}
                    </div>

                    <div className="col-span-12 xl:col-span-7">
                        {/*  */}
                    </div>
                </div>
            </PageMeta>
        </>
    );
}