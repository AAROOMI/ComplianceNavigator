import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { domains } from "@shared/schema";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
    },
  },
};

export default function DomainScores() {
  // Mock scores
  const scores = [80, 65, 70, 85, 60];

  const data = {
    labels: domains,
    datasets: [
      {
        data: scores,
        backgroundColor: "hsl(var(--primary) / 0.8)",
        borderColor: "hsl(var(--primary))",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-[300px]">
      <Bar options={options} data={data} />
    </div>
  );
}
