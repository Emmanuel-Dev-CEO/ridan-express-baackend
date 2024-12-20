import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import 'boxicons';
import Chart from "react-apexcharts";
import sellerImage from "../../assets/seller.png";
import { get_admin_dashboard_index_data } from "../../store/Reducers/dashboardIndexReducer";

const StatCard = ({ title, value, previousValue }) => {
    const [prevValue, setPrevValue] = useState(previousValue || 0); // Default to 0 if no previous value
    const [percentageChange, setPercentageChange] = useState(0);

    const calculatePercentageChange = () => {
        if (prevValue === 0.5) {
            // If there's no previous value, assume 100% change for any non-zero value
            return value > 0 ? 1 : -1; 
        }
        const change = ((value - prevValue) / 100) * 100;
        return change.toFixed(2); // Return percentage with two decimal places
    };

    useEffect(() => {
        const newPercentageChange = calculatePercentageChange();
        setPercentageChange(newPercentageChange);

        // Update the previous value after calculating
        setPrevValue(value);
    }, [value]); // Recalculate when value changes

    return (
        <div className="bg-gradient-to-br from-[#283046] to-[#3a3d42] px-4 py-5 shadow-lg rounded-lg flex flex-col items-start justify-between h-[130px] w-[200px]">
            <p className="text-[#FFFFFF] font-medium flex flex-row justify-between gap-3 text-sm">
                <p>{title}</p>
                <p className={`text-${percentageChange >= 0 ? 'green' : 'red'}-500 flex shadow-lg text-center bg-black bg-opacity-20 rounded-md px-1 py-1 text-xs font-bold`}>
                    {percentageChange >= 0 ? '+' : ''}{percentageChange}%
                </p>
            </p>
            <h1 className="text-white font-bold text-3xl">{value}</h1>
            <p className="text-white font-light text-xs">vs. last month</p>
        </div>
    );
};


const RecentMessages = ({ messages, userInfo }) => (
    <div className="w-full bg-gradient-to-br from-[#283046] to-[#3a3d42] p-5 rounded-lg shadow-md text-[#d0d2d6]">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Seller Messages</h2>
            <Link to="/messages" className="text-sm font-medium text-[#00cfe8] hover:underline">
                View All
            </Link>
        </div>
        <div className="space-y-4">
            {messages.map((m, i) => (
                <div key={i} className="p-4 bg-[#404040] rounded-md shadow-sm flex gap-3">
                    <img
                        className="w-10 h-10 rounded-full"
                        src={m.senderId === userInfo._id ? userInfo.image : sellerImage}
                        alt=""
                    />
                    <div>
                        <p className="font-semibold text-sm">{m.senderName}</p>
                        <p className="text-xs text-[#a3a3a3]">{moment(m.createdAt).fromNow()}</p>
                        <p className="text-sm mt-2">{m.message}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const AdminDashboard = () => {
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);
    const { totalSale, totalOrder, totalProduct, totalSeller, recentOrders, recentMessage } =
        useSelector((state) => state.dashboardIndex);

    useEffect(() => {
        dispatch(get_admin_dashboard_index_data());
    }, [dispatch]);

    const chartState = useMemo(
        () => ({
            series: [
                { name: "Orders", data: [34, 65, 34, 65, 34, 34, 34, 56, 23, 67, 23, 45] },
                { name: "Revenue", data: [34, 32, 45, 32, 34, 34, 43, 56, 65, 67, 45, 78] },
                { name: "Sellers", data: [78, 32, 34, 54, 65, 34, 54, 21, 54, 43, 45, 43] },
            ],
            options: {
                colors: ["#181ee8", "#28c76f", "#7367f0"],
                chart: {
                    background: "transparent",
                    foreColor: "#d0d2d6",
                    toolbar: { show: true },
                    type: "line",
                },

                stroke: {
                    curve: "smooth",
                    width: 3,
                },

                markers: {
                    size: 5,
                    colors: ["#fff"],
                    strokeColors: ["#008ffb", "#00e396", "#feb019"],
                    strokeWidth: 2,
                },
                dataLabels: { enabled: false },
                grid: {
                    borderColor: "#40475d",
                    strokeDashArray: 4,
                },
                tooltip: {
                    theme: "dark",
                    marker: {
                        show: true,
                    },
                    y: {
                        formatter: (value) => `${value}`,
                    },
                },
                xaxis: {
                    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    labels: { style: { colors: "#d0d2d6" } },
                },
                yaxis: {
                    labels: { style: { colors: "#d0d2d6" } },
                },
                legend: {
                    position: "top",
                    labels: { colors: "#d0d2d6" },
                },
            },
        }),
        []
    );

    return (
        <div className="px-2 md:px-7">
            <h1 className="font-semibold text-[#FFFFFF] py-3 text-[25px]">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1">
                <StatCard title="Total revenue" value={`₦${totalSale.toLocaleString()}`} previousValue={totalSale - 1000} />
                <StatCard title="Total products" value={totalProduct.toLocaleString()} previousValue={totalProduct - 10} />
                <StatCard title="Sellers" value={totalSeller.toLocaleString()} previousValue={totalSeller - 5} />
                <StatCard title="Orders" value={totalOrder.toLocaleString()} previousValue={totalOrder - 100} />
                <StatCard title="Orders" value={totalOrder.toLocaleString()} previousValue={totalOrder - 100} />
            </div>

            <div className="mt-7 flex flex-wrap">
                <div className="w-full lg:w-7/12 lg:pr-3">
                    <div className="w-full bg-[#283046] p-6 rounded-md shadow-md">
                        <h1 className="font-semibold text-[#FFFFFF] py-2 text-[25px]">Platform view</h1>
                        <Chart
                            options={chartState.options}
                            series={chartState.series}
                            type="line" // Line chart type
                            height={300}
                        />
                    </div>
                </div>
                <div className="w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0">
                    <RecentMessages messages={recentMessage} userInfo={userInfo} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
