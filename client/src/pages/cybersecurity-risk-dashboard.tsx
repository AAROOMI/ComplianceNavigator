import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  BarChart3, 
  FileText, 
  Info, 
  Home,
  Settings,
  Globe,
  User
} from 'lucide-react';

interface Risk {
  id: number;
  title: string;
  likelihood: 'Low' | 'High';
  impact: number;
  controlEffectiveness: number;
  result: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export default function CybersecurityRiskDashboard() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [activeFilter, setActiveFilter] = useState('Medium');
  
  // Sample risk data based on the interface
  const risks: Risk[] = [
    {
      id: 1,
      title: 'Lession',
      likelihood: 'Low',
      impact: 10,
      controlEffectiveness: 15,
      result: 15,
      riskLevel: 'Low'
    },
    {
      id: 2,
      title: 'Medium',
      likelihood: 'High',
      impact: 51,
      controlEffectiveness: 28,
      result: 28,
      riskLevel: 'High'
    },
    {
      id: 3,
      title: 'High',
      likelihood: 'Low',
      impact: 31,
      controlEffectiveness: 30,
      result: 30,
      riskLevel: 'Medium'
    },
    {
      id: 4,
      title: 'Impact',
      likelihood: 'Low',
      impact: 20,
      controlEffectiveness: 30,
      result: 30,
      riskLevel: 'Low'
    },
    {
      id: 5,
      title: 'Accdem',
      likelihood: 'High',
      impact: 10,
      controlEffectiveness: 50,
      result: 50,
      riskLevel: 'High'
    },
    {
      id: 6,
      title: 'Licenc',
      likelihood: 'Low',
      impact: 5,
      controlEffectiveness: 20,
      result: 20,
      riskLevel: 'Low'
    },
    {
      id: 7,
      title: 'Scarrigos',
      likelihood: 'High',
      impact: 20,
      controlEffectiveness: 30,
      result: 30,
      riskLevel: 'High'
    }
  ];

  const riskDistributionData = [
    { level: 'Low', count: 2, color: '#10B981' },
    { level: 'Medium', count: 4, color: '#F59E0B' },
    { level: 'High', count: 6, color: '#EF4444' },
    { level: 'Critic', count: 8, color: '#DC2626' },
    { level: 'Critical', count: 10, color: '#991B1B' }
  ];

  const totalRisks = 62;
  const highRisks = 12;
  const mediumRisks = 38;

  const getCircularProgress = (value: number, max: number) => {
    return (value / max) * 100;
  };

  const getLikelihoodColor = (likelihood: string) => {
    return likelihood === 'High' ? 'bg-red-500' : 'bg-blue-500';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Cybersecurity Risk Assessment</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">أين الشبكة ثابتة</span>
            <button className="flex items-center gap-1 px-3 py-1 text-sm border border-slate-600 rounded hover:bg-slate-800">
              <Globe className="w-4 h-4" />
              English
              <span className="ml-1">▼</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1 text-sm">
              <User className="w-4 h-4" />
              admin
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-48 bg-slate-800 min-h-screen p-4">
          <nav className="space-y-2">
            <button className="flex items-center gap-3 w-full px-3 py-2 text-left rounded bg-slate-700">
              <Home className="w-4 h-4" />
              Dashboard
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 text-left rounded hover:bg-slate-700">
              <Shield className="w-4 h-4" />
              Risks
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 text-left rounded hover:bg-slate-700">
              <Info className="w-4 h-4" />
              @{}
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 text-left rounded hover:bg-slate-700">
              <Globe className="w-4 h-4" />
              inf ge
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 text-left rounded hover:bg-slate-700">
              <FileText className="w-4 h-4" />
              Reports
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Risks */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-2">Total risks</div>
                  <div className="text-4xl font-bold">{totalRisks}</div>
                </div>
              </CardContent>
            </Card>

            {/* High Risks Gauge */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-2">High risks</div>
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${getCircularProgress(highRisks, 50) * 2.51} 251`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{highRisks}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medium Risks Gauge */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-2">Medium</div>
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${getCircularProgress(mediumRisks, 50) * 2.51} 251`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{mediumRisks}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filter Gauge */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-2">{language === 'ar' ? 'التصفية' : 'Filter'}</div>
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="8"
                      />
                      {/* Multi-colored progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="62.8 188.4"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="62.8 188.4"
                        strokeDashoffset="-62.8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="62.8 188.4"
                        strokeDashoffset="-125.6"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold">Medium</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Distribution Chart */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Bar Chart */}
                  <div className="flex items-end gap-2 h-40">
                    {riskDistributionData.map((item) => (
                      <div key={item.level} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t"
                          style={{
                            height: `${(item.count / 10) * 100}%`,
                            backgroundColor: item.color
                          }}
                        />
                        <span className="text-xs text-slate-400">{item.level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rear Test Section */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Rear test</h4>
                  <div className="flex gap-4 text-xs">
                    <button className="px-3 py-1 bg-slate-700 rounded text-slate-300 hover:bg-slate-600">المستمرة</button>
                    <button className="px-3 py-1 bg-slate-700 rounded text-slate-300 hover:bg-slate-600">جودة البيانات</button>
                    <button className="px-3 py-1 bg-slate-700 rounded text-slate-300 hover:bg-slate-600">مراجع</button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risks Table */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Risks</CardTitle>
                <span className="text-sm text-slate-400">وثيقة</span>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-2 text-slate-400">Title</th>
                        <th className="text-left py-2 text-slate-400">Likelihood</th>
                        <th className="text-left py-2 text-slate-400">Impact</th>
                        <th className="text-left py-2 text-slate-400">Control Effectiveness</th>
                        <th className="text-left py-2 text-slate-400">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {risks.map((risk) => (
                        <tr key={risk.id} className="border-b border-slate-700">
                          <td className="py-3">{risk.title}</td>
                          <td className="py-3">
                            <Badge className={`${getLikelihoodColor(risk.likelihood)} text-white`}>
                              {risk.likelihood}
                            </Badge>
                          </td>
                          <td className="py-3">{risk.impact}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <Progress value={risk.controlEffectiveness * 2} className="flex-1 h-2" />
                            </div>
                          </td>
                          <td className="py-3 font-medium">{risk.result}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}