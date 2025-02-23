// components/Pagination.tsx
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isNextDisabled: boolean;
}

export function Pagination({ currentStep, totalSteps, onNext, onPrevious, isNextDisabled }: PaginationProps) {
  return (
    <div className="flex justify-between mt-4">
      <Button onClick={onPrevious} disabled={currentStep === 1}>
        Anterior
      </Button>
      <Button onClick={onNext} disabled={currentStep === totalSteps || isNextDisabled}>
        Próximo
      </Button>
    </div>
  );
}