import defaultApplications from "../data/applications";

const STORAGE_KEY = "gov_applications";

export function getApplications() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultApplications)
        );
        return defaultApplications;
    }

    return JSON.parse(data);
}

export function saveApplications(applications) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(applications)
    );
}

export function resetApplications() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultApplications)
    );
}