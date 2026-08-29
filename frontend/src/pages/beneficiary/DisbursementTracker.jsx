import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  Landmark,
  LockKeyhole,
  Upload,
  View,
} from "lucide-react";
import { getApplicationMilestones } from "../../api/applicationApi";

const statusMeta = {
  PENDING: { label: "Pending", icon: Clock3, className: "pending" },
  COMPLETED: { label: "Completed", icon: CheckCircle2, className: "completed" },
  RELEASED: { label: "Released", icon: CircleDollarSign, className: "released" },
  OVERDUE: { label: "Overdue", icon: Clock3, className: "overdue" },
  LOCKED: { label: "Locked", icon: LockKeyhole, className: "locked" },
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function DisbursementTracker() {
  const applicationId = new URLSearchParams(window.location.search).get("applicationId");
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(Boolean(applicationId));
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadMilestones = async () => {
      try {
        setLoading(true);
        setError("");
        let targetAppId = applicationId;

        if (!targetAppId) {
          try {
            const myApps = await getMyApplications();
            const list = Array.isArray(myApps) ? myApps : myApps?.applications;
            if (list && list.length > 0) {
              targetAppId = list[0].applicationId || list[0].id;
            }
          } catch (e) {
            console.error("Failed to load user applications", e);
          }
        }

        if (!targetAppId) {
          setMilestones([]);
          setLoading(false);
          return;
        }

        const response = await getApplicationMilestones(targetAppId);
        const milestoneData = Array.isArray(response) ? response : response?.milestones;

        setMilestones(
          Array.isArray(milestoneData)
            ? milestoneData.map((item, index) => ({
                id: item?.applicationMilestoneId ?? `milestone-${index}`,
                stage: index + 1,
                title: item?.schemeMilestone?.milestoneName ?? item?.milestone?.milestoneName ?? `Milestone #${index + 1}`,
                description: item?.schemeMilestone?.description ?? item?.milestone?.description ?? "Stage fund release proof verification.",
                amount: item?.amount ?? item?.amountToRelease ?? 0,
                dueDate: item?.dueDate ?? "Not available",
                status: item?.status?.toUpperCase?.() ?? "PENDING",
                completedDate: item?.disbursedAt ?? item?.completedDate ?? null,
                amountReleased: item?.status === "RELEASED" ? (item?.amount ?? 0) : 0,
                releasedOn: item?.disbursedAt ?? item?.releaseDate ?? null,
                application: item?.application,
              }))
            : []
        );
      } catch (requestError) {
        setMilestones([]);
        setError("No disbursement milestones found for this application yet.");
      } finally {
        setLoading(false);
      }
    };

    loadMilestones();
  }, [applicationId]);

  const totalAmount = milestones.reduce((sum, milestone) => sum + (Number(milestone.amount) || 0), 0);
  const releasedAmount = milestones.reduce((sum, milestone) => sum + (Number(milestone.amountReleased) || 0), 0);
  const progress = totalAmount ? Math.round((releasedAmount / totalAmount) * 100) : 0;
  const schemeName = milestones[0]?.application?.scheme?.schemeName ?? "Grant Disbursement";

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) setUploadMessage(`${file.name} is ready to be submitted for verification.`);
  };

  return (
    <div className="disbursement-page">
      <style>{styles}</style>
      <div className="container py-4 py-md-5">
        <section className="disbursement-hero">
          <div>
            <span className="disbursement-eyebrow">Beneficiary Services</span>
            <h1>Disbursement Tracker</h1>
            <p>Stay informed about every grant instalment and the next step in your disbursement journey.</p>
            <div className="disbursement-identity">
              <span><Landmark size={17} aria-hidden="true" /> {schemeName}</span>
              <span><FileText size={17} aria-hidden="true" /> {applicationId ?? "Application ID unavailable"}</span>
            </div>
          </div>
          <div className="disbursement-hero-icon" aria-hidden="true"><CircleDollarSign size={76} strokeWidth={1.5} /></div>
        </section>

        <section className="disbursement-progress-card" aria-labelledby="progress-title">
          <div className="disbursement-progress-head">
            <div><span className="disbursement-kicker">Grant progress</span><h2 id="progress-title">Overall Disbursement</h2></div>
            <strong>{progress}% released</strong>
          </div>
          <div className="disbursement-progress-bar" role="progressbar" aria-label="Disbursement progress" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${progress}%` }} /></div>
          <div className="disbursement-progress-footer"><span>{formatCurrency(releasedAmount)} released of {formatCurrency(totalAmount)}</span><span>{milestones.filter((item) => item.status === "RELEASED").length} of {milestones.length} instalments released</span></div>
        </section>

        {uploadMessage && <div className="disbursement-alert" role="status">{uploadMessage}</div>}
        {!applicationId && <div className="disbursement-alert" role="status">Please provide an application ID in the URL to view disbursement milestones.</div>}
        {error && <div className="disbursement-alert" role="alert">{error}</div>}
        {loading && <div className="disbursement-alert" role="status">Loading disbursement milestones...</div>}

        <section className="milestones-section" aria-labelledby="milestones-title">
          <div className="milestones-heading"><div><span className="disbursement-kicker">Payment schedule</span><h2 id="milestones-title">Disbursement Milestones</h2></div><p>Complete each requirement to unlock the next instalment.</p></div>
          <div className="milestone-timeline">
            {!loading && applicationId && !error && milestones.length === 0 && <div className="disbursement-alert" role="status">No disbursement milestones are available for this application.</div>}
            {milestones.map((milestone) => {
              const meta = statusMeta[milestone.status] ?? statusMeta.PENDING;
              const StatusIcon = meta.icon;
              const isPending = milestone.status === "PENDING";
              return (
                <article className={`milestone-card ${meta.className}`} key={milestone.id}>
                  <div className="milestone-connector" aria-hidden="true" />
                  <div className="milestone-topline">
                    <span className="stage-number">Stage {milestone.stage}</span>
                    <span className={`milestone-status ${meta.className}`}><StatusIcon size={15} aria-hidden="true" /> {meta.label}</span>
                  </div>
                  <div className="milestone-icon"><CircleDollarSign size={24} aria-hidden="true" /></div>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                  <div className="milestone-details">
                    <div><span>Amount</span><strong>{formatCurrency(milestone.amount)}</strong></div>
                    <div><span>Due date</span><strong><CalendarDays size={15} aria-hidden="true" /> {milestone.dueDate}</strong></div>
                  </div>
                  {milestone.releasedOn && <span className="released-note">Released on {milestone.releasedOn}</span>}
                  <div className="milestone-actions">
                    <button className="proof-btn" type="button" disabled={!isPending} onClick={() => fileInputRef.current?.click()}><Upload size={16} aria-hidden="true" /> Upload Proof</button>
                    <button className="details-btn" type="button" onClick={() => setSelectedMilestone(milestone)}><View size={16} aria-hidden="true" /> View Details</button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <input ref={fileInputRef} className="visually-hidden" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} />

        {selectedMilestone && (
          <div className="milestone-modal-backdrop" role="presentation" onMouseDown={() => setSelectedMilestone(null)}>
            <section className="milestone-modal" role="dialog" aria-modal="true" aria-labelledby="milestone-modal-title" onMouseDown={(event) => event.stopPropagation()}>
              <button className="modal-close" type="button" aria-label="Close details" onClick={() => setSelectedMilestone(null)}>×</button>
              <span className="disbursement-kicker">Stage {selectedMilestone.stage} details</span>
              <h2 id="milestone-modal-title">{selectedMilestone.title}</h2>
              <p>{selectedMilestone.description}</p>
              <dl><div><dt>Amount</dt><dd>{formatCurrency(selectedMilestone.amount)}</dd></div><div><dt>Due date</dt><dd>{selectedMilestone.dueDate}</dd></div><div><dt>Status</dt><dd>{(statusMeta[selectedMilestone.status] ?? statusMeta.PENDING).label}</dd></div></dl>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = `
.disbursement-page{min-height:100vh;padding-bottom:40px;background:#f5f8fc;color:#1e293b}.disbursement-hero{display:flex;align-items:center;justify-content:space-between;gap:30px;padding:42px 45px;color:#fff;background:linear-gradient(135deg,#2563eb,#4f46e5);border-radius:22px;box-shadow:0 18px 40px rgba(37,99,235,.2)}.disbursement-eyebrow,.disbursement-kicker{display:inline-block;font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}.disbursement-eyebrow{padding:8px 16px;margin-bottom:17px;background:rgba(255,255,255,.18);border-radius:30px}.disbursement-hero h1{margin:0 0 12px;font-size:clamp(32px,4vw,42px);font-weight:700}.disbursement-hero p{max-width:700px;margin:0;line-height:1.65;opacity:.95}.disbursement-identity{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.disbursement-identity span{display:inline-flex;align-items:center;gap:7px;padding:9px 12px;background:rgba(255,255,255,.14);border-radius:10px;font-size:13px;font-weight:600}.disbursement-hero-icon{display:flex;align-items:center;justify-content:center;flex:0 0 145px;width:145px;height:145px;background:rgba(255,255,255,.15);border-radius:50%}.disbursement-progress-card,.milestone-card{background:#fff;border:1px solid #e8eef8;border-radius:20px;box-shadow:0 8px 22px rgba(0,0,0,.06)}.disbursement-progress-card{padding:27px 30px;margin-top:25px}.disbursement-progress-head,.milestones-heading{display:flex;align-items:center;justify-content:space-between;gap:16px}.disbursement-kicker{margin-bottom:7px;color:#2563eb}.disbursement-progress-head h2,.milestones-heading h2{margin:0;font-size:24px;font-weight:700}.disbursement-progress-head strong{color:#2563eb;font-size:18px}.disbursement-progress-bar{height:10px;overflow:hidden;margin-top:17px;background:#e8eef8;border-radius:99px}.disbursement-progress-bar span{display:block;height:100%;background:linear-gradient(90deg,#2563eb,#4f46e5);border-radius:inherit;box-shadow:0 0 15px rgba(79,70,229,.38)}.disbursement-progress-footer{display:flex;justify-content:space-between;gap:16px;margin-top:13px;color:#64748b;font-size:14px}.disbursement-alert{padding:13px 16px;margin-top:20px;color:#166534;background:#dcfce7;border:1px solid #bbf7d0;border-radius:12px;font-size:14px;font-weight:600}.milestones-section{margin-top:30px}.milestones-heading{margin-bottom:24px}.milestones-heading p{margin:0;color:#64748b;font-size:14px}.milestone-timeline{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.milestone-card{position:relative;min-width:0;padding:25px}.milestone-connector{position:absolute;top:49px;left:calc(100% + 1px);width:21px;height:3px;background:#cbd5e1}.milestone-card.released .milestone-connector{background:linear-gradient(90deg,#22c55e,#2563eb)}.milestone-card:last-child .milestone-connector{display:none}.milestone-topline{display:flex;align-items:center;justify-content:space-between;gap:10px}.stage-number{color:#2563eb;font-size:13px;font-weight:700}.milestone-status{display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border-radius:30px;font-size:11px;font-weight:700;text-transform:uppercase}.milestone-status.pending{color:#1d4ed8;background:#dbeafe}.milestone-status.completed,.milestone-status.released{color:#166534;background:#dcfce7}.milestone-status.overdue{color:#b45309;background:#fef3c7}.milestone-status.locked{color:#64748b;background:#f1f5f9}.milestone-icon{display:flex;align-items:center;justify-content:center;width:48px;height:48px;margin:20px 0 15px;color:#2563eb;background:#eef4ff;border-radius:14px}.milestone-card.released .milestone-icon{color:#15803d;background:#dcfce7}.milestone-card h3{margin:0;color:#1e293b;font-size:18px;font-weight:700}.milestone-card>p{min-height:64px;margin:8px 0 18px;color:#64748b;font-size:14px;line-height:1.55}.milestone-details{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:13px 0;border-top:1px solid #eef2f7;border-bottom:1px solid #eef2f7}.milestone-details span{display:block;margin-bottom:5px;color:#64748b;font-size:11px}.milestone-details strong{display:flex;align-items:center;gap:5px;color:#334155;font-size:13px}.milestone-details strong svg{color:#2563eb}.released-note{display:block;min-height:32px;padding-top:12px;color:#15803d;font-size:12px;font-weight:600}.milestone-card:not(.released) .released-note{visibility:hidden}.milestone-actions{display:flex;gap:9px;margin-top:14px}.milestone-actions button{display:inline-flex;align-items:center;justify-content:center;gap:6px;flex:1;min-height:40px;padding:8px;border:0;border-radius:10px;font-size:12px;font-weight:700;transition:.2s}.proof-btn{color:#fff;background:linear-gradient(135deg,#2563eb,#4f46e5)}.proof-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 15px rgba(37,99,235,.23)}.proof-btn:disabled{color:#94a3b8;background:#f1f5f9;cursor:not-allowed}.details-btn{color:#2563eb;background:#eef4ff}.details-btn:hover{color:#1d4ed8;background:#dbeafe}.milestone-modal-backdrop{position:fixed;z-index:1050;inset:0;display:grid;place-items:center;padding:20px;background:rgba(15,23,42,.52)}.milestone-modal{position:relative;width:min(460px,100%);padding:30px;background:#fff;border-radius:20px;box-shadow:0 24px 60px rgba(15,23,42,.25)}.modal-close{position:absolute;top:15px;right:17px;width:32px;height:32px;color:#64748b;background:#f1f5f9;border:0;border-radius:50%;font-size:24px;line-height:1}.milestone-modal h2{margin:0 0 9px;font-size:23px}.milestone-modal>p{margin:0;color:#64748b;line-height:1.6}.milestone-modal dl{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:22px 0 0}.milestone-modal dl div{padding:11px;background:#f8fbff;border-radius:10px}.milestone-modal dt{margin-bottom:4px;color:#64748b;font-size:11px}.milestone-modal dd{margin:0;color:#1e293b;font-size:13px;font-weight:700}@media(max-width:991px){.milestone-timeline{grid-template-columns:1fr}.milestone-connector{top:100%;left:48px;width:3px;height:22px}.milestone-card>p{min-height:0}.milestone-card:not(.released) .released-note{display:none}}@media(max-width:768px){.disbursement-hero{align-items:flex-start;flex-direction:column;padding:30px}.disbursement-hero-icon{align-self:center;width:112px;height:112px}.disbursement-hero-icon svg{width:58px;height:58px}.disbursement-progress-card{padding:24px}.disbursement-progress-head,.milestones-heading,.disbursement-progress-footer{align-items:flex-start;flex-direction:column}.milestones-heading{margin-bottom:20px}}@media(max-width:450px){.disbursement-identity,.milestone-actions{flex-direction:column}.disbursement-identity span{width:100%}.milestone-details,.milestone-modal dl{grid-template-columns:1fr}.milestone-details{gap:14px}.milestone-modal{padding:25px}}
`;

export default DisbursementTracker;
