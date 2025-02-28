
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart as RechartsAreaChart
} from "recharts";

// Common chart data interface
interface ChartData {
  name: string;
  value: number;
}

// Colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];
const GRADIENT_COLORS = {
  start: "#8884d8",
  end: "#8884d820"
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-[#8884d8]">
          {`${payload[0].name === "value" ? "" : payload[0].name + ": "}${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

// Line Chart Component
export const LineChart = ({ data }: { data: ChartData[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 3, fill: "#8884d8", strokeWidth: 1 }}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

// Area Chart Component
export const AreaChart = ({ data }: { data: ChartData[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={GRADIENT_COLORS.start} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={GRADIENT_COLORS.end} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={GRADIENT_COLORS.start} 
          fillOpacity={1} 
          fill="url(#colorGradient)" 
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

// Bar Chart Component
export const BarChart = ({ data }: { data: ChartData[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.4}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          fill="url(#barGradient)" 
          radius={[4, 4, 0, 0]}
          barSize={30}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

// Pie Chart Component
export const PieChart = ({ data }: { data: ChartData[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          strokeWidth={1}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              stroke="rgba(255,255,255,0.2)"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
