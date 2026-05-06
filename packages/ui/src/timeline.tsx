import { cn } from "./utils";

interface Step {
  title: string;
  description: string;
}

interface TimelineProps {
  steps: Step[];
  className?: string;
}

export function Timeline({ steps, className }: TimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <div key={step.title} className='relative flex gap-6 rounded-xl border border-zinc-200 bg-white p-6 md:p-8 transition-all duration-300 hover:border-zinc-300 hover:shadow-md'>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-black text-sm font-bold text-white'>{index + 1}</div>
          <div className='flex-1 py-0.5'>
            <p className='font-bold text-lg text-black'>{step.title}</p>
            <p className='mt-2 text-sm leading-6 text-zinc-600'>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
