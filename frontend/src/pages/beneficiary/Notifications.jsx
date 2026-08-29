import { useEffect, useMemo, useState } from "react";
import {
    Bell,
    CheckCircle2,
    Clock3,
    MailCheck,
    Search,
    TriangleAlert,
    WalletCards,
    XCircle,
} from "lucide-react";
import { getUserNotifications, markNotificationAsRead } from "../../api/userApi";

const filters = ["All", "Unread", "Payments", "Reminders", "Warnings"];

const notificationMeta = {
    "Payment Released": {
        icon: WalletCards,
        className: "payment",
    },
    "Proof Submitted Successfully": {
        icon: CheckCircle2,
        className: "success",
    },
    "Milestone Reminder": {
        icon: Bell,
        className: "reminder",
    },
    "Overdue Warning": {
        icon: TriangleAlert,
        className: "warning",
    },
    "Proof Rejected": {
        icon: XCircle,
        className: "rejected",
    },
};

const defaultNotificationMeta = {
    icon: Bell,
    className: "payment",
};

const formatTimestamp = (createdAt) => {
    if (!createdAt) return "Date unavailable";

    const date = new Date(createdAt);
    return Number.isNaN(date.getTime())
        ? "Date unavailable"
        : new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
};

const mapNotification = (notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    read: notification.isRead,
    timestamp: formatTimestamp(notification.createdAt),
});

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isMarkingRead, setIsMarkingRead] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        const userId = storedUser?.userId ?? storedUser?.id;

        if (userId == null) {
            setError("We couldn't find your account details. Please sign in again.");
            setLoading(false);
            return;
        }

        const fetchNotifications = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getUserNotifications(userId);
                setNotifications(Array.isArray(data) ? data.map(mapNotification) : []);
            } catch {
                setError("We couldn't load your notifications. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const filteredNotifications = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return notifications.filter((notification) => {
            const matchesSearch = !query ||
                notification.title.toLowerCase().includes(query) ||
                notification.message.toLowerCase().includes(query);
            const matchesFilter =
                activeFilter === "All" ||
                (activeFilter === "Unread" && !notification.read) ||
                (activeFilter === "Payments" && notification.type === "Payment Released") ||
                (activeFilter === "Reminders" && notification.type === "Milestone Reminder") ||
                (activeFilter === "Warnings" && notification.type === "Overdue Warning");

            return matchesSearch && matchesFilter;
        });
    }, [notifications, searchTerm, activeFilter]);

    const unreadCount = notifications.filter((notification) => !notification.read).length;

    const markAllAsRead = async () => {
        const unreadNotifications = notifications.filter((notification) => !notification.read);
        if (unreadNotifications.length === 0) return;

        try {
            setIsMarkingRead(true);
            setError("");
            await Promise.all(unreadNotifications.map((notification) => markNotificationAsRead(notification.id)));
            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) => ({ ...notification, read: true }))
            );
        } catch {
            setError("We couldn't mark all notifications as read. Please try again.");
        } finally {
            setIsMarkingRead(false);
        }
    };

    return (
        <div className="notifications-page">
            <style>{`
                .notifications-page {
                    min-height: 100vh;
                    padding-bottom: 40px;
                    background: #f5f8fc;
                }

                .notifications-hero {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 30px;
                    padding: 45px;
                    color: #fff;
                    background: linear-gradient(135deg, #2563eb, #4f46e5);
                    border-radius: 22px;
                    box-shadow: 0 18px 40px rgba(37, 99, 235, 0.2);
                }

                .notifications-hero-content {
                    max-width: 680px;
                }

                .notifications-eyebrow,
                .notifications-section-kicker {
                    display: inline-block;
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }

                .notifications-eyebrow {
                    padding: 8px 16px;
                    margin-bottom: 20px;
                    background: rgba(255, 255, 255, 0.18);
                    border-radius: 30px;
                }

                .notifications-hero h1 {
                    margin: 0 0 15px;
                    font-size: clamp(32px, 4vw, 42px);
                    font-weight: 700;
                }

                .notifications-hero p {
                    max-width: 620px;
                    margin: 0;
                    line-height: 1.7;
                    opacity: 0.95;
                }

                .notifications-hero-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex: 0 0 150px;
                    width: 150px;
                    height: 150px;
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 50%;
                }

                .notifications-content-card {
                    padding: 30px;
                    margin-top: 28px;
                    background: #fff;
                    border: 1px solid #e8eef8;
                    border-radius: 20px;
                    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
                }

                .notifications-card-heading {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    padding-bottom: 22px;
                    margin-bottom: 22px;
                    border-bottom: 1px solid #e8eef8;
                }

                .notifications-section-kicker {
                    margin-bottom: 7px;
                    color: #2563eb;
                }

                .notifications-card-heading h2 {
                    margin: 0;
                    color: #1e293b;
                    font-size: 26px;
                    font-weight: 700;
                }

                .mark-read-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    min-height: 44px;
                    padding: 11px 16px;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #2563eb, #4f46e5);
                    border: 0;
                    border-radius: 10px;
                    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
                    transition: transform 0.25s, box-shadow 0.25s;
                    white-space: nowrap;
                }

                .mark-read-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 25px rgba(37, 99, 235, 0.28);
                }

                .mark-read-btn:disabled {
                    cursor: not-allowed;
                    opacity: 0.65;
                }

                .notifications-toolbar {
                    display: grid;
                    grid-template-columns: minmax(220px, 1fr) auto;
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .notification-search {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-height: 50px;
                    padding: 0 15px;
                    color: #2563eb;
                    background: #f8fbff;
                    border: 1px solid #dbe4f0;
                    border-radius: 12px;
                    transition: border-color 0.25s, box-shadow 0.25s;
                }

                .notification-search:focus-within {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
                }

                .notification-search input {
                    width: 100%;
                    color: #1e293b;
                    background: transparent;
                    border: 0;
                    outline: 0;
                    font-size: 14px;
                }

                .notification-filter-group {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: flex-end;
                }

                .notification-filter-chip {
                    min-height: 42px;
                    padding: 9px 14px;
                    color: #475569;
                    font-size: 13px;
                    font-weight: 700;
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    border-radius: 30px;
                    transition: color 0.25s, background 0.25s, border-color 0.25s, transform 0.25s;
                }

                .notification-filter-chip:hover,
                .notification-filter-chip.active {
                    color: #2563eb;
                    background: #eef4ff;
                    border-color: #bfdbfe;
                    transform: translateY(-1px);
                }

                .notifications-list {
                    display: grid;
                    gap: 16px;
                }

                .notification-record-card {
                    display: grid;
                    grid-template-columns: auto minmax(0, 1fr) auto;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 22px;
                    background: #fff;
                    border: 1px solid #e8eef8;
                    border-left: 4px solid #2563eb;
                    border-radius: 18px;
                    box-shadow: 0 5px 16px rgba(15, 23, 42, 0.04);
                    transition: transform 0.3s, box-shadow 0.3s;
                }

                .notification-record-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 30px rgba(37, 99, 235, 0.1);
                }

                .notification-record-card.success { border-left-color: #16a34a; }
                .notification-record-card.reminder { border-left-color: #f59e0b; }
                .notification-record-card.warning { border-left-color: #dc2626; }
                .notification-record-card.rejected { border-left-color: #b91c1c; }

                .notification-type-icon,
                .notifications-empty-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex: 0 0 auto;
                    border-radius: 14px;
                }

                .notification-type-icon {
                    width: 52px;
                    height: 52px;
                    color: #2563eb;
                    background: #eef4ff;
                }

                .notification-type-icon.success { color: #15803d; background: #dcfce7; }
                .notification-type-icon.reminder { color: #b45309; background: #fef3c7; }
                .notification-type-icon.warning { color: #b91c1c; background: #fee2e2; }
                .notification-type-icon.rejected { color: #b91c1c; background: #fee2e2; }

                .notification-record-body {
                    min-width: 0;
                }

                .notification-record-topline {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 9px;
                }

                .notification-record-topline h3 {
                    margin: 0;
                    color: #1e293b;
                    font-size: 18px;
                    font-weight: 700;
                }

                .notification-badge {
                    display: inline-flex;
                    align-items: center;
                    min-height: 26px;
                    padding: 5px 10px;
                    color: #166534;
                    background: #dcfce7;
                    border-radius: 30px;
                    font-size: 12px;
                    font-weight: 700;
                }

                .notification-badge.unread {
                    color: #1d4ed8;
                    background: #dbeafe;
                }

                .notification-record-body p {
                    margin: 0;
                    color: #64748b;
                    line-height: 1.7;
                }

                .notification-time {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    color: #64748b;
                    font-size: 13px;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .notifications-empty-state {
                    max-width: 500px;
                    padding: 42px 20px 20px;
                    margin: 0 auto;
                    text-align: center;
                }

                .notifications-empty-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 18px;
                    color: #2563eb;
                    background: #eef4ff;
                    border-radius: 50%;
                }

                .notifications-empty-state h3 {
                    margin: 0 0 9px;
                    color: #1e293b;
                    font-size: 21px;
                    font-weight: 700;
                }

                .notifications-empty-state p {
                    margin: 0;
                    color: #64748b;
                    line-height: 1.7;
                }

                @media (max-width: 991px) {
                    .notifications-toolbar {
                        grid-template-columns: 1fr;
                    }

                    .notification-filter-group {
                        justify-content: flex-start;
                    }
                }

                @media (max-width: 768px) {
                    .notifications-hero {
                        align-items: flex-start;
                        flex-direction: column;
                        padding: 30px;
                    }

                    .notifications-hero-icon {
                        align-self: center;
                        width: 115px;
                        height: 115px;
                    }

                    .notifications-hero-icon svg {
                        width: 62px;
                        height: 62px;
                    }

                    .notifications-content-card {
                        padding: 24px;
                    }

                    .notifications-card-heading {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .notification-record-card {
                        grid-template-columns: auto minmax(0, 1fr);
                    }

                    .notification-time {
                        grid-column: 2;
                        white-space: normal;
                    }
                }

                @media (max-width: 576px) {
                    .notification-record-card {
                        grid-template-columns: 1fr;
                    }

                    .notification-time {
                        grid-column: auto;
                    }

                    .notification-filter-chip,
                    .mark-read-btn {
                        width: 100%;
                    }

                    .notification-filter-group {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        width: 100%;
                    }
                }
            `}</style>

            <div className="container py-4 py-md-5">
                <section className="notifications-hero">
                    <div className="notifications-hero-content">
                        <span className="notifications-eyebrow">Beneficiary Services</span>
                        <h1>Notifications</h1>
                        <p>Stay updated with your subsidy application and disbursement activities.</p>
                    </div>
                    <div className="notifications-hero-icon" aria-hidden="true">
                        <Bell size={82} strokeWidth={1.5} />
                    </div>
                </section>

                <section className="notifications-content-card">
                    <div className="notifications-card-heading">
                        <div>
                            <span className="notifications-section-kicker">Activity updates</span>
                            <h2>Recent Notifications</h2>
                        </div>
                        <button className="mark-read-btn" type="button" onClick={markAllAsRead} disabled={unreadCount === 0 || loading || isMarkingRead}>
                            <MailCheck size={18} aria-hidden="true" />
                            {isMarkingRead ? "Marking as Read..." : "Mark All as Read"}
                        </button>
                    </div>

                    <div className="notifications-toolbar">
                        <label className="notification-search" htmlFor="notification-search">
                            <Search size={19} aria-hidden="true" />
                            <input
                                id="notification-search"
                                type="search"
                                placeholder="Search notifications by title or message"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </label>

                        <div className="notification-filter-group" aria-label="Notification filters">
                            {filters.map((filter) => (
                                <button
                                    className={`notification-filter-chip ${activeFilter === filter ? "active" : ""}`}
                                    key={filter}
                                    type="button"
                                    onClick={() => setActiveFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="notifications-empty-state">
                            <div className="notifications-empty-icon" aria-hidden="true">
                                <Clock3 size={42} />
                            </div>
                            <h3>Loading notifications</h3>
                            <p>Please wait while we retrieve your latest updates.</p>
                        </div>
                    ) : error ? (
                        <div className="notifications-empty-state">
                            <div className="notifications-empty-icon" aria-hidden="true">
                                <TriangleAlert size={42} />
                            </div>
                            <h3>Unable to load notifications</h3>
                            <p>{error}</p>
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        <div className="notifications-list">
                            {filteredNotifications.map((notification) => {
                                const meta = notificationMeta[notification.type] || defaultNotificationMeta;
                                const Icon = meta.icon;

                                return (
                                    <article className={`notification-record-card ${meta.className}`} key={notification.id}>
                                        <div className={`notification-type-icon ${meta.className}`} aria-hidden="true">
                                            <Icon size={25} />
                                        </div>
                                        <div className="notification-record-body">
                                            <div className="notification-record-topline">
                                                <h3>{notification.title}</h3>
                                                <span className={`notification-badge ${notification.read ? "" : "unread"}`}>
                                                    {notification.read ? "Read" : "Unread"}
                                                </span>
                                            </div>
                                            <p>{notification.message}</p>
                                        </div>
                                        <span className="notification-time">
                                            <Clock3 size={15} aria-hidden="true" />
                                            {notification.timestamp}
                                        </span>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="notifications-empty-state">
                            <div className="notifications-empty-icon" aria-hidden="true">
                                <Bell size={42} />
                            </div>
                            <h3>No notifications found</h3>
                            <p>You're all caught up.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Notifications;
