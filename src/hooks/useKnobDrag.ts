import { useCallback, useRef } from "react";

interface UseKnobDragOptions {
  value: number;
  onChange: (newValue: number) => void;
  sensitivity?: number;
}

export function useKnobDrag({
  value,
  onChange,
  sensitivity = 100,
}: UseKnobDragOptions) {
  const isDragging = useRef(false);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      const startY = e.clientY;
      const startVal = value;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaY = moveEvent.clientY - startY;
        const newValue = Math.max(0, Math.min(1, startVal - deltaY / 150));
        onChange(Number(newValue.toFixed(2)));
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [value, onChange],
  );

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();

      const step = 0.05;
      const direction = e.deltaY > 0 ? -1 : 1;
      const newValue = Math.max(0, Math.min(1, value + direction * step));

      onChange(Number(newValue.toFixed(2)));
    },
    [value, onChange],
  );

  return { onMouseDown, onWheel };
}
