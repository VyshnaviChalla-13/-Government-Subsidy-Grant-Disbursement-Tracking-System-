import "./ApplyScheme.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submitApplication } from "../../api/applicationApi";
import { getSchemeById, getAllSchemes } from "../../api/schemeApi";
import { getUserById } from "../../api/userApi";
import { uploadDocument } from "../../api/documentApi";
import {
    AlertTriangle,
    Building2,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    CreditCard,
    FilePlus2,
    FileText,
    Image,
    IndianRupee,
    Save,
    Send,
    ShieldCheck,
    Upload,
    UserRound,
} from "lucide-react";

const INITIAL_FORM_VALUES = {
    fullName: "", aadhaarNumber: "", mobileNumber: "", email: "", dateOfBirth: "",
    gender: "", annualIncome: "", occupation: "", address: "", district: "", state: "", pincode: "",
};

const DOCUMENT_FIELDS = [
    { name: "aadhaarCard", label: "Aadhaar Card", description: "Upload a clear identity document", icon: CreditCard },
    { name: "incomeCertificate", label: "Income Certificate", description: "Upload your latest certificate", icon: FileText },
    { name: "bankPassbook", label: "Bank Passbook", description: "Upload the account details page", icon: Image },
];

const FIELD_ORDER = ["fullName", "aadhaarNumber", "mobileNumber", "email", "dateOfBirth", "gender", "annualIncome", "occupation", "address", "district", "state", "pincode", "aadhaarCard", "incomeCertificate", "bankPassbook", "declaration"];
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const getAge = (dateOfBirth) => {
    const birthDate = new Date(`${dateOfBirth}T00:00:00`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age -= 1;
    return age;
};

const validateField = (name, value) => {
    const trimmedValue = typeof value === "string" ? value.trim() : value;

    switch (name) {
        case "fullName":
            if (!trimmedValue) return "Full name is required.";
            if (!/^[A-Za-z ]+$/.test(trimmedValue)) return "Use letters and spaces only.";
            if (trimmedValue.length < 3 || trimmedValue.length > 100) return "Full name must be between 3 and 100 characters.";
            return "";
        case "aadhaarNumber":
            return /^\d{12}$/.test(trimmedValue) ? "" : "Enter a valid 12-digit Aadhaar number.";
        case "mobileNumber":
            return /^[6-9]\d{9}$/.test(trimmedValue) ? "" : "Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.";
        case "email":
            return !trimmedValue || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue) ? "" : "Enter a valid email address.";
        case "dateOfBirth": {
            if (!trimmedValue) return "Date of birth is required.";
            const date = new Date(`${trimmedValue}T00:00:00`);
            if (Number.isNaN(date.getTime()) || date > new Date()) return "Date of birth cannot be in the future.";
            return getAge(trimmedValue) >= 18 ? "" : "Applicant must be at least 18 years old.";
        }
        case "gender": return trimmedValue ? "" : "Please select a gender.";
        case "annualIncome":
            if (trimmedValue === "") return "Annual income is required.";
            return /^\d+(\.\d+)?$/.test(trimmedValue) && Number(trimmedValue) >= 0 ? "" : "Enter a valid non-negative annual income.";
        case "occupation": return trimmedValue ? "" : "Occupation is required.";
        case "address":
            if (!trimmedValue) return "Address is required.";
            return trimmedValue.length >= 10 ? "" : "Address must be at least 10 characters.";
        case "district": return trimmedValue ? "" : "District is required.";
        case "state": return trimmedValue ? "" : "State is required.";
        case "pincode": return /^\d{6}$/.test(trimmedValue) ? "" : "Enter a valid 6-digit pincode.";
        default: return "";
    }
};

const validateDocument = (file) => {
    if (!file) return "This document is required.";
    if (!ALLOWED_FILE_TYPES.includes(file.type)) return "Upload a PDF, JPG, JPEG, or PNG file.";
    if (file.size > MAX_FILE_SIZE) return "File size must not exceed 5 MB.";
    return "";
};

