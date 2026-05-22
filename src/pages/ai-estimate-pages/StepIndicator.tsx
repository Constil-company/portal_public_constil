interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function StepIndicator({ currentStep, totalSteps, className = "" }: StepIndicatorProps) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div key={index} className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                isActive || isCompleted ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {isCompleted ? "✓" : stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div className={`w-12 h-1 ${isActive || isCompleted ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
