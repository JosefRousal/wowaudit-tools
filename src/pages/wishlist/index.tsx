import { type NextPage } from "next";
import { api } from "~/utils/api";
import {
  Container,
} from "@mantine/core";
import moment from "moment";
import { DataGrid } from "mantine-data-grid";

const Home: NextPage = () => {

  const query = api.wishlist.allCharacterWishlistUploadInfo.useQuery();

  return (
    <Container fluid>
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
