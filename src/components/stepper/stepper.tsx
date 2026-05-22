import { twMerge } from "tailwind-merge";

type StepperItemProps = {
  active: boolean;
  num: number;
  label: string;
  last?: boolean;
};

function StepperItem({active, num, label, last}: StepperItemProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={twMerge(
        "flex items-center justify-center w-8 h-8 rounded-full",
        active ? 'bg-[#448AFF] text-white' : "bg-neutral-300"
      )}>
        <span>{num}</span>
      </div>

      <span className={twMerge(
        active ? "text-[#448AFF]" : ""
      )}>
        {label}
      </span>

      {!last && <span className="h-0 border-b border-neutral-700 w-5"></span>}
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
};

export function Stepper({list, activeStep, className}: StepperProps) {
  return (
    <div className={twMerge("flex items-center gap-2", className)}>
      {list.map((item, index) => (
        <StepperItem 
          key={index} 
          active={index <= activeStep} 
          num={index + 1}
          label={item.label}
          last={index === list.length - 1}
        />
      ))}
    </div>
  );
}

export default Stepper;
