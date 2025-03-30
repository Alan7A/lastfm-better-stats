import type { Limit } from "@/types/Common.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";

interface Props {
  limit: Limit;
  setLimit: (limit: Limit) => void;
}

const LimitSelect = (props: Props) => {
  const { limit, setLimit } = props;
  return (
    <Select value={limit} onValueChange={(value) => setLimit(value as Limit)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder=" Select a limit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="10">Show 10</SelectItem>
        <SelectItem value="25">Show 25</SelectItem>
        <SelectItem value="50">Show 50</SelectItem>
        <SelectItem value="100">Show 100</SelectItem>
        <SelectItem value="250">Show 250</SelectItem>
        <SelectItem value="500">Show 500</SelectItem>
        <SelectItem value="1000">Show 1000</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LimitSelect;
