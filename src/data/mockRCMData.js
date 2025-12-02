// RCM Analytics Dashboard - Mock Dataset
// Generated synthetic data for Revenue Cycle Management analytics

const generateMockRCMData = () => {
  const queryTypes = [
    "Level of Care LOC",
    "No Authorization",
    "No Service",
    "Tariff Issue",
    "Clinical Query"
  ];

  const queryStatuses = ["Open", "Closed", "Pending", "Escalated"];

  const medicalAidNames = ["GEMS", "Discovery", "Sizwe", "Bonitas"];
  const medicalAidGroups = ["Public", "Private", "Corporate", "Individual"];

  const teams = [
    "Team Alpha",
    "Team Beta",
    "Team Gamma",
    "Team Delta",
    "Collections Team",
    "Billing Team",
    "Verification Team"
  ];

  const creditors = [
    "Netcare Hospital",
    "Life Healthcare",
    "Mediclinic",
    "Cure Day Hospital",
    "Busamed Hospital",
    "Melomed Hospital",
    "Lenmed Hospital"
  ];

  const queryDivisions = [
    "Emergency",
    "Surgery",
    "ICU",
    "Maternity",
    "Cardiology",
    "Oncology",
    "General Ward"
  ];

  const caseStatuses = ["Active", "Resolved", "Under Review", "Appealed"];
  const caseUsers = ["John Smith", "Sarah Johnson", "Mike Davis", "Emma Wilson", "David Brown", "Lisa Anderson"];
  const queryUsers = ["Alice Cooper", "Bob Miller", "Carol White", "Daniel Lee", "Eva Martinez", "Frank Taylor"];
  const supervisors = ["Supervisor A", "Supervisor B", "Supervisor C", "Supervisor D"];

  const cycles = ["Q1", "Q2", "Q3", "Q4"];
  const years = [2023, 2024, 2025];
  const typeOfAmounts = ["Claim", "Refund", "Adjustment", "Write-off"];
  const category2s = ["Inpatient", "Outpatient", "Emergency", "Day Case"];
  const scuCats = ["High Priority", "Medium Priority", "Low Priority", "Urgent"];
  const escalationTiers = ["Tier 1", "Tier 2", "Tier 3", "Tier 4"];
  const priorities = ["P1", "P2", "P3", "P4"];

  const bocOptions = ["Y", "N"];
  const loResponsibilities = ["LO Team A", "LO Team B", "LO Team C"];
  const escalationResponsibilities = ["Escalation Manager A", "Escalation Manager B", "Escalation Manager C"];

  const data = [];
  const startDate = new Date(2023, 0, 1);
  const endDate = new Date(2025, 11, 31);

  for (let i = 0; i < 300; i++) {
    const account = `ACC${String(i + 1000).padStart(6, '0')}`;
    const accountHolder = `Patient ${i + 1}`;
    const queryUser = queryUsers[Math.floor(Math.random() * queryUsers.length)];
    const supervisor = supervisors[Math.floor(Math.random() * supervisors.length)];
    const queryDivision = queryDivisions[Math.floor(Math.random() * queryDivisions.length)];
    
    // Generate dates
    const debtStartDate = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    );
    const debtEndDate = new Date(debtStartDate);
    debtEndDate.setDate(debtEndDate.getDate() + Math.floor(Math.random() * 180));
    
    const dateIn = new Date(debtStartDate);
    dateIn.setDate(dateIn.getDate() + Math.floor(Math.random() * 30));
    
    const periodIn = `${dateIn.getFullYear()}-${String(dateIn.getMonth() + 1).padStart(2, '0')}`;
    
    const balanceIn = Math.round((Math.random() * 149900 + 100) * 100) / 100;
    const queryValue = Math.round((Math.random() * 149900 + 100) * 100) / 100;
    
    const dateOut = Math.random() > 0.3 ? new Date(dateIn) : null;
    if (dateOut) {
      dateOut.setDate(dateOut.getDate() + Math.floor(Math.random() * 90));
    }
    
    const periodOut = dateOut ? `${dateOut.getFullYear()}-${String(dateOut.getMonth() + 1).padStart(2, '0')}` : null;
    
    const queryType = queryTypes[Math.floor(Math.random() * queryTypes.length)];
    const queryStatus = queryStatuses[Math.floor(Math.random() * queryStatuses.length)];
    
    const lastOutcome = queryStatus === "Closed" ? "Resolved" : 
                       queryStatus === "Escalated" ? "Under Review" : 
                       queryStatus === "Pending" ? "Awaiting Response" : "In Progress";
    
    const lastWorked = new Date(dateIn);
    lastWorked.setDate(lastWorked.getDate() + Math.floor(Math.random() * 60));
    
    const currentBalance = Math.round((Math.random() * 149900 + 100) * 100) / 100;
    
    const medicalAidName = medicalAidNames[Math.floor(Math.random() * medicalAidNames.length)];
    const medicalAidGroup = medicalAidGroups[Math.floor(Math.random() * medicalAidGroups.length)];
    
    const caseStatus = caseStatuses[Math.floor(Math.random() * caseStatuses.length)];
    const caseUser = caseUsers[Math.floor(Math.random() * caseUsers.length)];
    
    const cycle = cycles[Math.floor(Math.random() * cycles.length)];
    const creditor = creditors[Math.floor(Math.random() * creditors.length)];
    const year = years[Math.floor(Math.random() * years.length)];
    
    const typeOfAmount = typeOfAmounts[Math.floor(Math.random() * typeOfAmounts.length)];
    const category2 = category2s[Math.floor(Math.random() * category2s.length)];
    
    const ageDays = Math.floor(Math.random() * 1200);
    const billDateAge = Math.floor(Math.random() * 1200);
    
    const outstandingValue = Math.round((Math.random() * 149900 + 100) * 100) / 100;
    const eQueryValue = Math.round((Math.random() * 149900 + 100) * 100) / 100;
    
    const age = Math.floor(Math.random() * 100);
    
    const staleClaimRisk = ageDays > 90 ? "Y" : "N";
    const noService = Math.random() > 0.7 ? "Y" : "N";
    
    const teamResponsible = teams[Math.floor(Math.random() * teams.length)];
    
    const lastWorked1 = new Date(lastWorked);
    lastWorked1.setDate(lastWorked1.getDate() + Math.floor(Math.random() * 30));
    
    const extraQuery = Math.random() > 0.6 ? "Y" : "N";
    const eQueryBaseline = Math.round((Math.random() * 149900 + 100) * 100) / 100;
    
    const scuPriority = priorities[Math.floor(Math.random() * priorities.length)];
    const scuCat = scuCats[Math.floor(Math.random() * scuCats.length)];
    
    const execSplit = Math.round((Math.random() * 100) * 100) / 100;
    const base = Math.round((Math.random() * 100000) * 100) / 100;
    
    const approachingStale = ageDays > 60 && ageDays <= 90 ? "Y" : "N";
    const boc = bocOptions[Math.floor(Math.random() * bocOptions.length)];
    
    const loResponsibility = loResponsibilities[Math.floor(Math.random() * loResponsibilities.length)];
    
    const escalationTier = escalationTiers[Math.floor(Math.random() * escalationTiers.length)];
    const escalationResponsibility = escalationResponsibilities[Math.floor(Math.random() * escalationResponsibilities.length)];
    
    const priority = priorities[Math.floor(Math.random() * priorities.length)];

    data.push({
      Account: account,
      "Account Holder": accountHolder,
      "Query User": queryUser,
      Supervisor: supervisor,
      "Query Division": queryDivision,
      "Debt Start Date": debtStartDate.toISOString().split('T')[0],
      "Debt End Date": debtEndDate.toISOString().split('T')[0],
      "Date In": dateIn.toISOString().split('T')[0],
      "Period In": periodIn,
      "Balance In": balanceIn,
      "Query Value": queryValue,
      "Date Out": dateOut ? dateOut.toISOString().split('T')[0] : null,
      "Period Out": periodOut,
      "Query Type": queryType,
      "Query Status": queryStatus,
      "Last Outcome": lastOutcome,
      "Last Worked": lastWorked.toISOString().split('T')[0],
      "Current Balance": currentBalance,
      "Medical Aid Name": medicalAidName,
      "Medical Aid Group": medicalAidGroup,
      "Case Status": caseStatus,
      "Case User": caseUser,
      Cycle: cycle,
      Creditor: creditor,
      Year: year,
      "Type of amount": typeOfAmount,
      Category2: category2,
      "Age Days": ageDays,
      "Bill Date Age": billDateAge,
      "Outstanding Value": outstandingValue,
      "E-Query Value": eQueryValue,
      Age: age,
      "Stale Claim Risk": staleClaimRisk,
      "No Service": noService,
      "Team Responsible": teamResponsible,
      "Last Worked.1": lastWorked1.toISOString().split('T')[0],
      "Extra Query": extraQuery,
      "E-Query Baseline": eQueryBaseline,
      "SCU Priority": scuPriority,
      "SCU Cat": scuCat,
      "Exec Split": execSplit,
      Base: base,
      "Approching Stale": approachingStale,
      BOC: boc,
      "LO Responsibility": loResponsibility,
      "Escalation Tier": escalationTier,
      "Escalation Responsibility": escalationResponsibility,
      Priority: priority
    });
  }

  return data;
};

