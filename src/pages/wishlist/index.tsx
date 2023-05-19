import { type NextPage } from "next";
import { api } from "~/utils/api";
import {
  Container,
  Group,
  SegmentedControl,
  Select,
  Space,
} from "@mantine/core";
import { useState } from "react";
import moment from "moment";
import { DataGrid, useDataGrid } from "mantine-data-grid";
import { type Difficulty, DifficultySchema } from "~/types"

const Home: NextPage = () => {
  const [wishlistName, setWishlistName] = useState<string | null>(
    "Single Target - Max Upgrades"
  );
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");

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
        <SegmentedControl
          style={{marginTop: 25}}
          value={difficulty}
          onChange={(value) => setDifficulty(DifficultySchema.parse(value))}
          data={[
            { label: "Normal", value: "normal" },
            { label: "Heroic", value: "heroic" },
            { label: "Mythic", value: "mythic" },
          ]}
        />
      </Group>
      <Space h="md" />
      <DataGrid
        data={query.data?.filter((x) => x.uploadDate && x.difficulty === difficulty) ?? []}
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
            accessorFn: (row) => row.difficulty,
            header: "Difficulty",
          },
          {
            accessorFn: (row) => row.uploadDate,
            header: "Last Upload",
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
