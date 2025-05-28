import { useState } from 'react'
import { CustomPieChart, CustomLineChart, DashboardBarChart, RadarChartComponent, CustomAreaChart,
    PieChartComponent, DateLineChart
 } from '@/app/agents/charts'
const UnderstandData = () => {
    const DEFAULT_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', ];

    const pieData = [
        { category: "chrome", value: 275},
        { category: "safari", value: 200},
        { category: "firefox", value: 187},
        { category: "edge", value: 173},
        { category: "other", value: 90},
    ]
    const lineData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]

    const dateLineData = [
        { date: "2024-01-01", desktop: 186, mobile: 80 },
        { date: "2024-01-02", desktop: 305, mobile: 200 },
        { date: "2024-01-03", desktop: 237, mobile: 120 },
        { date: "2024-01-04", desktop: 73, mobile: 190 },
        { date: "2024-01-05", desktop: 209, mobile: 130 },
        { date: "2024-01-06", desktop: 214, mobile: 140 },
    ]
    pieData.map((item: any, index: number) => {
        item.fill = DEFAULT_COLORS[index]
    })
    return (
        <div>
            <h1>Understand Data</h1>
            <CustomPieChart data={pieData} colors={DEFAULT_COLORS} labels={{title: "Pie Chart - Label", description: "January - June 2024"}}/>
            <CustomLineChart data={lineData} labels={{title: "Line Chart - Label", description: "January - June 2024"}}/>
            <div className="flex flex-row gap-4">
                <DateLineChart data={dateLineData} colors={DEFAULT_COLORS}/>
            </div>
        </div>
    )
}

export default UnderstandData;

/*
Pie Charts: In the case of categories with less than 6 types that can be grouped together with fractions of the total:
Format: {category: "The category name as a string", value: "the value as a number"}
Examples: Things like revenue per type of social media channel, Views per Social media channel, etc

Line Charts: In the case of a time series with two metrics:
Format: {month: "The month as a string", name of category1: "the value of category 1 as a number", name of category2: "the value of category 2 as a number"}
Examples: Things like revenue per day in a month, Views per day in a month, etc Think dates

Date Line Charts: In the case of a time series with two metrics:
Format: {date: "The date as a string", name of category1: "the value of category 1 as a number", name of category2: "the value of category 2 as a number"}
Examples: Things like revenue per day in a month, Views per day in a month, etc Think dates
*/