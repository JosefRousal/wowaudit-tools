import { type NextPage } from "next";
import { api } from "~/utils/api";
import { useState } from "react";
import {
  Container,
  Group,
  Loader,
  NumberInput,
  Select,
  Space,
  Table,
} from "@mantine/core";
import { type CharacterVaultStats } from "~/server/api/types";

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
  const [year, setYear] = useState(2023);
  const [week, setWeek] = useState(() => getCurrentWeek() - 1);
  const [vaultOneMin, setVaultOneMin] = useState<number | undefined>();
  const [vaultTwoMin, setVaultTwoMin] = useState<number | undefined>();
  const [vaultThreeMin, setVaultThreeMin] = useState<number | undefined>();

  const isBadBoy = (character: CharacterVaultStats) => {
    if (!character) return false;

    if (!vaultOneMin) return false;
    if (!character.vaultOne || character.vaultOne < vaultOneMin) return true;

    if (!vaultTwoMin) return false;
    if (!character.vaultTwo || character.vaultTwo < vaultTwoMin) return true;

    if (!vaultThreeMin) return false;
    if (!character.vaultThree || character.vaultThree < vaultThreeMin)
      return true;
    return false;
  };

  const query = api.checkVault.getData.useQuery({
    year,
    week
  });

  if (query.isLoading) return <Loader />;

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
          <NumberInput
            label="Vault One ILvl"
            value={vaultOneMin}
            min={0}
            onChange={(value) => {
              if (value === "") {
                setVaultOneMin(undefined);
              } else {
                setVaultOneMin(value);
              }
            }}
          />
          <NumberInput
            label="Vault Two ILvl"
            value={vaultTwoMin}
            onChange={(value) => {
              if (value === "") {
                setVaultTwoMin(undefined);
              } else {
                setVaultTwoMin(value);
              }
            }}
          />
          <NumberInput
            label="Vault Three ILvl"
            value={vaultThreeMin}
            onChange={(value) => {
              if (value === "") {
                setVaultThreeMin(undefined);
              } else {
                setVaultThreeMin(value);
              }
            }}
          />
        </Group>
        <Space h="md" />
        <Table>
          <thead>
            <th>Name</th>
            <th>Vault One</th>
            <th>Vault Two</th>
            <th>Vault Three</th>
          </thead>
          <tbody>
            {query.data?.map((item, index) => (
              <tr
                key={index}
                style={{
                  background: isBadBoy(item) ? "red" : "transparent",
                }}
              >
                <td>{item.name}</td>
                <td>{item.vaultOne}</td>
                <td>{item.vaultTwo}</td>
                <td>{item.vaultThree}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default Home;
