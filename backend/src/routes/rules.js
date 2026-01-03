const express = require('express');
const router = express.Router();

// HRMS Rules Data
const rulesData = {
  attendance: {
    title: "Attendance Rules",
    icon: "🕐",
    rules: [
      {
        id: "att_001",
        title: "Check-in Timing",
        description: "All employees must check in between 9:00 AM and 9:30 AM.",
        details: "If you arrive after 9:30 AM, it will be marked as late arrival. Three late arrivals in a month will result in salary deduction.",
        severity: "high"
      },
      {
        id: "att_002", 
        title: "Check-out Timing",
        description: "Standard work hours are 9:30 AM to 6:30 PM.",
        details: "Early check-out requires prior approval from your manager. Unapproved early departure will affect attendance records.",
        severity: "medium"
      },
      {
        id: "att_003",
        title: "Grace Period",
        description: "10-minute grace period is provided for check-in.",
        details: "Employees arriving between 9:30 AM and 9:40 AM will have the grace period applied. This is limited to 3 times per month.",
        severity: "low"
      },
      {
        id: "att_004",
        title: "Leave During Work Hours",
        description: "For any personal work during office hours, permission is required.",
        details: "You must inform your manager and get approval before leaving office premises during work hours. Unauthorized absence may lead to disciplinary action.",
        severity: "high"
      }
    ]
  },
  leave: {
    title: "Leave Policy",
    icon: "🏖️",
    rules: [
      {
        id: "leave_001",
        title: "Paid Leave Eligibility",
        description: "After completing 6 months of service, employees become eligible for paid leave.",
        details: "New employees are eligible for 12 paid leave days annually after probation period. Leave accrues monthly.",
        severity: "medium"
      },
      {
        id: "leave_002",
        title: "Leave Application Notice",
        description: "Leave applications must be submitted at least 3 days in advance.",
        details: "For emergency situations, immediate leave may be considered with proper documentation. All leaves require manager approval.",
        severity: "high"
      },
      {
        id: "leave_003",
        title: "Sick Leave Policy",
        description: "Maximum 8 sick leaves per year with medical certificate.",
        details: "Sick leave beyond 2 days requires medical certificate. Unused sick leave cannot be carried forward.",
        severity: "medium"
      },
      {
        id: "leave_004",
        title: "Leave Encashment",
        description: "Paid leave can be encashed after 2 years of service.",
        details: "Maximum 5 leave days can be encashed per year. Encashment amount will be calculated based on basic salary.",
        severity: "low"
      }
    ]
  },
  conduct: {
    title: "Code of Conduct",
    icon: "📋",
    rules: [
      {
        id: "conduct_001",
        title: "Professional Behavior",
        description: "Maintain professional behavior with colleagues and clients.",
        details: "Any form of harassment, discrimination, or inappropriate behavior will result in strict disciplinary action, including termination.",
        severity: "high"
      },
      {
        id: "conduct_002",
        title: "Confidentiality",
        description: "All company information is confidential and proprietary.",
        details: "Employees must not share any confidential information with external parties. Breach of confidentiality may lead to legal action.",
        severity: "high"
      },
      {
        id: "conduct_003",
        title: "Social Media Policy",
        description: "Do not post defamatory or confidential information about company on social media.",
        details: "Employees are responsible for their social media activity related to the company. Violation may result in disciplinary action.",
        severity: "medium"
      },
      {
        id: "conduct_004",
        title: "Office Property",
        description: "Office equipment and property must be used responsibly.",
        details: "Any damage to company property due to negligence will be charged to the employee. Theft or misuse will lead to immediate termination.",
        severity: "high"
      }
    ]
  },
  benefits: {
    title: "Employee Benefits",
    icon: "🎁",
    rules: [
      {
        id: "benefit_001",
        title: "Health Insurance",
        description: "Comprehensive health insurance for all permanent employees.",
        details: "Coverage includes medical, dental, and vision. Premiums are covered 80% by company. Dependent coverage available at additional cost.",
        severity: "low"
      },
      {
        id: "benefit_002",
        title: "Provident Fund",
        description: "12% of basic salary contributed to provident fund.",
        details: "Company matches employee contribution. Full vesting after 5 years of service. Available for withdrawal in specific circumstances.",
        severity: "low"
      },
      {
        id: "benefit_003",
        title: "Performance Bonus",
        description: "Annual performance bonus based on individual and company performance.",
        details: "Bonus amount ranges from 1-3 months of basic salary. Performance reviews conducted quarterly.",
        severity: "low"
      },
      {
        id: "benefit_004",
        title: "Training & Development",
        description: "Annual training budget of $1000 per employee.",
        details: "Courses must be relevant to job role. Prior approval required. Reimbursement provided upon course completion.",
        severity: "low"
      }
    ]
  }
};

// GET /api/rules - Get all rules categories
router.get('/', (req, res) => {
  try {
    const categories = Object.keys(rulesData).map(key => ({
      id: key,
      title: rulesData[key].title,
      icon: rulesData[key].icon,
      ruleCount: rulesData[key].rules.length
    }));
    
    res.json({
      success: true,
      data: categories,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch rules' 
    });
  }
});

// GET /api/rules/:category - Get rules for specific category
router.get('/:category', (req, res) => {
  try {
    const { category } = req.params;
    
    if (!rulesData[category]) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
      });
    }
    
    res.json({
      success: true,
      data: rulesData[category],
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching category rules:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch category rules' 
    });
  }
});

// GET /api/rules/:category/:ruleId - Get specific rule
router.get('/:category/:ruleId', (req, res) => {
  try {
    const { category, ruleId } = req.params;
    
    if (!rulesData[category]) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
      });
    }
    
    const rule = rulesData[category].rules.find(r => r.id === ruleId);
    
    if (!rule) {
      return res.status(404).json({ 
        success: false, 
        error: 'Rule not found' 
      });
    }
    
    res.json({
      success: true,
      data: rule,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching rule:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch rule' 
    });
  }
});

module.exports = router;