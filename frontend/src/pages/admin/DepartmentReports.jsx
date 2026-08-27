import "./DepartmentReports.css";
import { useState, useEffect } from "react";
import { getAllApplications } from "../../api/applicationApi";
import { getAllSchemes } from "../../api/schemeApi";
import { downloadSchemeSummaryPdf, downloadSchemeSummaryExcel } from "../../api/reportApi";

function DepartmentReports() {
    const [applications, setApplications] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        async function loadReportsData() {
            try {
                const [apps, schs] = await Promise.all([
                    getAllApplications().catch(() => []),
                    getAllSchemes().catch(() => []),
                ]);
                setApplications(Array.isArray(apps) ? apps : []);
                setSchemes(Array.isArray(schs) ? schs : []);
            } catch (err) {
                console.error("Failed to load reports data:", err);
            } finally {
                setLoading(false);
            }
        }
        loadReportsData();
    }, []);

    const totalApplications = applications.length;
    const approvedCount = applications.filter(
        (a) => a.status === "APPROVED" || a.status === "VERIFICATION_APPROVED" || a.status === "DISBURSED"
    ).length;
    const pendingCount = applications.filter(
        (a) => a.status === "PENDING_VERIFICATION" || a.status === "SUBMITTED" || a.status === "Forwarded" || !a.status
    ).length;
    const rejectedCount = applications.filter((a) => a.status === "REJECTED").length;

    const handleDownloadPdf = async () => {
        setDownloading(true);
        try {
            const blob = await downloadSchemeSummaryPdf();
            const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "scheme-summary.pdf");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to download PDF report");
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadExcel = async () => {
        setDownloading(true);
        try {
            const blob = await downloadSchemeSummaryExcel();
            const url = window.URL.createObjectURL(
                new Blob([blob], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                })
            );
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "scheme-summary.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to download Excel report");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="container py-5">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 className="text-primary mb-0">Department Reports</h2>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        className="btn btn-outline-danger btn-sm"
                        disabled={downloading}
                        onClick={handleDownloadPdf}
                    >
                        📄 Download PDF Report
                    </button>
                    <button
                        className="btn btn-outline-success btn-sm"
                        disabled={downloading}
                        onClick={handleDownloadExcel}
                    >
                        📊 Download Excel Report
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="report-card">
                        <h3>{totalApplications}</h3>
                        <p>Total Applications</p>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="report-card approved">
                        <h3>{approvedCount}</h3>
                        <p>Approved</p>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="report-card pending">
                        <h3>{pendingCount}</h3>
                        <p>Pending</p>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="report-card rejected">
                        <h3>{rejectedCount}</h3>
                        <p>Rejected</p>
                    </div>
                </div>
            </div>

            <div className="card shadow p-4 mt-4">
                <h4 className="mb-3">Scheme-wise Summary</h4>

                {loading ? (
                    <p>Loading summary...</p>
                ) : (
                    <table className="table table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>Scheme</th>
                                <th>Department</th>
                                <th>Max Grant</th>
                                <th>Total Applications</th>
                            </tr>
                        </thead>

                        <tbody>
                            {schemes.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center" }}>No schemes available.</td>
                                </tr>
                            ) : (
                                schemes.map((scheme) => {
                                    const count = applications.filter(
                                        (a) => a.scheme?.schemeId === scheme.schemeId || a.scheme?.schemeName === scheme.schemeName
                                    ).length;

                                    return (
                                        <tr key={scheme.schemeId}>
                                            <td><strong>{scheme.schemeName}</strong></td>
                                            <td>{scheme.department?.departmentName || "General"}</td>
                                            <td>₹{Number(scheme.maxGrant || 0).toLocaleString("en-IN")}</td>
                                            <td>{count}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default DepartmentReports;