import { useTranslation } from 'react-i18next';

/**
 * 🌐 Translation Examples Component
 * 
 * This component demonstrates various ways to use translations in your app.
 */
export default function TranslationExamples() {
    const { t, i18n } = useTranslation();

    // Example 1: Basic translation
    const signIn = t('auth.signIn'); // "Sign In" or "เข้าสู่ระบบ"

    // Example 2: Translation with variables (interpolation)
    const minLength = t('validation.minLength', { min: 8 });
    // "Must be at least 8 characters" or "ต้องมีอย่างน้อย 8 ตัวอักษร"

    // Example 3: Get current language
    const currentLanguage = i18n.language; // "en" or "th"

    // Example 4: Change language programmatically
    const switchToThai = () => {
        i18n.changeLanguage('th');
    };

    const switchToEnglish = () => {
        i18n.changeLanguage('en');
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">
                {/* ✅ Basic translation */}
                {t('dashboard.welcome')}
            </h1>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                    {t('patient.patientList')}
                </h2>

                {/* ✅ Conditional rendering based on data */}
                <p className="text-gray-500">
                    {/* This shows: "No patients found" or "ไม่พบผู้ป่วย" */}
                    {t('patient.noPatients')}
                </p>
            </div>

            {/* ✅ Using translations in attributes */}
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                title={t('common.save')} // Tooltip translation
            >
                {t('common.save')}
            </button>

            {/* ✅ Using translations in form validation */}
            <div>
                <input
                    type="email"
                    placeholder={t('auth.enterEmail')}
                    required
                />
                <span className="text-red-500 text-sm">
                    {t('validation.invalidEmail')}
                </span>
            </div>

            {/* ✅ Multiple translations in one component */}
            <div className="border p-4 rounded">
                <h3>{t('product.productDetails')}</h3>
                <p><strong>{t('product.name')}:</strong> Example Product</p>
                <p><strong>{t('product.price')}:</strong> $99.99</p>
                <p><strong>{t('product.status')}:</strong> {t('product.active')}</p>
            </div>

            {/* ✅ Current language display */}
            <p>Current Language: <strong>{currentLanguage}</strong></p>

            {/* ✅ Programmatic language switching */}
            <div className="flex gap-2">
                <button
                    onClick={switchToEnglish}
                    className="px-4 py-2 bg-gray-200 rounded"
                >
                    Switch to English
                </button>
                <button
                    onClick={switchToThai}
                    className="px-4 py-2 bg-gray-200 rounded"
                >
                    Switch to ภาษาไทย
                </button>
            </div>

            {/* ✅ Translation with interpolation (variables) */}
            <div>
                <p>{t('validation.minLength', { min: 6 })}</p>
                <p>{t('validation.maxLength', { max: 100 })}</p>
            </div>

            {/* ✅ Navigation translations */}
            <nav className="flex gap-4">
                <a href="/dashboard">{t('nav.dashboard')}</a>
                <a href="/patients">{t('nav.patients')}</a>
                <a href="/products">{t('nav.products')}</a>
                <a href="/profile">{t('nav.profile')}</a>
            </nav>
        </div>
    );
}
