import axiosClient from "./axiosClient";

export async function downloadSchemeSummaryPdf() {
    const response = await axiosClient.get("/reports/scheme-summary/pdf", {
        responseType: "blob",
    });
    return response.data;
}

export async function downloadSchemeSummaryExcel() {
    const response = await axiosClient.get("/reports/scheme-summary/excel", {
        responseType: "blob",
    });
    return response.data;
}