// Generate the main dataset
export const mockRCMData = generateMockRCMData();

// Summary objects for donut charts
export const donutChartData = {
  queryType: mockRCMData.reduce((acc, row) => {
    const type = row["Query Type"];
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {}),

  medicalAid: mockRCMData.reduce((acc, row) => {
    const aid = row["Medical Aid Name"];
    acc[aid] = (acc[aid] || 0) + 1;
    return acc;
  }, {}),

  teamResponsible: mockRCMData.reduce((acc, row) => {
    const team = row["Team Responsible"];
    acc[team] = (acc[team] || 0) + 1;
    return acc;
  }, {})
};

// Summary for bar chart - Outstanding Value by Creditor
export const barChartData = mockRCMData.reduce((acc, row) => {
  const creditor = row.Creditor;
  if (!acc[creditor]) {
    acc[creditor] = 0;
  }
  acc[creditor] += row["Outstanding Value"];
  return acc;
}, {});

// Trend series for line chart - Monthly Outstanding Value totals (2023-2025)
export const lineChartData = (() => {
  const monthlyData = {};
  
  mockRCMData.forEach(row => {
    const period = row["Period In"];
    if (!monthlyData[period]) {
      monthlyData[period] = 0;
    }
    monthlyData[period] += row["Outstanding Value"];
  });
  
  // Convert to array format sorted by date
  return Object.entries(monthlyData)
    .map(([period, value]) => ({
      period,
      value: Math.round(value * 100) / 100,
      year: parseInt(period.split('-')[0]),
      month: parseInt(period.split('-')[1])
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
})();

// Additional summary statistics
export const summaryStats = {
  totalAccounts: mockRCMData.length,
  totalOutstandingValue: mockRCMData.reduce((sum, row) => sum + row["Outstanding Value"], 0),
  totalCurrentBalance: mockRCMData.reduce((sum, row) => sum + row["Current Balance"], 0),
  averageAgeDays: mockRCMData.reduce((sum, row) => sum + row["Age Days"], 0) / mockRCMData.length,
  staleClaimCount: mockRCMData.filter(row => row["Stale Claim Risk"] === "Y").length,
  openQueries: mockRCMData.filter(row => row["Query Status"] === "Open").length,
  closedQueries: mockRCMData.filter(row => row["Query Status"] === "Closed").length
};

export default mockRCMData;

