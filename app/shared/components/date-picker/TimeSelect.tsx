import { Flex, Select, Text } from "@radix-ui/themes";
import { getHours, getMinutes, setHours, setMinutes } from "date-fns";

const pad = (n: number) => String(n).padStart(2, "0");
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

type TimeSelectProps = {
  value: Date | null;
  onChange: (value: Date) => void;
  disabled?: boolean;
  hourOnly?: boolean;
};

export function TimeSelect({
  value,
  onChange,
  disabled,
  hourOnly,
}: TimeSelectProps) {
  const base = value ?? new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <Flex align="center" gap="1">
      <Select.Root
        disabled={disabled}
        value={value ? String(getHours(value)) : undefined}
        onValueChange={(h) => {
          const next = setHours(base, Number(h));
          onChange(hourOnly ? setMinutes(next, 0) : next);
        }}
      >
        <Select.Trigger aria-label="Hour" placeholder="HH" />
        <Select.Content position="popper">
          {HOURS.map((h) => (
            <Select.Item key={h} value={String(h)}>
              {pad(h)}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      {hourOnly ? (
        <Text>:00</Text>
      ) : (
        <>
          <Text>:</Text>
          <Select.Root
            disabled={disabled}
            value={value ? String(getMinutes(value)) : undefined}
            onValueChange={(m) => onChange(setMinutes(base, Number(m)))}
          >
            <Select.Trigger aria-label="Minute" placeholder="MM" />
            <Select.Content position="popper">
              {MINUTES.map((m) => (
                <Select.Item key={m} value={String(m)}>
                  {pad(m)}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </>
      )}
    </Flex>
  );
}
