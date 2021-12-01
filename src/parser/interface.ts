export interface Type {
  type: string;
  args: any | number;
}

export interface Inst {
  inst: string;
  instType: string;
  group: string;
  args: Type[];
}
