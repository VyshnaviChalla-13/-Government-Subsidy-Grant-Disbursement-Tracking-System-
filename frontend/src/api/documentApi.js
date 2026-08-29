import axiosClient from "./axiosClient";

export async function uploadDocument(applicationId, documentType, file) {
    const formData = new FormData();
    formData.append("applicationId", applicationId);
    formData.append("documentType", documentType);
    formData.append("file", file);

    const response = await axiosClient.post("/documents/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export async function getDocumentsByApplication(applicationId) {
    const response = await axiosClient.get(`/documents/application/${applicationId}`);
    return response.data;
}

export async function verifyDocument(documentId, remarks, officer) {
    const response = await axiosClient.patch(`/documents/${documentId}/verify`, {
        remarks,
        officer,
    });
    return response.data;
}

export async function rejectDocument(documentId, remarks, officer) {
    const response = await axiosClient.patch(`/documents/${documentId}/reject`, {
        remarks,
        officer,
    });
    return response.data;
}
