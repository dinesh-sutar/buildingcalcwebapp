import api from "./api";

export const getVisitorStats = async ({
    period = "DAILY",
    from = null,
    to = null,
} = {}) => {

    const params = {
        period,
    };

    if (period === "CUSTOM") {
        params.from = from;
        params.to = to;
    }

    // api.js is already returning response.data
    const data = await api.get("/analytics/stats", {
        params,
    });

    console.log("Visitor API response:", data);

    return data;
};