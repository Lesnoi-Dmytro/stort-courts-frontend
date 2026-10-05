import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Select, TextField } from "@radix-ui/themes";
import { format, isValid, parse } from "date-fns";
import { Controller, useForm, type Control } from "react-hook-form";
import { courtSchema, type CourtValues } from "~/schemas/court";
import { DatePicker } from "~/shared/components/date-picker/DatePicker";
import { FormField } from "~/shared/components/forms/FormField";
import { localTimeToUtc, utcTimeToLocal } from "~/shared/lib/date";
import { formatSport } from "~/shared/lib/format";
import { showApiError } from "~/shared/lib/show-api-error";
import { SportType, type Court, type CreateCourtDTO } from "~/shared/types";

export const courtToValues = (c: Court): CourtValues => ({
  name: c.name,
  sportType: c.sportType,
  hourlyPrice: c.hourlyPrice,
  openingHour: utcTimeToLocal(c.openingHour),
  closingHour: utcTimeToLocal(c.closingHour),
});

/** Form values hold local times; the backend stores opening hours in UTC. */
export const courtValuesToDTO = (v: CourtValues): CreateCourtDTO => ({
  ...v,
  openingHour: localTimeToUtc(v.openingHour),
  closingHour: localTimeToUtc(v.closingHour),
});

function TimeField({
  id,
  name,
  control,
}: {
  id: string;
  name: "openingHour" | "closingHour";
  control: Control<CourtValues>;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const parsed = parse(field.value.slice(0, 5), "HH:mm", new Date());
        return (
          <DatePicker
            id={id}
            mode="time"
            hourOnly
            value={isValid(parsed) ? parsed : null}
            onChange={(date) =>
              field.onChange(date ? format(date, "HH:mm") : "")
            }
          />
        );
      }}
    />
  );
}

type CourtFormProps = {
  defaultValues: CourtValues;
  submitLabel: string;
  errorTitle: string;
  requireChanges?: boolean;
  onSubmit: (values: CourtValues) => Promise<CourtValues | void>;
};

export function CourtForm({
  defaultValues,
  submitLabel,
  errorTitle,
  requireChanges = false,
  onSubmit,
}: CourtFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CourtValues>({
    resolver: zodResolver(courtSchema),
    defaultValues,
  });

  const submit = async (values: CourtValues) => {
    try {
      const saved = await onSubmit(values);
      if (saved) reset(saved);
    } catch (error) {
      showApiError(error, { title: errorTitle });
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <Flex direction="column" gap="4">
        <FormField label="Name" htmlFor="name" error={errors.name?.message}>
          <TextField.Root id="name" {...register("name")} />
        </FormField>

        <FormField
          label="Sport"
          htmlFor="sportType"
          error={errors.sportType?.message}
        >
          <Controller
            control={control}
            name="sportType"
            render={({ field }) => (
              <Select.Root value={field.value} onValueChange={field.onChange}>
                <Select.Trigger id="sportType" className="w-full" />
                <Select.Content>
                  {Object.values(SportType).map((sport) => (
                    <Select.Item key={sport} value={sport}>
                      {formatSport(sport)}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            )}
          />
        </FormField>

        <FormField
          label="Hourly price ($)"
          htmlFor="hourlyPrice"
          error={errors.hourlyPrice?.message}
        >
          <TextField.Root
            id="hourlyPrice"
            inputMode="decimal"
            {...register("hourlyPrice")}
          />
        </FormField>

        <Flex gap="3">
          <div className="flex-1">
            <FormField
              label="Opens"
              htmlFor="openingHour"
              error={errors.openingHour?.message}
            >
              <TimeField
                id="openingHour"
                control={control}
                name="openingHour"
              />
            </FormField>
          </div>
          <div className="flex-1">
            <FormField
              label="Closes"
              htmlFor="closingHour"
              error={errors.closingHour?.message}
            >
              <TimeField
                id="closingHour"
                control={control}
                name="closingHour"
              />
            </FormField>
          </div>
        </Flex>

        <Flex gap="3" justify="end">
          <Button
            type="button"
            variant="soft"
            color="gray"
            disabled={!isDirty || isSubmitting}
            onClick={() => reset(defaultValues)}
          >
            Reset
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={requireChanges && !isDirty}
          >
            {submitLabel}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
