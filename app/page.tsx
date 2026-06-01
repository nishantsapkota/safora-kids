import { ArrowRight, HeartPulse, House, ShieldCheck, Sparkles, TrafficCone, Waves } from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";

const modules = [
  ["Traffic Rule and Road Safety", TrafficCone],
  ["Natural Disaster Preparedness", Waves],
  ["Household and Occupational Hazards", House],
  ["Basic First Aid", HeartPulse],
  ["Good Habits and Health Hygiene", Sparkles]
] as const;

export default function LandingPage() {
  return (
    <div>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
              <ShieldCheck className="h-4 w-4" /> AI adaptive safety learning
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-safety-ink md:text-6xl">Safora Kids</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              A browser-based learning game for Nepali children aged 6 to 14, using MCQs, instant feedback, mastery
              tracking, spaced repetition, and adaptive question selection.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/login" className="bg-safety-blue text-white">
                Login <ArrowRight className="ml-2 h-5 w-5" />
              </ButtonLink>
              <ButtonLink href="/register" className="border border-slate-300 bg-white text-safety-ink">
                Create Profile
              </ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {modules.map(([name, Icon]) => (
              <Card key={name} className="min-h-32">
                <Icon className="mb-4 h-8 w-8 text-safety-orange" />
                <h2 className="text-base font-bold">{name}</h2>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
