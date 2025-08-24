import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, Filter, RotateCcw, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { RiskRegister } from "@shared/schema";

type RiskData = RiskRegister;

interface HeatMapCell {
  impact: string;
  likelihood: string;
  risks: RiskData[];
  severity: number;
  color: string;
}

const IMPACT_LEVELS = ["Very Low", "Low", "Medium", "High", "Critical"];
const LIKELIHOOD_LEVELS = ["Very Low", "Low", "Medium", "High", "Very High"];

const SEVERITY_COLORS = {
  1: "bg-green-200 dark:bg-green-900 border-green-300 dark:border-green-700",
  2: "bg-green-300 dark:bg-green-800 border-green-400 dark:border-green-600",
  3: "bg-yellow-200 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700",
  4: "bg-yellow-300 dark:bg-yellow-800 border-yellow-400 dark:border-yellow-600",
  5: "bg-orange-200 dark:bg-orange-900 border-orange-300 dark:border-orange-700",
  6: "bg-orange-300 dark:bg-orange-800 border-orange-400 dark:border-orange-600",
  7: "bg-red-200 dark:bg-red-900 border-red-300 dark:border-red-700",
  8: "bg-red-300 dark:bg-red-800 border-red-400 dark:border-red-600",
  9: "bg-red-400 dark:bg-red-700 border-red-500 dark:border-red-500",
  10: "bg-red-500 dark:bg-red-600 border-red-600 dark:border-red-400"
};

const SEVERITY_TEXT_COLORS = {
  1: "text-green-800 dark:text-green-200",
  2: "text-green-900 dark:text-green-100",
  3: "text-yellow-800 dark:text-yellow-200",
  4: "text-yellow-900 dark:text-yellow-100",
  5: "text-orange-800 dark:text-orange-200",
  6: "text-orange-900 dark:text-orange-100",
  7: "text-red-800 dark:text-red-200",
  8: "text-red-900 dark:text-red-100",
  9: "text-red-900 dark:text-red-100",
  10: "text-white dark:text-red-50"
};

