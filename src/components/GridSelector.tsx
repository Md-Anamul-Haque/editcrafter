import React, { useState } from "react";

type GridSelectorProps = {
  onSelect?: (size: { rows: number; cols: number }) => void;
};

const GridSelector: React.FC<GridSelectorProps> = ({ onSelect }) => {
  const [highlightSize, setHighlightSize] = useState<{
    rows: number;
    cols: number;
  }>({ rows: 2, cols: 2 });

  const TOTAL_ROWS = 10; // Total grid rows
  const TOTAL_COLS = 10; // Total grid columns

  // Function to set highlight area on mouse hover
  const handleMouseOver = (row: number, col: number) => {
    setHighlightSize({ rows: row + 1, cols: col + 1 });
  };

  // Function to handle click event
  const handleClick = () => {
    onSelect?.(highlightSize);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="grid grid-cols-[repeat(10,1fr)] gap-[2px] p-2 border border-gray-300 rounded cursor-pointer"
        onClick={handleClick}
      >
        {Array.from({ length: TOTAL_ROWS }).map((_, row) =>
          Array.from({ length: TOTAL_COLS }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              className={`w-6 h-6 border ${
                row < highlightSize.rows && col < highlightSize.cols
                  ? "bg-black"
                  : "bg-white"
              }`}
              onMouseOver={() => handleMouseOver(row, col)}
            ></div>
          ))
        )}
      </div>
      <p className="mt-2 text-lg font-semibold">
        {highlightSize.rows} × {highlightSize.cols}
      </p>
    </div>
  );
};

export default GridSelector;
