import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Select, TextField } from "@radix-ui/themes";
import { Controller, useForm } from "react-hook-form";
import { courtSchema, type CourtValues } from "~/schemas/court";
import { FormField } from "~/shared/components/forms/FormField";
import { showApiError } from "~/shared/lib/show-api-error";
import { SportType, type Court } from "~/shared/types";
import { formatSport, formatTime } from "~/shared/lib/format";

export const courtToValues = (c: Court): CourtValues => ({
  name: c.name,
  sportType: c.sportType,
  hourlyPrice: c.hourlyPrice,
  openingHour: formatTime(c.openingHour),
  closingHour: formatTime(c.closingHour),
});

type CourtFormProps = {
  defaultValues: CourtValues;
  submitLabel: string;
  errorTitle: string;
  // Only allow submitting once something changed (edit mode).
  requireChanges?: boolean;
  // Resolve with the saved values to make them the new baseline for the form.
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
              <TextField.Root
                id="openingHour"
                type="time"
                {...register("openingHour")}
              />
            </FormField>
          </div>
          <div className="flex-1">
            <FormField
              label="Closes"
              htmlFor="closingHour"
              error={errors.closingHour?.message}
            >
              <TextField.Root
                id="closingHour"
                type="time"
                {...register("closingHour")}
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
