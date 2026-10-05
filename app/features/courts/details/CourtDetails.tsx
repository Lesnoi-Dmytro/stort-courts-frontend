import {
  AlertDialog,
  Badge,
  Button,
  Callout,
  Card,
  Flex,
  Heading,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { ArrowLeftIcon, ClockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "react-toastify";
import { CourtsService } from "~/services/http";
import { Paths } from "~/shared/const/paths";
import { useAuth } from "~/shared/context/auth-context";
import { formatSport, formatTime } from "~/shared/lib/format";
import { showApiError } from "~/shared/lib/show-api-error";
import { UserRole, type Court } from "~/shared/types";
import { CourtForm, courtToValues } from "../form/CourtForm";

function CourtSummary({ court }: { court: Court }) {
  return (
    <Flex direction="column" gap="3">
      <Flex align="center" gap="2" className="text-(--gray-11)">
        <ClockIcon size={16} />
        <Text size="2">
          {formatTime(court.openingHour)} – {formatTime(court.closingHour)}
        </Text>
      </Flex>
      <Text size="6" weight="bold">
        ${court.hourlyPrice}
        <Text size="2" weight="regular" color="gray">
          {" "}
          / hour
        </Text>
      </Text>
    </Flex>
  );
}

export function CourtDetails() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [court, setCourt] = useState<Court | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setNotFound(false);
      try {
        setCourt(
          await CourtsService.findOne(id, { signal: controller.signal }),
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        setCourt(null);
        setNotFound(true);
        showApiError(error, { title: "Failed to load court" });
      }
      setIsLoading(false);
    };

    load();
    return () => controller.abort();
  }, [id]);

  const deactivate = async () => {
    if (!court) return;
    setIsDeactivating(true);
    try {
      setCourt(await CourtsService.deactivate(court.id));
      toast.success("Court deactivated");
    } catch (error) {
      showApiError(error, { title: "Failed to deactivate court" });
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <Flex direction="column" gap="5" className="mx-auto w-full max-w-xl">
      <Link
        to={Paths.COURTS}
        className="inline-flex items-center gap-1 text-sm text-(--gray-11) hover:underline"
      >
        <ArrowLeftIcon size={14} /> All courts
      </Link>

      {isLoading ? (
        <Skeleton height="200px" />
      ) : !court ? (
        <Callout.Root color="red">
          <Callout.Text>
            {notFound
              ? "This court could not be found."
              : "Something went wrong."}
          </Callout.Text>
        </Callout.Root>
      ) : (
        <>
          <Flex justify="between" align="start" gap="3">
            <Heading as="h1" size="7" className="min-w-0 wrap-break-word">
              {court.name}
            </Heading>
            <Flex gap="1" className="shrink-0 pt-2">
              {!court.isActive && <Badge color="gray">Inactive</Badge>}
              <Badge>{formatSport(court.sportType)}</Badge>
            </Flex>
          </Flex>

          <Card size="3">
            {isAdmin ? (
              <CourtForm
                defaultValues={courtToValues(court)}
                submitLabel="Save changes"
                errorTitle="Failed to update court"
                requireChanges
                onSubmit={async (values) => {
                  const updated = await CourtsService.update(court.id, values);
                  setCourt(updated);
                  toast.success("Court updated");
                  return courtToValues(updated);
                }}
              />
            ) : (
              <CourtSummary court={court} />
            )}
          </Card>

          {isAdmin && court.isActive && (
            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <Button
                  color="red"
                  variant="soft"
                  loading={isDeactivating}
                  className="self-start"
                >
                  Deactivate court
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content maxWidth="420px">
                <AlertDialog.Title>Deactivate {court.name}?</AlertDialog.Title>
                <AlertDialog.Description size="2">
                  The court will no longer be visible to customers or bookable.
                </AlertDialog.Description>
                <Flex gap="3" justify="end" mt="4">
                  <AlertDialog.Cancel>
                    <Button variant="soft" color="gray">
                      Cancel
                    </Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                    <Button color="red" onClick={deactivate}>
                      Deactivate
                    </Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          )}
        </>
      )}
    </Flex>
  );
}
