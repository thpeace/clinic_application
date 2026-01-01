import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import EcommerceMetricsClinic from "../../components/ecommerce/EcommerceMetricsClinic";
import MonthlyTargetClinic from "../../components/ecommerce/MonthlyTargetClinic";
import MonthlySalesChartClinic from "../../components/ecommerce/MonthlySalesChartClinic";
import patientApi from "../../api/patientApi";
import type { Patient } from "../../types/patient";

export default function MyHome() {
    const [totalPatients, setTotalPatients] = useState<number>(0);
    const [totalPatientsToday, setTotalPatientsToday] = useState<number>(0);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const totalPatients = await patientApi.getTotalPatients();
                const totalPatientsToday = await patientApi.getTotalPatientsToday();
                setTotalPatients(totalPatients);
                setTotalPatientsToday(totalPatientsToday);
                console.log('Patients data:', totalPatients);
                console.log('Patients data today:', totalPatientsToday);
            } catch (err) {
                console.error('Failed to fetch patients:', err);
            }
        };

        fetchPatients();
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
                        <EcommerceMetricsClinic totalPatients={totalPatients} totalPatientsToday={totalPatientsToday} />
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