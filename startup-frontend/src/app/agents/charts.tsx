import {
    LineChart, Line, BarChart, Bar, PieChart, Pie,
    AreaChart, Area, RadarChart, Radar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Cell, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LabelList
} from 'recharts';

import { TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMemo } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Data Interfaces
interface LineChartData {
    date: string;
    [key: string]: string | number; // For dynamic values
}

interface BarChartData {
    category: string;
    [key: string]: string | number;
}

interface PieChartData {
    name: string;
    value: number;
}

interface AreaChartData {
    date: string;
    [key: string]: string | number;
}

interface RadarChartData {
    category: string;
    [key: string]: string | number;
}

// Component Props Interfaces
interface ChartProps {
    data: any[];
    colors?: string[];
    metrics?: string[]; // For specifying which metrics to display
    labels?: {title: string, description: string};
}

const DEFAULT_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

export const CustomLineChart = ({ data, colors = DEFAULT_COLORS, metrics }: ChartProps) => {
    const dataKeys = metrics || Object.keys(data[0]).filter(key => key !== 'date');

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {dataKeys.map((key, index) => (
                    <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={colors[index % colors.length]}
                        activeDot={{ r: 8 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export const CustomBarChart = ({ data, colors = DEFAULT_COLORS, metrics }: ChartProps) => {
    const dataKeys = metrics || Object.keys(data[0]).filter(key => key !== 'category');

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                {dataKeys.map((key, index) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        fill={colors[index % colors.length]}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

export const DashboardBarChart = ({ data, colors = DEFAULT_COLORS, metrics }: ChartProps) => {
    const chartConfig = {
        desktop: {
          label: "Desktop",
          color: "hsl(var(--chart-1))",
        },
        mobile: {
          label: "Mobile",
          color: "hsl(var(--chart-2))",
        },
      } satisfies ChartConfig
    const dataKeys = metrics || Object.keys(data[0]).filter(key => key !== 'category');
    
      
    return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {dataKeys.map((key, index) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        fill={colors[index % colors.length]}
                    />
                ))}
            {/* <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
    )
}

export const PieChartComponent = ({ data, colors = DEFAULT_COLORS }: ChartProps) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label />
            </PieChart>
        </ResponsiveContainer>
    )
}

export const CustomPieChart = ({ data, colors = DEFAULT_COLORS, labels }: ChartProps) => {
    data.map((item: any, index: number) => {
        item.fill = colors[index]
    })
    const chartConfig = {}
    return (
        <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{labels?.title}</CardTitle>
        <CardDescription>{labels?.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" label nameKey="category" fill="#82ca9d"/>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>

    );
};

export const CustomAreaChart = ({ data, colors = DEFAULT_COLORS, metrics }: ChartProps) => {
    const dataKeys = metrics || Object.keys(data[0]).filter(key => key !== 'date');

    return (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {dataKeys.map((key, index) => (
                    <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stackId="1"
                        stroke={colors[index % colors.length]}
                        fill={colors[index % colors.length]}
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
};

export const CustomRadarChart = ({ data, colors = DEFAULT_COLORS, metrics }: ChartProps) => {
    const dataKeys = metrics || Object.keys(data[0]).filter(key => key !== 'category');

    return (
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis />
                {dataKeys.map((key, index) => (
                    <Radar
                        key={key}
                        name={key}
                        dataKey={key}
                        stroke={colors[index % colors.length]}
                        fill={colors[index % colors.length]}
                        fillOpacity={0.6}
                    />
                ))}
                <Legend />
            </RadarChart>
        </ResponsiveContainer>
    );
};

interface RadarChartComponentProps {
    data: any[];
    colors?: string[];
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig


export function RadarChartComponent({ data, colors }: RadarChartComponentProps) {
    const dataKeys = Object.keys(data[0]).filter(key => key !== 'category');

    return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart - Legend</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[250px] w-full"
        >
          <RadarChart
            data={data}
            margin={{
              top: -40,
              bottom: -10,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="category" />
            <PolarGrid />
            {dataKeys.map((key, index) => (
                <Radar
                    dataKey={key}
                    name={key}
                    stroke={colors ? colors[index % colors.length] : DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                    fill={colors ? colors[index % colors.length] : DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                    fillOpacity={0.6}
                />
            ))}
            
            <ChartLegend className="mt-8" content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-4 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div> */}
      </CardFooter>
    </Card>
  )
}

export const DateLineChart = ({ data, colors = DEFAULT_COLORS, metrics }: ChartProps) => {


    const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("desktop")
    const total = useMemo(
    () => ({
      desktop: data.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: data.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  )
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Line Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


// Chart Selector Component
interface ChartSelectorProps {
    graphType: string;
    data: any[];
    colors?: string[];
    metrics?: string[];
    style?: React.CSSProperties;
    title?: string;
}

export const ChartSelector = ({ graphType, data, colors, metrics, title }: ChartSelectorProps) => {
    const getChart = () => {
        switch (graphType.toLowerCase()) {
            case 'linechart':
                return <CustomLineChart data={data} colors={colors} metrics={metrics} />;
            case 'barchart':
                return <DashboardBarChart data={data} colors={colors} metrics={metrics} />;
            case 'piechart':
                return <CustomPieChart data={data} colors={colors} />;
            case 'areachart':
                return <CustomAreaChart data={data} colors={colors} metrics={metrics} />;
            case 'radarchart':
                return <RadarChartComponent data={data} colors={colors} />;
            default:
                return <div>Unsupported chart type</div>;
        }
    };

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4" /* style={style} */>
            {getChart()}
        </div>
    );
};

interface TableData {
  header: string[];
  entries: (string | number)[][];
}

export const renderTable = (tableData: TableData) => {
  return (
      <motion.div
          initial={{ filter: "blur(10px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg"
      >
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                      <tr>
                          {tableData.header.map((header, index) => (
                              <th
                                  key={index}
                                  className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900 first:pl-6 last:pr-6"
                              >
                                  {header.split('_').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ')}
                              </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                      {tableData.entries.map((row, rowIndex) => (
                          <tr 
                              key={rowIndex}
                              className="hover:bg-gray-50 transition-colors"
                          >
                              {row.map((cell, cellIndex) => {
                                  // Determine if the cell is numeric
                                  const isNumeric = typeof cell === 'number';
                                  
                                  // Special formatting for different data types
                                  let formattedValue = cell;
                                  if (tableData.header[cellIndex] === 'bounce_rate') {
                                      formattedValue = `${(Number(cell) * 100).toFixed(1)}%`;
                                  } else if (tableData.header[cellIndex] === 'session_duration') {
                                      formattedValue = `${cell} sec`;
                                  }

                                  return (
                                      <td
                                          key={cellIndex}
                                          className={`whitespace-nowrap py-3 px-4 text-sm first:pl-6 last:pr-6
                                              ${isNumeric ? 'text-right font-medium text-gray-900' : 'text-gray-700'}
                                              ${tableData.header[cellIndex] === 'traffic_source' ? 'font-medium' : ''}
                                          `}
                                      >
                                         {/*  <TextGenerateEffect duration={3} stagerValue={0.01} filter={true} words={formattedValue.toString()} /> */}
                                          {formattedValue}
                                      </td>
                                  );
                              })}
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </motion.div>
  );
};