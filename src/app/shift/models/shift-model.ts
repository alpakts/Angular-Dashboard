export interface Shift {
  id: number;
  userId: number;
  username: string;
  startTime: Date;
  endTime: Date;
  role: string;
  date: Date;
  weekOff?: boolean;
}
