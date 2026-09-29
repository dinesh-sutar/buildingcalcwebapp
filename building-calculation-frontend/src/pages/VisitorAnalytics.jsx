import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import { getVisitorStats } from "../api/visitorApi";
import "../components/VisitorAnalytics.css";

function VisitorAnalytics() {

    const [period, setPeriod] = useState("DAILY");

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    /*
     * Load visitor data
     */
    const loadVisitors = async () => {

        try {

            setLoading(true);
            setError("");

            if (period === "CUSTOM") {

                if (!from || !to) {
                    setError("Please select both dates.");
                    setLoading(false);
                    return;
                }

                if (from > to) {
                    setError(
                        "From date cannot be after To date."
                    );

                    setLoading(false);
                    return;
                }
            }


            const result = await getVisitorStats({
                period,
                from: period === "CUSTOM"
                    ? from
                    : null,
                to: period === "CUSTOM"
                    ? to
                    : null,
            });


            console.log(
                "Visitor stats received:",
                result
            );


            /*
             * Make sure the response is an array
             */
            if (!Array.isArray(result)) {

                console.error(
                    "Expected visitor stats array but received:",
                    result
                );

                setData([]);

                setError(
                    "Invalid visitor statistics response."
                );

                return;
            }


            /*
             * Convert API response
             */
            const formattedData = result.map(
                (item) => ({
                    period: item.period,
                    visitorCount: Number(
                        item.visitorCount
                    ),
                })
            );


            console.log(
                "Formatted visitor data:",
                formattedData
            );


            setData(formattedData);

        } catch (err) {

            console.error(
                "Visitor analytics error:",
                err
            );

            setData([]);

            setError(
                err?.response?.data?.message ||
                "Unable to load visitor statistics."
            );

        } finally {

            setLoading(false);

        }
    };


    /*
     * Load Daily / Monthly / Yearly
     */
    useEffect(() => {

        if (period !== "CUSTOM") {
            loadVisitors();
        }

    }, [period]);


    /*
     * Custom range
     */
    const handleCustomSearch = () => {
        loadVisitors();
    };


    /*
     * Total visitors
     */
    const totalVisitors = data.reduce(
        (sum, item) =>
            sum + item.visitorCount,
        0
    );


    /*
     * Average visitors
     */
    const averageVisitors =
        data.length > 0
            ? totalVisitors / data.length
            : 0;


    /*
     * Peak visitors
     */
    const peakVisitors =
        data.length > 0
            ? Math.max(
                ...data.map(
                    item => item.visitorCount
                )
            )
            : 0;


    /*
     * Format chart labels
     */
    const formatLabel = (value) => {

        if (!value) {
            return "";
        }


        /*
         * Daily / Custom
         *
         * 2026-09-22
         * → Sep 22
         */
        if (
            period === "DAILY" ||
            period === "CUSTOM"
        ) {

            const date = new Date(
                value + "T00:00:00"
            );

            return date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                }
            );
        }


        /*
         * Monthly
         *
         * 2026-09
         * → Sep 2026
         */
        if (period === "MONTHLY") {

            const date = new Date(
                value + "-01T00:00:00"
            );

            return date.toLocaleDateString(
                "en-IN",
                {
                    month: "short",
                    year: "numeric",
                }
            );
        }


        /*
         * Yearly
         */
        return value;
    };


    /*
     * Tooltip date formatting
     */
    const formatTooltipDate = (value) => {

        if (!value) {
            return "";
        }


        if (
            period === "DAILY" ||
            period === "CUSTOM"
        ) {

            const date = new Date(
                value + "T00:00:00"
            );

            return date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }
            );
        }


        if (period === "MONTHLY") {

            const date = new Date(
                value + "-01T00:00:00"
            );

            return date.toLocaleDateString(
                "en-IN",
                {
                    month: "long",
                    year: "numeric",
                }
            );
        }


        return value;
    };


    /*
     * Page title
     */
    const getPeriodTitle = () => {

        switch (period) {

            case "MONTHLY":
                return "Monthly Visitors";

            case "YEARLY":
                return "Yearly Visitors";

            case "CUSTOM":
                return "Visitors";

            default:
                return "Daily Visitors";
        }
    };


    return (

        <div className="visitor-analytics">


            {/* ================= HEADER ================= */}

            <div className="visitor-header">

                <div>

                    <h2>
                        Visitor Analytics
                    </h2>

                    <p>
                        Monitor unique visitors to BuildingCalc
                    </p>

                </div>


                <div className="visitor-filter">

                    <select
                        value={period}
                        onChange={(e) =>
                            setPeriod(e.target.value)
                        }
                    >

                        <option value="DAILY">
                            Daily
                        </option>

                        <option value="MONTHLY">
                            Monthly
                        </option>

                        <option value="YEARLY">
                            Yearly
                        </option>

                        <option value="CUSTOM">
                            Custom Range
                        </option>

                    </select>

                </div>

            </div>


            {/* ================= CUSTOM FILTER ================= */}

            {period === "CUSTOM" && (

                <div className="custom-date-filter">

                    <div className="date-field">

                        <label>
                            From Date
                        </label>

                        <input
                            type="date"
                            value={from}
                            onChange={(e) =>
                                setFrom(e.target.value)
                            }
                        />

                    </div>


                    <div className="date-field">

                        <label>
                            To Date
                        </label>

                        <input
                            type="date"
                            value={to}
                            onChange={(e) =>
                                setTo(e.target.value)
                            }
                        />

                    </div>


                    <button
                        onClick={handleCustomSearch}
                        disabled={loading}
                    >

                        {loading
                            ? "Loading..."
                            : "Apply"
                        }

                    </button>

                </div>

            )}


            {/* ================= ERROR ================= */}

            {error && (

                <div className="visitor-error">
                    {error}
                </div>

            )}


            {/* ================= SUMMARY CARDS ================= */}

            <div className="visitor-summary">


                {/* Total */}

                <div className="visitor-summary-card">

                    <div className="visitor-summary-icon">
                        👥
                    </div>

                    <div>

                        <span>
                            Total Visitors
                        </span>

                        <strong>
                            {totalVisitors.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>

                </div>


                {/* Average */}

                <div className="visitor-summary-card">

                    <div className="visitor-summary-icon">
                        📈
                    </div>

                    <div>

                        <span>
                            Average
                        </span>

                        <strong>
                            {averageVisitors.toFixed(2)}
                        </strong>

                        <small>
                            per {period === "DAILY"
                                ? "day"
                                : period === "MONTHLY"
                                    ? "month"
                                    : "year"
                            }
                        </small>

                    </div>

                </div>


                {/* Peak */}

                <div className="visitor-summary-card">

                    <div className="visitor-summary-icon">
                        🔝
                    </div>

                    <div>

                        <span>
                            Peak Visitors
                        </span>

                        <strong>
                            {peakVisitors.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>

                </div>


                {/* Data points */}

                <div className="visitor-summary-card">

                    <div className="visitor-summary-icon">
                        📊
                    </div>

                    <div>

                        <span>
                            Data Points
                        </span>

                        <strong>
                            {data.length}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ================= CHART ================= */}

            <div className="visitor-chart-card">


                <div className="chart-header">

                    <div>

                        <h3>
                            {getPeriodTitle()}
                        </h3>

                        <p>
                            Unique visitor activity
                        </p>

                    </div>


                    {data.length > 0 && (

                        <div className="chart-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                {totalVisitors.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>

                    )}

                </div>


                {loading ? (

                    <div className="visitor-loading">

                        <div className="loading-spinner"></div>

                        <span>
                            Loading visitor data...
                        </span>

                    </div>

                ) : data.length === 0 ? (

                    <div className="visitor-empty">

                        <div className="empty-icon">
                            📊
                        </div>

                        <strong>
                            No visitor data
                        </strong>

                        <span>
                            There is no visitor data
                            available for this period.
                        </span>

                    </div>

                ) : (

                    <div className="visitor-chart">

                        <ResponsiveContainer
                            width="100%"
                            height={380}
                        >

                            <AreaChart
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 0,
                                    bottom: 10,
                                }}
                            >

                                <defs>

                                    <linearGradient
                                        id="visitorGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >

                                        <stop
                                            offset="0%"
                                            stopOpacity={0.30}
                                        />

                                        <stop
                                            offset="100%"
                                            stopOpacity={0.03}
                                        />

                                    </linearGradient>

                                </defs>


                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    vertical={false}
                                />


                                <XAxis
                                    dataKey="period"
                                    tickFormatter={formatLabel}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={20}
                                />


                                <YAxis
                                    allowDecimals={false}
                                    tickLine={false}
                                    axisLine={false}
                                    width={40}
                                />


                                <Tooltip
                                    labelFormatter={
                                        formatTooltipDate
                                    }
                                    formatter={(value) => [
                                        value,
                                        "Visitors",
                                    ]}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                        boxShadow:
                                            "0 4px 12px rgba(0,0,0,0.08)",
                                    }}
                                />


                                <Area
                                    type="monotone"
                                    dataKey="visitorCount"
                                    strokeWidth={2.5}
                                    fill="url(#visitorGradient)"
                                    dot={{
                                        r: 4,
                                    }}
                                    activeDot={{
                                        r: 6,
                                    }}
                                />

                            </AreaChart>

                        </ResponsiveContainer>

                    </div>

                )}

            </div>

        </div>
    );
}

export default VisitorAnalytics;