import type { Period } from "@/types/Common.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";

interface Props {
  period: Period | undefined;
  setPeriod: (period: Period) => void;
  enableAllTime?: boolean;
}

const PeriodSelect = (props: Props) => {
  const { period, setPeriod, enableAllTime } = props;
  return (
    <Select
      value={period}
      onValueChange={(value) => setPeriod(value as Period)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder=" Select a period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7day">7 day</SelectItem>
        <SelectItem value="1month">1 month</SelectItem>
        <SelectItem value="3month">3 month</SelectItem>
        <SelectItem value="6month">6 month</SelectItem>
        <SelectItem value="12month">12 month</SelectItem>
        {enableAllTime && <SelectItem value="overall">All time</SelectItem>}
      </SelectContent>
    </Select>
  );
};

export default PeriodSelect;
