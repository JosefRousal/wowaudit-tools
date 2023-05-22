import { type NextPage } from "next";
import { api } from "~/utils/api";
import {
  Container,
  Group,
  Select,
  Space,
} from "@mantine/core";
import { useState } from "react";
import moment from "moment";
import { DataGrid } from "mantine-data-grid";

const Home: NextPage = () => {
  const [wishlistName, setWishlistName] = useState<string | null>(
    "Single Target - Max Upgrades"
  );

  const query = api.wishlist.allCharacterWishlistUploadInfo.useQuery({
    wishlistName: wishlistName,
  });

  return (
    <Container fluid>
      <Group>
        <Select
          label="Wishlist"
          value={wishlistName}
          onChange={setWishlistName}
          w={500}
          data={[
            {
              value: "Single Target - Max Upgrades",
              label: "Single Target - Max Upgrades",
            },
          ]}
        />
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
