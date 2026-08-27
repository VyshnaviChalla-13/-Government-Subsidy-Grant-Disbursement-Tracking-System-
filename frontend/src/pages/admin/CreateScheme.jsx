import "./CreateScheme.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createScheme } from "../../api/schemeApi";
import { getAllDepartments } from "../../api/departmentApi";

function CreateScheme() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [loadingDepts, setLoadingDepts] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        schemeName: "",
        departmentId: "",
        description: "",
        totalBudget: "",
        minGrant: "",
        maxGrant: "",
        applicationStartDate: new Date().toISOString().split("T")[0],
        applicationEndDate: "",
        eligibilityScore: "50",
        maximumIncome: "",
    });

    useEffect(() => {
        async function fetchDepts() {
            try {
                const data = await getAllDepartments();
                if (Array.isArray(data)) {
                    setDepartments(data);
                    if (data.length > 0) {
                        setFormData((prev) => ({ ...prev, departmentId: String(data[0].departmentId) }));
                    }
                }
            } catch (err) {
                console.error("Failed to load departments:", err);
            } finally {
                setLoadingDepts(false);
            }
        }
        fetchDepts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setErrorMessage("");

        if (!formData.schemeName.trim()) {
            setErrorMessage("Please enter a scheme name.");
            return;
        }

        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        const userId = storedUser?.userId ?? storedUser?.id ?? 1;

        const payload = {
            schemeName: formData.schemeName,
            description: formData.description || "Government welfare scheme.",
            department: {
                departmentId: Number(formData.departmentId) || departments[0]?.departmentId || 1,
            },
            user: {
                userId: Number(userId),
            },
            totalBudget: Number(formData.totalBudget) || 1000000,
            minGrant: Number(formData.minGrant) || 5000,
            maxGrant: Number(formData.maxGrant) || 50000,
            applicationStartDate: formData.applicationStartDate || new Date().toISOString().split("T")[0],
            applicationEndDate: formData.applicationEndDate || "2026-12-31",
            eligibilityScore: Number(formData.eligibilityScore) || 50,
            maximumIncome: formData.maximumIncome ? Number(formData.maximumIncome) : 300000,
            status: "ACTIVE",
        };

        setSubmitting(true);
        try {
            const result = await createScheme(payload);
            setMessage(typeof result === "string" ? result : "Scheme created successfully!");
            setTimeout(() => {
                navigate("/departmentadmin/schemes");
            }, 1200);
        } catch (err) {
            setErrorMessage(err.response?.data?.message || err.response?.data || err.message || "Failed to create scheme.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-primary mb-3">Create Government Scheme</h2>
            <p className="text-muted mb-4">
                Configure a new government subsidy scheme for citizen beneficiaries.
            </p>

            {message && <div className="alert alert-success">{message}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <div className="card shadow p-4">
                <form onSubmit={handleSubmit}>
                    <h4 className="mb-4">Basic Information</h4>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Scheme Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Farmer Assistance Scheme"
                                name="schemeName"
                                value={formData.schemeName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Department *</label>
                            <select
                                className="form-select"
                                name="departmentId"
                                value={formData.departmentId}
                                onChange={handleChange}
                                disabled={loadingDepts}
                            >
                                {departments.map((d) => (
                                    <option key={d.departmentId} value={d.departmentId}>
                                        {d.departmentName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label">Total Scheme Budget (₹) *</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g. 5000000"
                                name="totalBudget"
                                value={formData.totalBudget}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label">Min Grant (₹) *</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g. 5000"
                                name="minGrant"
                                value={formData.minGrant}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label">Max Grant (₹) *</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g. 50000"
                                name="maxGrant"
                                value={formData.maxGrant}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Application Start Date *</label>
                            <input
                                type="date"
                                className="form-control"
                                name="applicationStartDate"
                                value={formData.applicationStartDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Application End Date *</label>
                            <input
                                type="date"
                                className="form-control"
                                name="applicationEndDate"
                                value={formData.applicationEndDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <hr />

                    <h4 className="mb-4">Description & Eligibility</h4>

                    <div className="mb-3">
                        <label className="form-label">Scheme Description</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Detailed overview and purpose of the welfare scheme..."
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Max Household Annual Income (₹)</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g. 300000"
                                name="maximumIncome"
                                value={formData.maximumIncome}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Minimum Eligibility Score (0 - 100)</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="50"
                                name="eligibilityScore"
                                value={formData.eligibilityScore}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? "Publishing..." : "Publish Scheme"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateScheme;