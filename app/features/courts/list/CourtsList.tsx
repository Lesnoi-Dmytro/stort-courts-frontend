import {
  Button,
  Flex,
  Select,
  Skeleton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { CourtsService } from "~/services/http";
import { QueryKeys } from "~/shared/const/queryKeys";
import { useAuth } from "~/shared/context/auth-context";
import { useDebounced } from "~/shared/hooks/useDebounced";
import { showApiError } from "~/shared/lib/show-api-error";
import {
  CourtStatusFilter,
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  SportType,
  type Court,
  type PaginatedResponse,
} from "~/shared/types";
import { CourtCard } from "./CourtCard";
import { CourtsEmptyState } from "./CourtsEmptyState";

const ANY_SPORT = "ALL";
const PAGE_LIMIT = 12;

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : fallback;
}

function parseEnum<T extends string>(
  values: Record<string, T>,
  value: string | null,
): T | undefined {
  return Object.values(values).find((v) => v === value);
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

export function CourtsList() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePositiveInt(searchParams.get(QueryKeys.PAGE), DEFAULT_PAGE);
  const limit = Math.min(
    parsePositiveInt(searchParams.get(QueryKeys.LIMIT), PAGE_LIMIT),
    MAX_PAGE_LIMIT,
  );
  const name = searchParams.get(QueryKeys.NAME) ?? "";
  const sportType = parseEnum(
    SportType,
    searchParams.get(QueryKeys.SPORT_TYPE),
  );
  const status =
    parseEnum(CourtStatusFilter, searchParams.get(QueryKeys.STATUS)) ??
    CourtStatusFilter.ACTIVE;

  const [search, setSearch] = useState(name);
  const [result, setResult] = useState<PaginatedResponse<Court> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = useDebounced(search.trim());

  // Defaults are left out of the URL to keep it short; "page" resets whenever
  // a filter changes. Typing replaces the history entry instead of stacking.
  const updateParams = (
    updates: Partial<
      Record<(typeof QueryKeys)[keyof typeof QueryKeys], string>
    >,
    { replace = false }: { replace?: boolean } = {},
  ) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        if (!(QueryKeys.PAGE in updates)) next.delete(QueryKeys.PAGE);
        return next;
      },
      { replace },
    );
  };

  // Debounced input -> URL.
  useEffect(() => {
    if (debouncedSearch === name) return;
    updateParams({ [QueryKeys.NAME]: debouncedSearch }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // URL -> input (back/forward navigation).
  useEffect(() => {
    if (name !== debouncedSearch) setSearch(name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await CourtsService.findPage(
          {
            page,
            limit,
            name: name || undefined,
            sportType,
            status: isAdmin ? status : undefined,
          },
          { signal: controller.signal },
        );
        setResult(data);
      } catch (error) {
        showApiError(error, { title: "Failed to load courts" });
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [page, limit, name, sportType, status, isAdmin]);

  const hasFilters =
    search.trim() !== "" ||
    sportType !== undefined ||
    (isAdmin && status !== CourtStatusFilter.ACTIVE);

  const resetFilters = () => {
    setSearch("");
    setSearchParams({}, { replace: true });
  };

  const goToPage = (next: number) =>
    updateParams({ [QueryKeys.PAGE]: next > 1 ? String(next) : "" });

  const items = result?.items ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil((result?.total ?? 0) / (result?.limit ?? DEFAULT_PAGE_LIMIT)),
  );

  return (
    <Flex direction="column" gap="5" className="min-h-0 flex-1">
      <Flex gap="3" wrap="wrap" align="center">
        <TextField.Root
          className="min-w-56 flex-1 sm:max-w-sm"
          placeholder="Search courts by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        >
          <TextField.Slot>
            <SearchIcon size={16} />
          </TextField.Slot>
        </TextField.Root>

        <Select.Root
          value={sportType ?? ANY_SPORT}
          onValueChange={(value) =>
            updateParams({
              [QueryKeys.SPORT_TYPE]: value === ANY_SPORT ? "" : value,
            })
          }
        >
          <Select.Trigger aria-label="Sport type" />
          <Select.Content>
            <Select.Item value={ANY_SPORT}>All sports</Select.Item>
            {Object.values(SportType).map((sport) => (
              <Select.Item key={sport} value={sport}>
                {sport.charAt(0) + sport.slice(1).toLowerCase()}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        {isAdmin && (
          <Select.Root
            value={status}
            onValueChange={(value) =>
              updateParams({
                [QueryKeys.STATUS]:
                  value === CourtStatusFilter.ACTIVE ? "" : value,
              })
            }
          >
            <Select.Trigger aria-label="Status" />
            <Select.Content>
              <Select.Item value={CourtStatusFilter.ACTIVE}>Active</Select.Item>
              <Select.Item value={CourtStatusFilter.INACTIVE}>
                Inactive
              </Select.Item>
              <Select.Item value={CourtStatusFilter.ALL}>All</Select.Item>
            </Select.Content>
          </Select.Root>
        )}
      </Flex>

      {isLoading && !result ? (
        <Grid>
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} height="132px" />
          ))}
        </Grid>
      ) : items.length === 0 ? (
        <CourtsEmptyState hasFilters={hasFilters} onReset={resetFilters} />
      ) : (
        <div
          className={`-mx-1 min-h-0 flex-1 overflow-y-auto px-1 pb-1 ${isLoading ? "opacity-60 transition-opacity" : ""}`}
        >
          <Grid>
            {items.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </Grid>
        </div>
      )}

      {totalPages > 1 && (
        <Flex justify="center" align="center" gap="3">
          <Button
            variant="soft"
            disabled={page <= 1 || isLoading}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </Button>
          <Text size="2" color="gray">
            Page {page} of {totalPages}
          </Text>
          <Button
            variant="soft"
            disabled={page >= totalPages || isLoading}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