function ApplyScheme() {
    const location = useLocation();
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
    const [documents, setDocuments] = useState({ aadhaarCard: null, incomeCertificate: null, bankPassbook: null });
    const [declaration, setDeclaration] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [submissionError, setSubmissionError] = useState("");
    const [scheme, setScheme] = useState(null);

    useEffect(() => {
        async function loadInitialData() {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user") || "null");
                const userId = storedUser?.userId ?? storedUser?.id;
                if (userId) {
                    const userProfile = await getUserById(userId);
                    if (userProfile) {
                        setFormValues((prev) => ({
                            ...prev,
                            fullName: userProfile.fullName || prev.fullName,
                            mobileNumber: userProfile.mobileNumber || prev.mobileNumber,
                            email: userProfile.email || prev.email,
                            annualIncome: userProfile.annualIncome != null ? String(userProfile.annualIncome) : prev.annualIncome,
                            occupation: userProfile.occupation || prev.occupation,
                            address: userProfile.address || prev.address,
                            pincode: userProfile.pincode || prev.pincode,
                        }));
                    }
                }

                const sId = location.state?.schemeId;
                if (sId) {
                    const sData = await getSchemeById(sId);
                    setScheme(sData);
                } else {
                    const allSchemes = await getAllSchemes();
                    if (Array.isArray(allSchemes) && allSchemes.length > 0) {
                        setScheme(allSchemes[0]);
                    }
                }
            } catch (err) {
                console.error("Error loading initial scheme or user data:", err);
            }
        }

        loadInitialData();
    }, [location.state]);

    const schemeDetails = [
        { label: "Department", value: scheme?.department?.departmentName || "General Welfare", icon: Building2 },
        { label: "Grant Amount", value: scheme?.maxGrant ? `Up to ₹${Number(scheme.maxGrant).toLocaleString("en-IN")}` : "Up to ₹50,000", icon: IndianRupee },
        { label: "Application Deadline", value: scheme?.applicationEndDate || "Open", icon: CalendarDays },
        { label: "Scheme Category", value: scheme?.schemeName || "Government Subsidy", icon: FileText },
    ];

    const handleFieldChange = ({ target }) => {
        const { name, value } = target;
        setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
        setTouched((currentTouched) => ({ ...currentTouched, [name]: true }));
        setErrors((currentErrors) => ({ ...currentErrors, [name]: validateField(name, value) }));
        setSubmissionSuccess(false);
        setSubmissionError("");
    };

    const handleDocumentChange = ({ target }) => {
        const { name, files } = target;
        const file = files?.[0] || null;
        setDocuments((currentDocuments) => ({ ...currentDocuments, [name]: file }));
        setTouched((currentTouched) => ({ ...currentTouched, [name]: true }));
        setErrors((currentErrors) => ({ ...currentErrors, [name]: validateDocument(file) }));
        setSubmissionSuccess(false);
        setSubmissionError("");
    };

    const handleDeclarationChange = ({ target }) => {
        const isAccepted = target.checked;
        setDeclaration(isAccepted);
        setTouched((currentTouched) => ({ ...currentTouched, declaration: true }));
        setErrors((currentErrors) => ({ ...currentErrors, declaration: isAccepted ? "" : "You must accept the declaration before submitting." }));
        setSubmissionSuccess(false);
        setSubmissionError("");
    };

    const validateForm = () => {
        const validationErrors = {};
        Object.entries(formValues).forEach(([name, value]) => { validationErrors[name] = validateField(name, value); });
        Object.entries(documents).forEach(([name, file]) => { validationErrors[name] = validateDocument(file); });
        validationErrors.declaration = declaration ? "" : "You must accept the declaration before submitting.";
        return validationErrors;
    };

    const focusFirstInvalidField = (validationErrors) => {
        const firstInvalidField = FIELD_ORDER.find((name) => validationErrors[name]);
        const fieldId = firstInvalidField === "declaration" ? "application-declaration" : firstInvalidField;
        const field = document.getElementById(fieldId);
        field?.scrollIntoView({ behavior: "smooth", block: "center" });
        field?.focus({ preventScroll: true });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateForm();
        const hasValidationErrors = Object.values(validationErrors).some(Boolean);
        setErrors(validationErrors);
        setTouched(Object.fromEntries(FIELD_ORDER.map((name) => [name, true])));
        setSubmissionSuccess(false);
        setSubmissionError("");

        if (hasValidationErrors) {
            focusFirstInvalidField(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem("user") || "null");
            const beneficiaryId =
                storedUser?.userId ??
                storedUser?.id ??
                localStorage.getItem("userId");
            const schemeId = scheme?.schemeId || location.state?.schemeId || 1;

            if (!beneficiaryId) {
                throw new Error("Unable to identify the beneficiary. Please sign in again.");
            }

            const documentNames = Object.fromEntries(
                Object.entries(documents).map(([name, file]) => [name, file?.name])
            );

            const result = await submitApplication(beneficiaryId, schemeId, {
                ...formValues,
                documents: documentNames,
                declaration,
            });

            setSubmissionSuccess(true);
        } catch (err) {
            setSubmissionError(err.response?.data || err.message || "Unable to submit your application.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const getValidationClass = (name) => {
        if (!touched[name]) return "";
        return errors[name] ? "is-invalid" : "is-valid";
    };

    return (
        <div className="apply-page">
            <div className="container py-4 py-md-5">
                <section className="apply-hero">
                    <div className="apply-hero-content"><span className="apply-eyebrow">Beneficiary Services</span><h1>Apply for Government Scheme</h1><p>Complete the application form carefully before submitting. Keep your supporting documents ready for a smooth review.</p></div>
                    <div className="apply-hero-icon" aria-hidden="true"><FilePlus2 size={82} strokeWidth={1.5} /></div>
                </section>

                <section className="apply-scheme-card"><div className="apply-card-heading"><div className="apply-heading-icon"><ClipboardCheck size={21} aria-hidden="true" /></div><div><span className="apply-section-kicker">Selected scheme</span><h2>Farmer Assistance Scheme</h2></div><span className="apply-open-badge"><CheckCircle2 size={16} aria-hidden="true" /> Open for applications</span></div><div className="apply-scheme-details">{schemeDetails.map(({ label, value, icon: Icon }) => <div className="apply-scheme-detail" key={label}><Icon size={20} aria-hidden="true" /><div><span>{label}</span><strong>{value}</strong></div></div>)}</div></section>

                <form noValidate onSubmit={handleSubmit}>
                    {submissionSuccess && <div className="alert alert-success apply-success-alert" role="alert"><CheckCircle2 size={19} aria-hidden="true" /> Your application has been submitted successfully.</div>}
                    {submissionError && <div className="alert alert-danger" role="alert">{submissionError}</div>}
                    <div className="apply-form-layout">
                        <section className="apply-card applicant-card">
                            <div className="apply-card-heading"><div className="apply-heading-icon"><UserRound size={21} aria-hidden="true" /></div><div><span className="apply-section-kicker">Applicant details</span><h2>Applicant Information</h2></div></div>
                            <div className="row">
                                <FormField label="Full Name" name="fullName" icon={UserRound} value={formValues.fullName} error={errors.fullName} validationClass={getValidationClass("fullName")} onChange={handleFieldChange} placeholder="Enter your name" />
                                <FormField label="Aadhaar Number" name="aadhaarNumber" icon={CreditCard} value={formValues.aadhaarNumber} error={errors.aadhaarNumber} validationClass={getValidationClass("aadhaarNumber")} onChange={handleFieldChange} placeholder="12 Digit Aadhaar" inputMode="numeric" />
                                <FormField label="Mobile Number" name="mobileNumber" icon={UserRound} value={formValues.mobileNumber} error={errors.mobileNumber} validationClass={getValidationClass("mobileNumber")} onChange={handleFieldChange} placeholder="Enter mobile number" inputMode="numeric" />
                                <FormField label="Email Address" name="email" icon={FileText} type="email" value={formValues.email} error={errors.email} validationClass={getValidationClass("email")} onChange={handleFieldChange} placeholder="name@example.com" />
                                <FormField label="Date of Birth" name="dateOfBirth" icon={CalendarDays} type="date" value={formValues.dateOfBirth} error={errors.dateOfBirth} validationClass={getValidationClass("dateOfBirth")} onChange={handleFieldChange} />
                                <SelectField label="Gender" name="gender" icon={UserRound} value={formValues.gender} error={errors.gender} validationClass={getValidationClass("gender")} onChange={handleFieldChange} options={["Male", "Female", "Other", "Prefer not to say"]} />
                                <FormField label="Annual Income" name="annualIncome" icon={IndianRupee} type="number" value={formValues.annualIncome} error={errors.annualIncome} validationClass={getValidationClass("annualIncome")} onChange={handleFieldChange} placeholder="Annual Income" min="0" />
                                <FormField label="Occupation" name="occupation" icon={Building2} value={formValues.occupation} error={errors.occupation} validationClass={getValidationClass("occupation")} onChange={handleFieldChange} placeholder="Occupation" />
                                <FormField label="Address" name="address" icon={FileText} value={formValues.address} error={errors.address} validationClass={getValidationClass("address")} onChange={handleFieldChange} placeholder="Address" />
                                <FormField label="District" name="district" icon={Building2} value={formValues.district} error={errors.district} validationClass={getValidationClass("district")} onChange={handleFieldChange} placeholder="District" />
                                <FormField label="State" name="state" icon={Building2} value={formValues.state} error={errors.state} validationClass={getValidationClass("state")} onChange={handleFieldChange} placeholder="State" />
                                <FormField label="Pincode" name="pincode" icon={FileText} value={formValues.pincode} error={errors.pincode} validationClass={getValidationClass("pincode")} onChange={handleFieldChange} placeholder="6 Digit Pincode" inputMode="numeric" />
                            </div>
                        </section>

                        <aside className="apply-side-stack"><section className="apply-card eligibility-card"><div className="apply-card-heading"><div className="apply-heading-icon success"><ShieldCheck size={21} aria-hidden="true" /></div><div><span className="apply-section-kicker">Eligibility review</span><h2>Eligibility Information</h2></div></div><div className="eligibility-message"><CheckCircle2 size={21} aria-hidden="true" /><div><strong>You can continue your application</strong><p>Ensure that your submitted information and documents meet the scheme requirements.</p></div></div></section><section className="apply-card preview-card"><div className="apply-card-heading"><div className="apply-heading-icon"><FileText size={21} aria-hidden="true" /></div><div><span className="apply-section-kicker">Before you submit</span><h2>Application Preview</h2></div></div><div className="apply-preview-list"><div><span>Scheme</span><strong>Farmer Assistance Scheme</strong></div><div><span>Applicant</span><strong>{formValues.fullName || "To be provided in the form"}</strong></div><div><span>Documents</span><strong>{Object.values(documents).filter(Boolean).length} of 3 selected</strong></div><div><span>Application Date</span><strong>On submission</strong></div></div></section></aside>
                    </div>

                    <section className="apply-card upload-section"><div className="apply-card-heading"><div className="apply-heading-icon"><Upload size={21} aria-hidden="true" /></div><div><span className="apply-section-kicker">Supporting documents</span><h2>Upload Documents</h2><p>Upload clear, valid copies in PDF, JPG, JPEG, or PNG format (maximum 5 MB).</p></div></div><div className="row">{DOCUMENT_FIELDS.map(({ name, label, description, icon: Icon }) => <div className="col-lg-4 mb-3 mb-lg-0" key={name}><div className="upload-document-card"><div className="upload-document-icon"><Icon size={23} aria-hidden="true" /></div><div className="upload-document-copy"><label htmlFor={name}>{label}</label><span>{description}</span></div><input id={name} name={name} type="file" className={`form-control ${getValidationClass(name)}`} accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocumentChange} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} />{errors[name] && touched[name] && <div id={`${name}-error`} className="invalid-feedback d-block">{errors[name]}</div>}{documents[name] && !errors[name] && <div className="valid-feedback d-block">{documents[name].name} selected successfully.</div>}<div className="upload-document-footer"><Upload size={15} aria-hidden="true" /> Select file to upload</div></div></div>)}</div></section>

                    <section className="apply-declaration-card"><div className="declaration-icon"><AlertTriangle size={21} aria-hidden="true" /></div><div><h2>Declaration</h2><p>I confirm that the information provided in this application is accurate and that the documents submitted are valid.</p></div><div className="form-check"><input className={`form-check-input ${getValidationClass("declaration")}`} type="checkbox" id="application-declaration" checked={declaration} onChange={handleDeclarationChange} aria-invalid={Boolean(errors.declaration)} aria-describedby={errors.declaration ? "declaration-error" : undefined} /><label className="form-check-label" htmlFor="application-declaration">I agree to the declaration</label>{errors.declaration && touched.declaration && <div id="declaration-error" className="invalid-feedback d-block">{errors.declaration}</div>}</div></section>

                    <div className="apply-form-actions"><button type="button" className="save-draft-btn"><Save size={18} aria-hidden="true" /> Save Draft</button><button type="submit" className="submit-application-btn" disabled={isSubmitting}>{isSubmitting ? "Submitting Application..." : <><Send size={18} aria-hidden="true" /> Submit Application</>}</button></div>
                </form>
            </div>
        </div>
    );
}

function FormField({ label, name, icon: Icon, type = "text", value, error, validationClass, onChange, placeholder, inputMode, min }) {
    const id = name;
    return <div className="col-md-6 mb-3"><label className="form-label" htmlFor={id}><Icon size={16} aria-hidden="true" /> {label}</label><input id={id} name={name} type={type} value={value} onChange={onChange} className={`form-control ${validationClass}`} placeholder={placeholder} inputMode={inputMode} min={min} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />{error && validationClass === "is-invalid" && <div id={`${id}-error`} className="invalid-feedback">{error}</div>}</div>;
}

function SelectField({ label, name, icon: Icon, value, error, validationClass, onChange, options }) {
    return <div className="col-md-6 mb-3"><label className="form-label" htmlFor={name}><Icon size={16} aria-hidden="true" /> {label}</label><select id={name} name={name} value={value} onChange={onChange} className={`form-select ${validationClass}`} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined}><option value="">Select gender</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>{error && validationClass === "is-invalid" && <div id={`${name}-error`} className="invalid-feedback">{error}</div>}</div>;
}

export default ApplyScheme;
