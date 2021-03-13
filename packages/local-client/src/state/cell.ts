export type CellTypes = "code-cell" | "text-cell";
export type Direction = "up" | "down";

export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}
