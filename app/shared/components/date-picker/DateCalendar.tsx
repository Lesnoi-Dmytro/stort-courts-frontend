import { Flex, Text } from "@radix-ui/themes";
import {
  endOfMonth,
  endOfWeek,
  setHours,
  setMinutes,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { TimeSelect } from "./TimeSelect";
import { useEffect, useRef, useState } from "react";
import { DayPicker, type Matcher } from "react-day-picker";

const WEEK_STARTS_ON = 1;

export type DateRange = { start: Date; end: Date };

export type PickerMode = "date" | "datetime" | "time";

export type DateCalendarProps = {
  mode?: PickerMode;
  hourOnly?: boolean;
  value: Date | null;
  withTime?: boolean;
  disabledDates?: Matcher | Matcher[];
  minDate?: Date;
  maxDate?: Date;
  onChange: (value: Date | null) => void;
  onVisibleRangeChange?: (range: DateRange) => void;
};

export function getVisibleRange(month: Date): DateRange {
  return {
    start: startOfWeek(startOfMonth(month), { weekStartsOn: WEEK_STARTS_ON }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: WEEK_STARTS_ON }),
  };
}

function withTimeOf(day: Date, time: Date | null): Date {
  return time
    ? setMinutes(setHours(day, time.getHours()), time.getMinutes())
    : day;
}

export function DateCalendar({
  value,
  onChange,
  mode = "date",
  hourOnly,
  disabledDates,
  minDate,
  maxDate,
  onVisibleRangeChange,
}: DateCalendarProps) {
  const [month, setMonth] = useState(() => startOfMonth(value ?? new Date()));

  const onRangeRef = useRef(onVisibleRangeChange);
  onRangeRef.current = onVisibleRangeChange;
  useEffect(() => {
    if (mode !== "time") onRangeRef.current?.(getVisibleRange(month));
  }, [month, mode]);

  const disabled: Matcher[] = [
    ...(disabledDates === undefined ? [] : [disabledDates].flat()),
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];

  return (
    <Flex direction="column" gap="3">
      {mode !== "time" && (
        <DayPicker
          mode="single"
          showOutsideDays
          weekStartsOn={WEEK_STARTS_ON}
          month={month}
          onMonthChange={(next) => setMonth(startOfMonth(next))}
          selected={value ?? undefined}
          onSelect={(day) => onChange(day ? withTimeOf(day, value) : null)}
          disabled={disabled}
        />
      )}

      {mode !== "date" && (
        <Flex align="center" gap="2">
          {mode === "datetime" && (
            <Text size="2" weight="medium">
              Time
            </Text>
          )}
          <TimeSelect
            value={value}
            onChange={onChange}
            hourOnly={hourOnly}
            disabled={mode === "datetime" && !value}
          />
        </Flex>
      )}
    </Flex>
  );
}
