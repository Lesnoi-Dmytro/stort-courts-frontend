import { Button, Popover } from "@radix-ui/themes";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { DateCalendar, type DateCalendarProps } from "./DateCalendar";

const FORMATS = { date: "PP", datetime: "PP, HH:mm", time: "HH:mm" } as const;

type DatePickerProps = DateCalendarProps & {
  id?: string;
  placeholder?: string;
};

/** Popover picker for a date, a date and time (`datetime`) or just a `time`. */
export function DatePicker({
  id,
  placeholder,
  mode = "date",
  ...calendarProps
}: DatePickerProps) {
  const { value } = calendarProps;
  const Icon = mode === "time" ? ClockIcon : CalendarIcon;

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button
          id={id}
          type="button"
          variant="outline"
          color="gray"
          className="w-full justify-start font-normal"
        >
          <Icon size={16} />
          {value
            ? format(value, FORMATS[mode])
            : (placeholder ??
              (mode === "time" ? "Pick a time" : "Pick a date"))}
        </Button>
      </Popover.Trigger>
      <Popover.Content width="auto">
        <DateCalendar mode={mode} {...calendarProps} />
      </Popover.Content>
    </Popover.Root>
  );
}
