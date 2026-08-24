import "./BrowseSchemes.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllSchemes } from "../../api/schemeApi";
import { Search, Building2, IndianRupee, CalendarDays, ArrowRight, FileText } from "lucide-react";

function BrowseSchemes() {
    const navigate = useNavigate();
    const location = useLocation();
    const fromPublic = location.state?.fromPublic || false;
    const [schemes, setSchemes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getAllSchemes();
                setSchemes(Array.isArray(data) ? data : []);
            } catch {
                setError("We couldn't load schemes right now. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSchemes();
    }, []);

    const departments = useMemo(
        () => [...new Set(schemes.map((scheme) => scheme.department?.departmentName).filter(Boolean))],
        [schemes]
    );

    const filteredSchemes = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return schemes.filter((scheme) => {
            const departmentName = scheme.department?.departmentName || "";
            const matchesSearch = !query ||
                scheme.schemeName?.toLowerCase().includes(query) ||
                departmentName.toLowerCase().includes(query);
            const matchesDepartment = selectedDepartment === "All Departments" ||
                departmentName === selectedDepartment;

            return matchesSearch && matchesDepartment;
        });
    }, [schemes, searchTerm, selectedDepartment]);

    const formatAmount = (amount) => new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount));

    const formatDeadline = (date) => {
        if (!date) return "Not available";

        const parsedDate = new Date(`${date}T00:00:00`);
        return Number.isNaN(parsedDate.getTime())
            ? "Not available"
            : new Intl.DateTimeFormat("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }).format(parsedDate);
    };

    return (
        <div className="browse-page">
            <div className="container py-4">
                <div className="browse-hero">
                    <div>
                        <span className="browse-tag">Government Welfare Portal</span>
                        <h1>Browse Government Schemes</h1>
                        <p>Explore available welfare schemes, check eligibility, and apply online in just a few clicks.</p>
                    </div>
                </div>

                <div className="search-section">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search schemes..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>

                    <select
                        className="filter-dropdown"
                        value={selectedDepartment}
                        onChange={(event) => setSelectedDepartment(event.target.value)}
                    >
                        <option>All Departments</option>
                        {departments.map((department) => (
                            <option key={department}>{department}</option>
                        ))}
                    </select>
                </div>

                <div className="row mt-4">
                    {loading ? (
                        <div className="col-12 text-center text-muted py-5">Loading available schemes...</div>
                    ) : error ? (
                        <div className="col-12 text-center text-muted py-5">{error}</div>
                    ) : filteredSchemes.length > 0 ? (
                        filteredSchemes.map((scheme) => (
                            <div className="col-lg-6 col-md-6 mb-4" key={scheme.schemeId}>
                                <div className="scheme-card">
                                    <div className="scheme-header">
                                        <div className="scheme-icon"><FileText size={32} /></div>
                                        <div>
                                            <h4>{scheme.schemeName}</h4>
                                            <span>Government Scheme</span>
                                        </div>
                                    </div>

                                    <div className="scheme-info">
                                        <div className="info-row">
                                            <Building2 size={18} />
                                            <span>{scheme.department?.departmentName}</span>
                                        </div>
                                        <div className="info-row">
                                            <IndianRupee size={18} />
                                            <span>{formatAmount(scheme.maxGrant)}</span>
                                        </div>
                                        <div className="info-row">
                                            <CalendarDays size={18} />
                                            <span>Last Date : {formatDeadline(scheme.applicationEndDate)}</span>
                                        </div>
                                    </div>

                                    <div className="scheme-actions">
                                        <button
                                            className="details-btn"
                                            onClick={() => navigate(`/beneficiary/schemes/${scheme.schemeId}`, {
                                                state: { fromPublic }
                                            })}
                                        >
                                            View Details
                                            <ArrowRight size={16} />
                                        </button>

                                        <button
                                            className="apply-btn"
                                            onClick={() => {
                                                if (fromPublic) {
                                                    navigate("/login", {
                                                        state: { fromApply: true, schemeId: scheme.schemeId }
                                                    });
                                                } else {
                                                    navigate("/beneficiary/apply", {
                                                        state: { schemeId: scheme.schemeId }
                                                    });
                                                }
                                            }}
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center text-muted py-5">
                            No schemes found matching your search or filter.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BrowseSchemes;
