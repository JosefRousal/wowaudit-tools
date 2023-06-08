import { type NextPage } from "next";
import { api } from "~/utils/api";
import { Button, Container, Group, Loader, Space } from "@mantine/core";
import moment from "moment";
import { DataGrid } from "mantine-data-grid";
import LastSyncDate from "~/components/LastSyncDate";

const Home: NextPage = () => {
  const utils = api.useContext();
  const query = api.wishlist.allCharacterWishlistUploadInfo.useQuery();
  const refreshMutation = api.wishlist.refreshData.useMutation({
    async onSettled() {
      await utils.wishlist.allCharacterWishlistUploadInfo.invalidate();
    },
  });

  const isLoading = query.isLoading || refreshMutation.isLoading;
  const isError = query.isError || refreshMutation.isError;

  return (
    <Container fluid>
      <Group>
        <span>Last Sync</span>
        {!isLoading && (
          <LastSyncDate
            isLoading={isLoading}
            isError={isError}
            date={query.data?.lastSyncDate}
          />
        )}
        <Button onClick={() => refreshMutation.mutate()} disabled={isLoading}>
          {isLoading ? <Loader /> : <span>Refresh</span>}
        </Button>
      </Group>
      <Space h="md" />
      <DataGrid
        data={query.data?.data ?? []}
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
