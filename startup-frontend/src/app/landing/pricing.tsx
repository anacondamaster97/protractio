import { PricingSection } from "@/components/ui/pricing-section"

export const PAYMENT_FREQUENCIES = ["monthly", "yearly"]

export const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: {
      monthly: "Free",
      yearly: "Free",
    },
    description: "Try our AI aggregation engine",
    features: [
      "1 AI agent",
      "100 data points/day",
      "Basic data visualization",
      "3 data sources",
      "Email support",
    ],
    cta: "Get started",
  },
  {
    id: "professional",
    name: "Professional",
    price: {
      monthly: 199,
      yearly: 179,
    },
    description: "For growing businesses",
    features: [
      "5 AI agents",
      "1,000 data points/day",
      "Advanced analytics",
      "10 data sources",
      "Priority support",
    ],
    cta: "Get started",
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: {
      monthly: 499,
      yearly: 449,
    },
    description: "For data",
    features: [
      "10 AI agents",
      "5,000 data points/day",
      "Advanced analytics",
      "20 data sources",
      "Priority support",
    ],
    cta: "Get started",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: {
      monthly: "Custom",
      yearly: "Custom",
    },
    description: "For multiple teams",
    features: [
      "Everything in Organizations",
      "Up to 5 team members",
      "100 dashboards",
      "15 status pages",
      "200+ integrations",
    ],
    cta: "Contact Us",
    highlighted: true,
  },
]

export function Pricing() {
  return (
    <div className="relative h-[100vh] py-16">
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <PricingSection
        title="Simple Pricing"
        subtitle="Choose the best plan for your needs"
        frequencies={PAYMENT_FREQUENCIES}
        tiers={TIERS}
      />
    </div>
  );
}