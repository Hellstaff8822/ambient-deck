import { useCallback, useRef } from "react";

interface UseKnobDragOptions {
  value: number;
  onChange: (newValue: number) => void;
}

export function useKnobDrag({ value, onChange }: UseKnobDragOptions) {
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const startY = e.clientY;
      const startVal = value;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaY = startY - moveEvent.clientY; 
        const newValue = Math.max(0, Math.min(1, startVal + deltaY / 150));
        onChange(Number(newValue.toFixed(2)));
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [value, onChange]
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const startY = e.touches[0].clientY;
      const startVal = value;

      const handleTouchMove = (moveEvent: TouchEvent) => {
        const deltaY = startY - moveEvent.touches[0].clientY;
        const newValue = Math.max(0, Math.min(1, startVal + deltaY / 150));
        onChange(Number(newValue.toFixed(2)));
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
    },
    [value, onChange]
  );

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? -1 : 1;
      const newValue = Math.max(0, Math.min(1, value + direction * 0.05));
      onChange(Number(newValue.toFixed(2)));
    },
    [value, onChange]
  );

  return { onMouseDown, onWheel, onTouchStart };
}