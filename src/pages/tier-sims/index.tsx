import { DataGrid } from "mantine-data-grid";
import { type NextPage } from "next";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data, isLoading } = api.tierSims.allTierSims.useQuery();
  return (
    <DataGrid
      data={data ?? []}
      loading={isLoading}
      withBorder
      columns={[
        {
          accessorFn: (row) => row.className,
          header: "Class",
        },
        {
          accessorFn: (row) => row.spec,
          header: "Specialization",
        },
        {
          accessorFn: (row) => row.noTier,
          header: "No Tier",
        },
        {
          accessorFn: (row) => row.twoPiece,
          header: "Two Piece",
        },
        {
          accessorFn: (row) => row.fourPiece,
          header: "Four Piece",
        },

        {
          accessorFn: (row) => row.noVsTwo,
          header: "No vs Two",
          cell: (cell) => {
            const value = cell.getValue<number | null>();
            if (value) {
              return value.toLocaleString(undefined, {
                style: "percent",
                minimumFractionDigits: 2,
              });
            }
            return "";
          },
        },
        {
          accessorFn: (row) => row.noVsFour,
          header: "No vs Four",
          cell: (cell) => {
            const value = cell.getValue<number | null>();
            if (value) {
              return value.toLocaleString(undefined, {
                style: "percent",
                minimumFractionDigits: 2,
              });
            }
            return "";
          },
        },
        {
          accessorFn: (row) => row.twoVsFour,
          header: "Two vs Four",
          cell: (cell) => {
            const value = cell.getValue<number | null>();
            if (value) {
              return value.toLocaleString(undefined, {
                style: "percent",
                minimumFractionDigits: 2,
              });
            }
            return "";
          },
        },
      ]}
    />
  );
};

export default Home;
