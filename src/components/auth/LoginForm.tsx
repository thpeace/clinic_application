import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { Link } from "react-router";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import LanguageSwitcher from "../common/LanguageSwitcher";

export default function LoginForm() {
    // 🌐 Use translation hook
    const { t } = useTranslation();

    // 🔐 Auth hook
    const { login, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [validationError, setValidationError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        clearError();
        setValidationError("");

        // Validation
        if (!username.trim()) {
            setValidationError(t('validation.required'));
            return;
        }

        if (!password) {
            setValidationError(t('validation.required'));
            return;
        }

        try {
            // Call login API
            await login({ username: username.trim(), password });

            // On success, navigate to dashboard
            navigate("/");
        } catch (err) {
            // Error is handled by AuthContext and displayed below
            console.error("Login failed:", err);
        }
    };

    return (
        <>
            <div className="flex flex-col flex-1">
                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <div>
                        {/* Language Switcher at top right */}
                        <div className="flex justify-end mb-4">
                            <LanguageSwitcher />
                        </div>

                        <div className="mb-5 sm:mb-8">
                            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                {/* 🌐 Translation: t('key') */}
                                {t('auth.signInTitle')}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {/* 🌐 This will show Thai or English based on selected language */}
                                {t('auth.signInSubtitle')}
                            </p>
                        </div>

                        {/* Error Messages */}
                        {(error || validationError) && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {error || validationError}
                                </p>
                            </div>
                        )}

                        <div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
                                {/* Social login buttons commented out */}
                            </div>
                            <div className="relative py-3 sm:py-5">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <div>
                                        <Label>
                                            {/* 🌐 Use translation for labels */}
                                            {t('auth.username')} <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <Input
                                            placeholder={t('auth.enterUsername')}
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <Label>
                                            {/* 🌐 Password label */}
                                            {t('auth.password')} <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder={t('auth.enterPassword')}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={isLoading}
                                            />
                                            <span
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                            >
                                                {showPassword ? (
                                                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                ) : (
                                                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Checkbox checked={isChecked} onChange={setIsChecked} />
                                            <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                                                {/* 🌐 Remember me translation */}
                                                {t('auth.rememberMe')}
                                            </span>
                                        </div>
                                        <Link
                                            to="/reset-password"
                                            className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                        >
                                            {/* 🌐 Forgot password link */}
                                            {t('auth.forgotPassword')}
                                        </Link>
                                    </div>
                                    <div>
                                        <Button
                                            className="w-full"
                                            size="sm"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            fill="none"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    {t('common.loading')}
                                                </span>
                                            ) : (
                                                <>
                                                    {/* 🌐 Sign in button */}
                                                    {t('auth.signIn')}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>

                            {/* Sign up link (commented out) */}
                            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                {t('auth.noAccount')} {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  {t('auth.signUp')}
                </Link>
              </p>
            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