export default function InteractiveRiskHeatMap() {
  const [selectedCell, setSelectedCell] = useState<HeatMapCell | null>(null);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const { data: riskData = [], isLoading } = useQuery<RiskData[]>({
    queryKey: ['/api/risk-register'],
  });

  // Calculate severity based on impact and likelihood
  const calculateSeverity = (impact: string, likelihood: string): number => {
    const impactIndex = IMPACT_LEVELS.indexOf(impact) + 1;
    const likelihoodIndex = LIKELIHOOD_LEVELS.indexOf(likelihood) + 1;
    return Math.min(Math.ceil((impactIndex * likelihoodIndex) / 2.5), 10);
  };

  // Create heat map matrix
  const createHeatMapMatrix = (): HeatMapCell[][] => {
    const matrix: HeatMapCell[][] = [];
    
    for (let i = IMPACT_LEVELS.length - 1; i >= 0; i--) {
      const row: HeatMapCell[] = [];
      for (let j = 0; j < LIKELIHOOD_LEVELS.length; j++) {
        const impact = IMPACT_LEVELS[i];
        const likelihood = LIKELIHOOD_LEVELS[j];
        const severity = calculateSeverity(impact, likelihood);
        
        // Filter risks by category if selected
        let filteredRisks = riskData.filter((risk) => 
          risk.impact === impact && risk.likelihood === likelihood
        );
        
        if (filterCategory !== "all") {
          filteredRisks = filteredRisks.filter((risk) => 
            risk.category === filterCategory
          );
        }
        
        row.push({
          impact,
          likelihood,
          risks: filteredRisks,
          severity,
          color: SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS]
        });
      }
      matrix.push(row);
    }
    
    return matrix;
  };

  const heatMapMatrix = createHeatMapMatrix();
  const categories = Array.from(new Set(riskData.map((risk) => risk.category)));

  // Animation effects
  useEffect(() => {
    if (!animationEnabled) return;
    
    const interval = setInterval(() => {
      const cells = document.querySelectorAll('.heat-map-cell');
      cells.forEach((cell, index) => {
        setTimeout(() => {
          cell.classList.add('animate-pulse');
          setTimeout(() => {
            cell.classList.remove('animate-pulse');
          }, 500);
        }, index * 50);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [animationEnabled, heatMapMatrix]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Risk Heat Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00adb5]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="risk-heat-map">
      <Card className="border-0 bg-gradient-to-br from-slate-900/80 to-blue-900/80 dark:from-slate-900/90 dark:to-blue-900/90">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-6 w-6" />
              Interactive Risk Heat Map
              <Badge variant="secondary" className="ml-2">
                {riskData.length} Risks
              </Badge>
            </CardTitle>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={animationEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAnimationEnabled(!animationEnabled)}
                      className="text-white border-white/20"
                    >
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle Animations</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCell(null)}
                      className="text-white border-white/20"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset Selection</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Category Filter */}
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-white" />
            <span className="text-white text-sm">Filter by Category:</span>
            <Button
              variant={filterCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory("all")}
              className="text-xs"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Heat Map Grid */}
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex items-center justify-between text-white text-sm">
              <span>Impact →</span>
              <span>Likelihood →</span>
            </div>
            
            {/* Column Headers (Likelihood) */}
            <div className="grid grid-cols-6 gap-1">
              <div></div> {/* Empty corner */}
              {LIKELIHOOD_LEVELS.map((likelihood) => (
                <div
                  key={likelihood}
                  className="text-center text-xs font-medium text-white p-2 bg-slate-700/50 rounded"
                >
                  {likelihood}
                </div>
              ))}
            </div>

            {/* Heat Map Matrix */}
            {heatMapMatrix.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-6 gap-1">
                {/* Row Header (Impact) */}
                <div className="text-center text-xs font-medium text-white p-2 bg-slate-700/50 rounded flex items-center justify-center">
                  {row[0].impact}
                </div>
                
                {/* Heat Map Cells */}
                {row.map((cell, colIndex) => (
                  <TooltipProvider key={colIndex}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`
                            heat-map-cell relative h-16 border-2 rounded-lg cursor-pointer
                            transition-all duration-500 hover:scale-105 hover:shadow-lg
                            ${cell.color}
                            ${selectedCell === cell ? 'ring-2 ring-white ring-offset-2' : ''}
                            ${animationEnabled ? 'hover:animate-pulse' : ''}
                          `}
                          onClick={() => setSelectedCell(cell)}
                          data-testid={`heat-map-cell-${rowIndex}-${colIndex}`}
                        >
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-lg font-bold ${SEVERITY_TEXT_COLORS[cell.severity as keyof typeof SEVERITY_TEXT_COLORS]}`}>
                              {cell.risks.length}
                            </span>
                            <span className={`text-xs ${SEVERITY_TEXT_COLORS[cell.severity as keyof typeof SEVERITY_TEXT_COLORS]}`}>
                              S{cell.severity}
                            </span>
                          </div>
                          
                          {/* Animated glow effect for high severity */}
                          {cell.severity >= 8 && animationEnabled && (
                            <div className="absolute inset-0 rounded-lg bg-red-500/20 animate-ping"></div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {cell.impact} Impact × {cell.likelihood} Likelihood
                          </p>
                          <p className="text-sm">Severity Level: {cell.severity}</p>
                          <p className="text-sm">{cell.risks.length} Risk(s)</p>
                          {cell.risks.length > 0 && (
                            <div className="max-w-xs">
                              <p className="text-xs font-medium mt-2">Recent Risks:</p>
                              {cell.risks.slice(0, 3).map((risk) => (
                                <p key={risk.id} className="text-xs truncate">• {risk.title}</p>
                              ))}
                              {cell.risks.length > 3 && (
                                <p className="text-xs">...and {cell.risks.length - 3} more</p>
                              )}
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ))}
          </div>

          {/* Severity Legend */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="text-white text-sm font-medium mb-2">Severity Scale:</p>
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((severity) => (
                <div
                  key={severity}
                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold border ${SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS]} ${SEVERITY_TEXT_COLORS[severity as keyof typeof SEVERITY_TEXT_COLORS]}`}
                >
                  {severity}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-white/70 mt-1">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Cell Details */}
      {selectedCell && selectedCell.risks.length > 0 && (
        <Card className="border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
          <CardHeader>
            <CardTitle className="text-white">
              Risk Details: {selectedCell.impact} Impact × {selectedCell.likelihood} Likelihood
              <Badge variant="secondary" className="ml-2">
                Severity {selectedCell.severity}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedCell.risks.map((risk) => (
                <Card key={risk.id} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <h4 className="font-medium text-white">{risk.title}</h4>
                        <p className="text-sm text-gray-300">{risk.description}</p>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {risk.category}
                          </Badge>
                          <Badge 
                            variant={
                              risk.riskLevel === 'Critical' ? 'destructive' :
                              risk.riskLevel === 'High' ? 'destructive' :
                              risk.riskLevel === 'Medium' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {risk.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}