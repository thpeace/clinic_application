import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";

export default function PatientInfo() {

    return (
        <>
            <ComponentCard title="Patient Info">
                <div className="space-y-6">
                    <Label htmlFor="hn">HN</Label>
                    <Input type="text" id="hn" />
                </div>
            </ComponentCard>
        </>
    );
}