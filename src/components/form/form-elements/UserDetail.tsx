import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import { EyeCloseIcon, EyeIcon, TimeIcon } from "../../../icons";
import DatePicker from "../date-picker.tsx";
import InputStates from "./InputStates.tsx";
import TextArea from "../input/TextArea.tsx";


export default function UserDetail() {
    const [showPassword, setShowPassword] = useState(false);
    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };
    const [message, setMessage] = useState("");
    const [messageTwo, setMessageTwo] = useState("");
    return (
        <ComponentCard title="Profile Detail">
            <div className="space-y-4">
                <Label>First Name</Label>
                <Input type="text" placeholder="Full Name" />
                <Label>Last Name</Label>
                <Input type="text" placeholder="Last Name" />
                <div>
                    <Label>Password</Label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                        />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                            {showPassword ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            )}
                        </button>
                    </div>
                </div>
                <div className="space-y-6">
                    {/* Default TextArea */}
                    <div>
                        <Label>Description</Label>
                        <TextArea
                            value={message}
                            onChange={(value) => setMessage(value)}
                            rows={6}
                        />
                    </div>

                    {/* Disabled TextArea */}
                    {/* <div>
                        <Label>Description</Label>
                        <TextArea rows={6} disabled />
                    </div> */}

                    {/* Error TextArea */}
                    {/* <div>
                        <Label>Description</Label>
                        <TextArea
                            rows={6}
                            value={messageTwo}
                            error
                            onChange={(value) => setMessageTwo(value)}
                            hint="Please enter a valid message."
                        />
                    </div> */}
                </div>
            </div>
        </ComponentCard>
    );
}