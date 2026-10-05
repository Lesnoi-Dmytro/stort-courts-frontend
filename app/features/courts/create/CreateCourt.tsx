import { Card, Flex, Heading, Skeleton } from "@radix-ui/themes";
import { ArrowLeftIcon } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router";
import { toast } from "react-toastify";
import type { CourtValues } from "~/schemas/court";
import { CourtsService } from "~/services/http";
import { Paths } from "~/shared/const/paths";
import { useAuth } from "~/shared/context/auth-context";
import { SportType, UserRole } from "~/shared/types";
import { CourtForm, courtValuesToDTO } from "../form/CourtForm";

const DEFAULT_VALUES: CourtValues = {
  name: "",
  sportType: SportType.TENNIS,
  hourlyPrice: "",
  openingHour: "08:00",
  closingHour: "22:00",
};

export function CreateCourt() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return <Skeleton height="200px" />;
  if (user?.role !== UserRole.ADMIN) {
    return <Navigate to={Paths.COURTS} replace />;
  }

  return (
    <Flex direction="column" gap="5" className="mx-auto w-full max-w-xl">
      <Link
        to={Paths.COURTS}
        className="inline-flex items-center gap-1 text-sm text-(--gray-11) hover:underline"
      >
        <ArrowLeftIcon size={14} /> All courts
      </Link>

      <Heading as="h1" size="7">
        New court
      </Heading>

      <Card size="3">
        <CourtForm
          defaultValues={DEFAULT_VALUES}
          submitLabel="Create court"
          errorTitle="Failed to create court"
          onSubmit={async (values) => {
            const court = await CourtsService.create(courtValuesToDTO(values));
            toast.success("Court created");
            navigate(Paths.COURT(court.id));
          }}
        />
      </Card>
    </Flex>
  );
}
