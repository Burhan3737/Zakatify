const PAYMENTS_STORAGE_KEY = "zakatify_payments";

export const PAYMENT_CATEGORIES = {
  mosque: { id: "mosque", label: "Mosque", icon: "🕌" },
  charity: { id: "charity", label: "Charity", icon: "🤲" },
  family: { id: "family", label: "Family Support", icon: "👨‍👩‍👧‍👦" },
  zakat_fund: { id: "zakat_fund", label: "Zakat Fund", icon: "💚" },
  other: { id: "other", label: "Other", icon: "📝" },
};

export function generatePaymentId() {
  return `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createPayment(category, description, amount, currency) {
  const categoryInfo = PAYMENT_CATEGORIES[category];
  return {
    id: generatePaymentId(),
    date: new Date().toISOString().split("T")[0],
    category,
    categoryLabel: categoryInfo?.label || "Other",
    categoryIcon: categoryInfo?.icon || "📝",
    description: description.trim() || categoryInfo?.label || "Payment",
    amount: parseFloat(amount) || 0,
    currency,
  };
}

export function loadPayments() {
  try {
    const raw = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error loading payments:", error);
    return [];
  }
}

export function savePayments(payments) {
  try {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
    return true;
  } catch (error) {
    console.error("Error saving payments:", error);
    return false;
  }
}

export function addPayment(payments, newPayment) {
  const updated = [newPayment, ...payments];
  savePayments(updated);
  return updated;
}

export function deletePayment(payments, paymentId) {
  const updated = payments.filter((p) => p.id !== paymentId);
  savePayments(updated);
  return updated;
}

export function clearAllPayments() {
  localStorage.removeItem(PAYMENTS_STORAGE_KEY);
  return [];
}

export function calculateTotalPaid(payments) {
  return payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
}

export function calculateRemainingBalance(zakatDue, totalPaid) {
  return (zakatDue || 0) - totalPaid;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return formatDate(dateString);
}

export function groupPaymentsByMonth(payments) {
  const grouped = {};
  
  payments.forEach((payment) => {
    const date = new Date(payment.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    
    if (!grouped[key]) {
      grouped[key] = { label, payments: [] };
    }
    grouped[key].payments.push(payment);
  });

  return Object.entries(grouped)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, value]) => value);
}

export function validatePayment(category, amount) {
  const errors = [];
  
  if (!category || !PAYMENT_CATEGORIES[category]) {
    errors.push("Please select a valid category");
  }
  
  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    errors.push("Please enter a valid amount greater than 0");
  }
  
  return errors;
}
