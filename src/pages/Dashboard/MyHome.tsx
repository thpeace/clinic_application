import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";


export default function MyHome() {
    const [title, setTitle] = useState("Dashboard Clinic");
    const [description, setDescription] = useState("");
    return (
        <>
            <PageMeta
                title={title}
                description={description}>
                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    <div className="col-span-12 space-y-6 xl:col-span-7">
                        {/* Customer | Order | Appointment */}
                    </div>

                    <div className="col-span-12 xl:col-span-5">
                        {/*  */}
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