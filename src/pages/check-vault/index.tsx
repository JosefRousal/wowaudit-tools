import { type NextPage } from "next";
import { api } from "~/utils/api";
import { useState } from "react";
import { Container, Group, Select, Space } from "@mantine/core";
import { DataGrid } from "mantine-data-grid";
import { signIn, useSession } from "next-auth/react";

const getCurrentWeek = () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor(
    (currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
  );

  return Math.ceil(days / 7);
};

const arrayRange = (start: number, stop: number) =>
  Array.from({ length: Math.abs(stop - start) }, (item, index) =>
    index.toString()
  );

const Home: NextPage = () => {
  const session = useSession();
  const [year, setYear] = useState(2023);
  const [week, setWeek] = useState(() => getCurrentWeek() - 1);

  const query = api.checkVault.getData.useQuery(
    {
      year,
      week,
    },
    {
      enabled: session.status === "authenticated",
    }
  );

  if (session.status === "unauthenticated") void signIn();

  return (
    <>
      <Container fluid>
        <Group>
          <Select
            label="Year"
            placeholder="Pick one"
            data={["2021", "2022", "2023"]}
            value={year.toString()}
            onChange={(value) => {
              if (!value) return;
              setYear(Number.parseInt(value));
            }}
          />
          <Select
            label="Week"
            placeholder="week"
            data={arrayRange(0, 51)}
            value={week.toString()}
            onChange={(value) => {
              if (!value) return;
              setWeek(Number.parseInt(value));
            }}
          />
        </Group>
        <Space h="md" />
        <DataGrid
          data={query.data ?? []}
          loading={query.isLoading}
          withBorder
          withFixedHeader
          columns={[
            {
              accessorFn: (row) => row.name,
              header: "Character",
            },
            {
              accessorFn: (row) => row.vaultOne,
              header: "Vault One",
              enableColumnFilter: true,
            },
            {
              accessorFn: (row) => row.vaultTwo,
              header: "Vault Two",
            },
            {
              accessorFn: (row) => row.vaultThree,
              header: "Vault Three",
            },
          ]}
        />
      </Container>
    </>
  );
};

export default Home;
