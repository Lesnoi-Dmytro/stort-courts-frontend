import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { useState } from "react";
import { toast } from "react-toastify";
import { CourtBookingsService } from "~/services/http";
import { showApiError } from "~/shared/lib/show-api-error";

export function CancelBookingButton({
  bookingId,
  onCancelled,
}: {
  bookingId: string;
  onCancelled: () => void;
}) {
  const [isCancelling, setIsCancelling] = useState(false);

  const cancel = async () => {
    setIsCancelling(true);
    try {
      await CourtBookingsService.cancel(bookingId);
      toast.success("Booking cancelled");
      onCancelled();
    } catch (error) {
      showApiError(error, { title: "Failed to cancel booking" });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button size="1" color="red" variant="soft" loading={isCancelling}>
          Cancel
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="420px">
        <AlertDialog.Title>Cancel this booking?</AlertDialog.Title>
        <AlertDialog.Description size="2">
          The slot will become available to other customers.
        </AlertDialog.Description>
        <Flex gap="3" justify="end" mt="4">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Keep booking
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button color="red" onClick={cancel}>
              Cancel booking
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
