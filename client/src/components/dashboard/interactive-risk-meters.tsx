import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RiskMeterProps {
  title: string;
  value: number;
  maxValue: number;
  color: string;
  strokeColor: string;
  textColor: string;
}

const CircularMeter: React.FC<RiskMeterProps> = ({ 
  title, 
  value, 
  maxValue, 
  color, 
  strokeColor, 
  textColor 
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={strokeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${textColor}`}>{value}</span>
          {maxValue > 0 && (
            <span className="text-xs text-muted-foreground">/ {maxValue}</span>
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{title}</p>
      </div>
    </div>
  );
};

const RiskLevelIndicator: React.FC<{ level: string; percentage: number }> = ({ 
  level, 
  percentage 
}) => {
  const getColorByLevel = (level: string) => {
    switch (level.toLowerCase()) {
      case "low": return { bg: "bg-green-500", text: "text-green-500" };
      case "medium": return { bg: "bg-yellow-500", text: "text-yellow-500" };
      case "high": return { bg: "bg-orange-500", text: "text-orange-500" };
      case "critical": return { bg: "bg-red-500", text: "text-red-500" };
      default: return { bg: "bg-blue-500", text: "text-blue-500" };
    }
  };

  const colors = getColorByLevel(level);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${colors.text}`}
            style={{
              filter: `drop-shadow(0 0 6px currentColor)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Badge className={`${colors.bg} text-white font-semibold px-3 py-1`}>
            {level}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default function InteractiveRiskMeters() {
  // Real data would come from API calls
  const riskData = {
    totalRisks: 62,
    highRisks: 12,
    mediumRisks: 38,
    lowRisks: 12,
    currentRiskLevel: "Medium",
    riskPercentage: 61 // Based on medium risk assessment
  };

  return (
    <div className="space-y-6">
      {/* Main Risk Meters */}
      <Card className="glass-card border-0 bg-gradient-to-br from-slate-900/80 to-blue-900/80 dark:from-slate-900/90 dark:to-blue-900/90">
        <CardHeader>
          <CardTitle className="text-white">Cybersecurity Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Total Risks */}
            <CircularMeter
              title="Total Risks"
              value={riskData.totalRisks}
              maxValue={0}
              color="#3b82f6"
              strokeColor="#3b82f6"
              textColor="text-blue-400"
            />

            {/* High Risks */}
            <CircularMeter
              title="High Risks"
              value={riskData.highRisks}
              maxValue={riskData.totalRisks}
              color="#f97316"
              strokeColor="#f97316"
              textColor="text-orange-400"
            />

            {/* Medium Risks */}
            <CircularMeter
              title="Medium Risks"
              value={riskData.mediumRisks}
              maxValue={riskData.totalRisks}
              color="#eab308"
              strokeColor="#eab308"
              textColor="text-yellow-400"
            />

            {/* Risk Level Indicator */}
            <RiskLevelIndicator
              level={riskData.currentRiskLevel}
              percentage={riskData.riskPercentage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Risk Distribution Chart */}
      <Card className="glass-card border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
        <CardHeader>
          <CardTitle className="text-white">Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Bar Chart Visualization */}
            <div className="flex items-end justify-center space-x-4 h-40">
              {[
                { label: "Low", value: 12, color: "bg-green-500", height: "30%" },
                { label: "Medium", value: 38, color: "bg-yellow-500", height: "65%" },
                { label: "High", value: 12, color: "bg-orange-500", height: "35%" },
                { label: "Critical", value: 0, color: "bg-red-500", height: "15%" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-12 ${item.color} rounded-t transition-all duration-1000 ease-out`}
                    style={{ height: item.height }}
                  />
                  <span className="text-xs text-white font-medium">{item.label}</span>
                  <span className="text-xs text-gray-300">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Summary Table */}
      <Card className="glass-card border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
        <CardHeader>
          <CardTitle className="text-white">Risk Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Likelihood</th>
                  <th className="text-left p-2">Impact</th>
                  <th className="text-left p-2">Control Effectiveness</th>
                  <th className="text-left p-2">Result</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {[
                  { title: "Data Breach", likelihood: "Low", impact: "10", effectiveness: 85, result: 15 },
                  { title: "Phishing Attack", likelihood: "High", impact: "51", effectiveness: 75, result: 28 },
                  { title: "System Failure", likelihood: "Low", impact: "31", effectiveness: 90, result: 30 },
                  { title: "Insider Threat", likelihood: "Low", impact: "20", effectiveness: 80, result: 30 },
                  { title: "Malware", likelihood: "High", impact: "10", effectiveness: 70, result: 50 },
                ].map((risk, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/50">
                    <td className="p-2 font-medium">{risk.title}</td>
                    <td className="p-2">
                      <Badge 
                        className={
                          risk.likelihood === "High" ? "bg-red-500" : 
                          risk.likelihood === "Medium" ? "bg-yellow-500" : "bg-green-500"
                        }
                      >
                        {risk.likelihood}
                      </Badge>
                    </td>
                    <td className="p-2">{risk.impact}</td>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-600 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full transition-all duration-1000"
                            style={{ width: `${risk.effectiveness}%` }}
                          />
                        </div>
                        <span className="text-sm">{risk.effectiveness}%</span>
                      </div>
                    </td>
                    <td className="p-2">{risk.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}