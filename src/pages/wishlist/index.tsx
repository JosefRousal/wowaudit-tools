import { type NextPage } from "next";
import { api } from "~/utils/api";
import { Container, Group, Space } from "@mantine/core";
import moment from "moment";
import { DataGrid } from "mantine-data-grid";
import LastSyncDate from "~/components/LastSyncDate";

const LastSyncDateWrapper = () => {
  const lastUpdateQuery = api.wishlist.getLastSyncDate.useQuery();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return (
    <LastSyncDate
      isLoading={lastUpdateQuery.isLoading}
      isError={lastUpdateQuery.isError}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      date={lastUpdateQuery.data?.timestamp}
    />
  );
};

const Home: NextPage = () => {
  const query = api.wishlist.allCharacterWishlistUploadInfo.useQuery();

  return (
    <Container fluid>
      <Group>
        Last Sync <LastSyncDateWrapper />
      </Group>
      <Space h="md" />
      <DataGrid
        data={query.data ?? []}
        loading={query.isLoading}
        withBorder
        columns={[
          {
            accessorFn: (row) => row.characterName,
            header: "Character",
          },
          {
            accessorFn: (row) => row.spec,
            header: "Spec",
          },
          {
            accessorFn: (row) => row.normal,
            header: "Normal",
            cell: (cell) => {
              const value = cell.getValue<Date | null>();
              if (value) {
                return moment(value.toISOString()).fromNow();
              }
              return "";
            },
          },
          {
            accessorFn: (row) => row.heroic,
            header: "Heroic",
            cell: (cell) => {
              const value = cell.getValue<Date | null>();
              if (value) {
                return moment(value.toISOString()).fromNow();
              }
              return "";
            },
          },
          {
            accessorFn: (row) => row.mythic,
            header: "Mythic",
            cell: (cell) => {
              const value = cell.getValue<Date | null>();
              if (value) {
                return moment(value.toISOString()).fromNow();
              }
              return "";
            },
          },
        ]}
      />
    </Container>
  );
};

export default Home;
