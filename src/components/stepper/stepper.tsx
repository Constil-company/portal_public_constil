import { twMerge } from "tailwind-merge";

type StepperItemProps = {
  active: boolean;
  num: number;
  label: string;
  last?: boolean;
  compact?: boolean;
};

function StepperItem({ active, num, label, last, compact }: StepperItemProps) {
  return (
    <div className={twMerge('flex items-center', compact ? 'gap-1 text-[10px]' : 'gap-2 text-sm')}>
      <div
        className={twMerge(
          'flex items-center justify-center rounded-full',
          compact ? 'w-5 h-5 text-[10px]' : 'w-8 h-8',
          active ? 'bg-[#448AFF] text-white' : 'bg-neutral-300'
        )}
      >
        <span>{num}</span>
      </div>

      <span className={twMerge(active ? 'text-[#448AFF]' : '')}>{label}</span>

      {!last && <span className={twMerge('h-0 border-b border-neutral-700', compact ? 'w-3' : 'w-5')}></span>}
    </div>
  );
}

type StepperProps = {
  list: {
    label: string;
  }[];
  activeStep: number;
  activeColor?: string;
  className?: string;
  compact?: boolean;
};

export function Stepper({ list, activeStep, className, compact = false }: StepperProps) {
  return (
    <div className={twMerge('flex items-center', compact ? 'gap-1' : 'gap-2', className)}>
      {list.map((item, index) => (
        <StepperItem
          key={index}
          active={index <= activeStep}
          num={index + 1}
          label={item.label}
          last={index === list.length - 1}
          compact={compact}
        />
      ))}
    </div>
  );
}

export default Stepper;
