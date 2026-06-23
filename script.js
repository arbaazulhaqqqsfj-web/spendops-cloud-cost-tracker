const services = [
  {
    name: "EC2",
    category: "compute",
    usage: "18 instance hours",
    cost: 7.84,
    status: "warning",
  },
  {
    name: "S3",
    category: "storage",
    usage: "8.7 GB stored",
    cost: 1.18,
    status: "safe",
  },
  {
    name: "Lambda",
    category: "compute",
    usage: "740k requests",
    cost: 0.42,
    status: "safe",
  },
  {
    name: "DynamoDB",
    category: "database",
    usage: "1.1M reads/writes",
    cost: 2.34,
    status: "safe",
  },
  {
    name: "CloudFront",
    category: "network",
    usage: "42 GB transfer",
    cost: 3.96,
    status: "warning",
  },
  {
    name: "CloudWatch",
    category: "network",
    usage: "11 GB logs",
    cost: 2.78,
    status: "warning",
  },
];

const freeTier = [
  { name: "Lambda requests", used: 74, detail: "740k of 1M monthly requests" },
  { name: "S3 storage", used: 58, detail: "8.7 GB of estimated student budget limit" },
  { name: "CloudFront transfer", used: 84, detail: "42 GB of 50 GB starter threshold" },
  { name: "DynamoDB operations", used: 46, detail: "1.1M operations this month" },
];

let budget = Number(localStorage.getItem("spendops-budget")) || 25;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const elements = {
  currentSpend: document.querySelector("#currentSpend"),
  monthlyBudget: document.querySelector("#monthlyBudget"),
  forecastSpend: document.querySelector("#forecastSpend"),
  budgetMeter: document.querySelector("#budgetMeter"),
  spendStatus: document.querySelector("#spendStatus"),
  riskLevel: document.querySelector("#riskLevel"),
  riskMessage: document.querySelector("#riskMessage"),
  serviceRows: document.querySelector("#serviceRows"),
  serviceFilter: document.querySelector("#serviceFilter"),
  alertList: document.querySelector("#alertList"),
  tierList: document.querySelector("#tierList"),
  recommendationList: document.querySelector("#recommendationList"),
  refreshData: document.querySelector("#refreshData"),
  editBudget: document.querySelector("#editBudget"),
  themeToggle: document.querySelector("#themeToggle"),
};

function getSpend() {
  return services.reduce((total, service) => total + service.cost, 0);
}

function getRiskLevel(spend, forecast) {
  const budgetUsage = forecast / budget;

  if (budgetUsage >= 1) {
    return {
      level: "High",
      message: "Forecast is above your monthly budget.",
      meterColor: "var(--red)",
    };
  }

  if (budgetUsage >= 0.75) {
    return {
      level: "Medium",
      message: "Forecast is close to your monthly budget.",
      meterColor: "var(--amber)",
    };
  }

  return {
    level: "Safe",
    message: "Current usage is within the monthly budget.",
    meterColor: "var(--green)",
  };
}

function renderSummary() {
  const spend = getSpend();
  const forecast = spend * 1.42;
  const budgetPercent = Math.min((spend / budget) * 100, 100);
  const risk = getRiskLevel(spend, forecast);

  elements.currentSpend.textContent = money.format(spend);
  elements.monthlyBudget.textContent = money.format(budget);
  elements.forecastSpend.textContent = money.format(forecast);
  elements.budgetMeter.style.width = `${budgetPercent}%`;
  elements.budgetMeter.style.background = risk.meterColor;
  elements.spendStatus.textContent = `${Math.round(budgetPercent)}% of your monthly budget used.`;
  elements.riskLevel.textContent = risk.level;
  elements.riskMessage.textContent = risk.message;
}

function renderServices() {
  const selected = elements.serviceFilter.value;
  const filtered = selected === "all" ? services : services.filter((service) => service.category === selected);

  elements.serviceRows.innerHTML = filtered
    .map(
      (service) => `
        <tr>
          <td><strong>${service.name}</strong></td>
          <td>${service.category}</td>
          <td>${service.usage}</td>
          <td>${money.format(service.cost)}</td>
          <td><span class="badge ${service.status}">${service.status}</span></td>
        </tr>
      `
    )
    .join("");
}

function renderFreeTier() {
  elements.tierList.innerHTML = freeTier
    .map((item) => {
      const status = item.used > 80 ? "warning" : "safe";

      return `
        <article class="tier-item">
          <div class="tier-top">
            <strong>${item.name}</strong>
            <span class="badge ${status}">${item.used}%</span>
          </div>
          <div class="meter" aria-hidden="true">
            <span style="width: ${item.used}%; background: ${item.used > 80 ? "var(--amber)" : "var(--green)"}"></span>
          </div>
          <p>${item.detail}</p>
        </article>
      `;
    })
    .join("");
}

function renderAlerts() {
  const spend = getSpend();
  const forecast = spend * 1.42;
  const alerts = [
    {
      title: "CloudFront transfer rising",
      copy: "Bandwidth usage is near the starter threshold. Review cache settings before deploying large media.",
      level: "warning",
    },
    {
      title: forecast > budget ? "Budget forecast exceeded" : "Budget forecast healthy",
      copy:
        forecast > budget
          ? "Projected spend is above your budget. Reduce EC2 hours or increase the budget."
          : "Forecast is currently under budget. Keep monitoring EC2 and transfer costs.",
      level: forecast > budget ? "danger" : "safe",
    },
    {
      title: "CloudWatch logs growing",
      copy: "Log volume can become expensive. Set retention rules when this becomes a real AWS deployment.",
      level: "warning",
    },
  ];

  elements.alertList.innerHTML = alerts
    .map(
      (alert) => `
        <article class="alert">
          <span class="badge ${alert.level}">${alert.level}</span>
          <strong>${alert.title}</strong>
          <p>${alert.copy}</p>
        </article>
      `
    )
    .join("");
}

function renderRecommendations() {
  const recommendations = [
    {
      title: "Stop idle compute first",
      copy: "EC2 is the highest cost in this mock account. In the AWS version, tag resources and flag idle instances.",
    },
    {
      title: "Add budget alerts",
      copy: "Use AWS Budgets or SNS notifications so students get warnings before costs become stressful.",
    },
    {
      title: "Store cost snapshots",
      copy: "Save daily cost data in DynamoDB to show trends and build a stronger cloud project story.",
    },
  ];

  elements.recommendationList.innerHTML = recommendations
    .map(
      (item) => `
        <article class="recommendation">
          <strong>${item.title}</strong>
          <p>${item.copy}</p>
        </article>
      `
    )
    .join("");
}

function refreshMockData() {
  services.forEach((service) => {
    const shift = 0.86 + Math.random() * 0.28;
    service.cost = Math.max(0.1, Number((service.cost * shift).toFixed(2)));
  });

  renderDashboard();
}

function editBudget() {
  const nextBudget = Number(window.prompt("Set monthly budget in USD", budget));

  if (!Number.isFinite(nextBudget) || nextBudget <= 0) {
    return;
  }

  budget = nextBudget;
  localStorage.setItem("spendops-budget", String(budget));
  renderDashboard();
}

function renderDashboard() {
  renderSummary();
  renderServices();
  renderFreeTier();
  renderAlerts();
  renderRecommendations();
}

elements.serviceFilter.addEventListener("change", renderServices);
elements.refreshData.addEventListener("click", refreshMockData);
elements.editBudget.addEventListener("click", editBudget);
elements.themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("spendops-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("spendops-theme") === "dark") {
  document.body.classList.add("dark");
}

renderDashboard();