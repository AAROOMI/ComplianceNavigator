import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, Search, Trash2, Edit, FileText, Database, FileSpreadsheet, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InteractiveRiskMeters from "@/components/dashboard/interactive-risk-meters";

interface Risk {
  id: string;
  asset: string;
  threat: string;
  vulnerability: string;
  impactC: number;
  impactI: number;
  impactA: number;
  likelihood: number;
  score: number;
  level: string;
  controls: string;
  treatment: string;
  createdAt: string;
}

type RiskLevel = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Severe';

export default function NFRMRiskManagement() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const { toast } = useToast();

  // Form state
  const [asset, setAsset] = useState("");
  const [threat, setThreat] = useState("");
  const [vulnerability, setVulnerability] = useState("");
  const [impactC, setImpactC] = useState(3);
  const [impactI, setImpactI] = useState(3);
  const [impactA, setImpactA] = useState(3);
  const [likelihood, setLikelihood] = useState(3);
  const [controls, setControls] = useState("");
  const [treatment, setTreatment] = useState("");

  // Load risks from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem("nfrm_risks");
    if (stored) {
      setRisks(JSON.parse(stored));
    }
  }, []);

  // Save risks to localStorage whenever risks change
  useEffect(() => {
    localStorage.setItem("nfrm_risks", JSON.stringify(risks));
  }, [risks]);

  const getRiskLevel = (score: number): RiskLevel => {
    if (score >= 20) return 'Severe';
    if (score >= 15) return 'High';
    if (score >= 9) return 'Medium';
    if (score >= 4) return 'Low';
    return 'Very Low';
  };

  const getRiskBadgeColor = (level: RiskLevel) => {
    switch (level) {
      case 'Severe': return 'bg-red-600 text-white hover:bg-red-700';
      case 'High': return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'Medium': return 'bg-yellow-500 text-black hover:bg-yellow-600';
      case 'Low': return 'bg-green-400 text-black hover:bg-green-500';
      case 'Very Low': return 'bg-green-200 text-black hover:bg-green-300';
      default: return 'bg-gray-200 text-black';
    }
  };

  const getMatrixCellColor = (score: number) => {
    if (score >= 20) return 'bg-red-200 hover:bg-red-300';
    if (score >= 15) return 'bg-orange-200 hover:bg-orange-300';
    if (score >= 9) return 'bg-yellow-200 hover:bg-yellow-300';
    if (score >= 4) return 'bg-green-200 hover:bg-green-300';
    return 'bg-green-100 hover:bg-green-200';
  };

  const calculateRiskScore = () => {
    const maxImpact = Math.max(impactC, impactI, impactA);
    return maxImpact * likelihood;
  };

  const resetForm = () => {
    setAsset("");
    setThreat("");
    setVulnerability("");
    setImpactC(3);
    setImpactI(3);
    setImpactA(3);
    setLikelihood(3);
    setControls("");
    setTreatment("");
    setEditingRisk(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!asset || !threat || !vulnerability) {
      toast({
        title: "Missing Information",
        description: "Please fill in Asset, Threat, and Vulnerability fields.",
        variant: "destructive",
      });
      return;
    }

    const score = calculateRiskScore();
    const level = getRiskLevel(score);

    const riskData = {
      id: editingRisk?.id || Date.now().toString(),
      asset,
      threat,
      vulnerability,
      impactC,
      impactI,
      impactA,
      likelihood,
      score,
      level,
      controls,
      treatment,
      createdAt: editingRisk?.createdAt || new Date().toISOString(),
    };

    if (editingRisk) {
      setRisks(risks.map(r => r.id === editingRisk.id ? riskData : r));
      toast({
        title: "Risk Updated",
        description: "Risk has been successfully updated.",
      });
    } else {
      setRisks([...risks, riskData]);
      toast({
        title: "Risk Added",
        description: "New risk has been added to the register.",
      });
    }

    resetForm();
  };

  const handleEdit = (risk: Risk) => {
    setAsset(risk.asset);
    setThreat(risk.threat);
    setVulnerability(risk.vulnerability);
    setImpactC(risk.impactC);
    setImpactI(risk.impactI);
    setImpactA(risk.impactA);
    setLikelihood(risk.likelihood);
    setControls(risk.controls);
    setTreatment(risk.treatment);
    setEditingRisk(risk);
  };

  const handleDelete = (id: string) => {
    setRisks(risks.filter(r => r.id !== id));
    toast({
      title: "Risk Deleted",
      description: "Risk has been removed from the register.",
    });
  };

  const handleResetAll = () => {
    if (confirm("Are you sure you want to delete all risks? This action cannot be undone.")) {
      setRisks([]);
      localStorage.removeItem("nfrm_risks");
      toast({
        title: "All Risks Cleared",
        description: "Risk register has been reset.",
      });
    }
  };

  const exportCSV = () => {
    const headers = ["Asset", "Threat", "Vulnerability", "Confidentiality", "Integrity", "Availability", "Likelihood", "Score", "Level", "Controls", "Treatment", "Created"];
    const csvContent = [
      headers.join(","),
      ...risks.map(r => [
        `"${r.asset}"`,
        `"${r.threat}"`,
        `"${r.vulnerability}"`,
        r.impactC,
        r.impactI,
        r.impactA,
        r.likelihood,
        r.score,
        `"${r.level}"`,
        `"${r.controls.replace(/"/g, '""')}"`,
        `"${r.treatment.replace(/"/g, '""')}"`,
        `"${new Date(r.createdAt).toLocaleString()}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nfrm_risk_register.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(risks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nfrm_risks.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredRisks = risks.filter(risk => {
    const searchLower = searchFilter.toLowerCase();
    return (
      risk.asset.toLowerCase().includes(searchLower) ||
      risk.threat.toLowerCase().includes(searchLower) ||
      risk.vulnerability.toLowerCase().includes(searchLower) ||
      risk.level.toLowerCase().includes(searchLower) ||
      risk.controls.toLowerCase().includes(searchLower) ||
      risk.treatment.toLowerCase().includes(searchLower)
    );
  });

  // Generate 5x5 matrix cells
  const matrixCells = [];
  for (let likelihood = 5; likelihood >= 1; likelihood--) {
    for (let impact = 1; impact <= 5; impact++) {
      const score = likelihood * impact;
      matrixCells.push({ likelihood, impact, score });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">NFRM Risk Assessment</h1>
            <p className="text-sm text-muted-foreground">National Framework for Cybersecurity Risk Management (NFCRM – 1:2024)</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          TLP: White • Public
        </Badge>
      </div>

      {/* Interactive Risk Meters */}
      <InteractiveRiskMeters />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingRisk ? 'Edit Risk' : 'New Risk'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="asset">Asset / Process</Label>
                <Input
                  id="asset"
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  placeholder="e.g., Payroll System"
                  required
                />
              </div>

              <div>
                <Label htmlFor="threat">Threat</Label>
                <Input
                  id="threat"
                  value={threat}
                  onChange={(e) => setThreat(e.target.value)}
                  placeholder="e.g., Ransomware"
                  required
                />
              </div>

              <div>
                <Label htmlFor="vulnerability">Vulnerability</Label>
                <Input
                  id="vulnerability"
                  value={vulnerability}
                  onChange={(e) => setVulnerability(e.target.value)}
                  placeholder="e.g., Unpatched server"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="impactC" className="text-xs">Confidentiality (1-5)</Label>
                  <Input
                    id="impactC"
                    type="number"
                    min="1"
                    max="5"
                    value={impactC}
                    onChange={(e) => setImpactC(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="impactI" className="text-xs">Integrity (1-5)</Label>
                  <Input
                    id="impactI"
                    type="number"
                    min="1"
                    max="5"
                    value={impactI}
                    onChange={(e) => setImpactI(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="impactA" className="text-xs">Availability (1-5)</Label>
                  <Input
                    id="impactA"
                    type="number"
                    min="1"
                    max="5"
                    value={impactA}
                    onChange={(e) => setImpactA(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="likelihood">Likelihood (1-5)</Label>
                <Select value={likelihood.toString()} onValueChange={(value) => setLikelihood(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 – Very Rare</SelectItem>
                    <SelectItem value="2">2 – Rare</SelectItem>
                    <SelectItem value="3">3 – Improbable</SelectItem>
                    <SelectItem value="4">4 – Probable</SelectItem>
                    <SelectItem value="5">5 – Almost Certain</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Time period + exploitability combined.</p>
              </div>

              <div>
                <Label htmlFor="controls">Existing Controls (optional)</Label>
                <Textarea
                  id="controls"
                  value={controls}
                  onChange={(e) => setControls(e.target.value)}
                  placeholder="e.g., EDR, daily backups, MFA"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="treatment">Proposed Treatment (optional)</Label>
                <Textarea
                  id="treatment"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  placeholder="e.g., Patch SLA, network segmentation"
                  rows={2}
                />
              </div>

              <div className="text-sm font-medium">
                Calculated Risk Score: <span className="text-lg font-bold text-primary">{calculateRiskScore()}</span>
                <span className="ml-2">
                  <Badge className={getRiskBadgeColor(getRiskLevel(calculateRiskScore()))}>
                    {getRiskLevel(calculateRiskScore())}
                  </Badge>
                </span>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingRisk ? 'Update Risk' : 'Add Risk'}
                </Button>
                {editingRisk && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 5x5 Risk Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>5×5 Risk Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-1 text-xs mb-4">
              {matrixCells.map(({ likelihood, impact, score }) => (
                <div
                  key={`${likelihood}-${impact}`}
                  className={`p-2 text-center rounded transition-all cursor-default ${getMatrixCellColor(score)}`}
                >
                  <div className="font-semibold">{score}</div>
                  <div className="text-[10px] opacity-70">{likelihood}×{impact}</div>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Scoring: Impact (max of C/I/A, 1–5) × Likelihood (1–5) ⇒ 1–25.</p>
              <p>Bands: 1–3 Very Low, 4–8 Low, 9–14 Medium, 15–19 High, 20–25 Severe.</p>
            </div>
          </CardContent>
        </Card>

        {/* Export & Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Export & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={exportCSV} variant="outline" className="w-full justify-start">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={exportJSON} variant="outline" className="w-full justify-start">
              <Database className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button onClick={handleResetAll} variant="destructive" className="w-full justify-start">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              All data is stored locally in your browser (localStorage).
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Register Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Risk Register ({risks.length} risks)</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search risks..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">#</th>
                  <th className="text-left p-2 font-medium">Asset</th>
                  <th className="text-left p-2 font-medium">Threat</th>
                  <th className="text-left p-2 font-medium">Vulnerability</th>
                  <th className="text-left p-2 font-medium">C/I/A</th>
                  <th className="text-left p-2 font-medium">Likelihood</th>
                  <th className="text-left p-2 font-medium">Score</th>
                  <th className="text-left p-2 font-medium">Level</th>
                  <th className="text-left p-2 font-medium">Controls</th>
                  <th className="text-left p-2 font-medium">Treatment</th>
                  <th className="text-left p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRisks.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center p-8 text-muted-foreground">
                      {searchFilter ? "No risks match your search criteria." : "No risks added yet. Add your first risk using the form above."}
                    </td>
                  </tr>
                ) : (
                  filteredRisks.map((risk, index) => (
                    <tr key={risk.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{risk.asset}</td>
                      <td className="p-2">{risk.threat}</td>
                      <td className="p-2">{risk.vulnerability}</td>
                      <td className="p-2">{risk.impactC}/{risk.impactI}/{risk.impactA}</td>
                      <td className="p-2">{risk.likelihood}</td>
                      <td className="p-2 font-semibold">{risk.score}</td>
                      <td className="p-2">
                        <Badge className={getRiskBadgeColor(risk.level as RiskLevel)}>
                          {risk.level}
                        </Badge>
                      </td>
                      <td className="p-2 max-w-32 truncate" title={risk.controls}>
                        {risk.controls || "-"}
                      </td>
                      <td className="p-2 max-w-32 truncate" title={risk.treatment}>
                        {risk.treatment || "-"}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(risk)}
                            data-testid={`button-edit-risk-${risk.id}`}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(risk.id)}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-risk-${risk.id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-xs text-muted-foreground">
        <p>
          Aligned with the National Framework for Cybersecurity Risk Management (NFCRM – 1:2024) draft (KSA). 
          Bands and likelihood labels follow the 5×5 matrix and probability descriptions. This tool is provided as-is.
        </p>
      </div>
    </div>
  );
}