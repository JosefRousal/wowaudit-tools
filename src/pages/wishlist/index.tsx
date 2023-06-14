import { type NextPage } from "next";
import { api } from "~/utils/api";
import {
  Button,
  Container,
  Group,
  Loader,
  Mark,
  Space,
  Table,
} from "@mantine/core";
import moment from "moment";
import LastSyncDate from "~/components/LastSyncDate";
import { signIn, useSession } from "next-auth/react";

const mapDateValue = (value: Date | null | undefined) => {
  if (!value) return <Mark>never</Mark>;
  const m = moment(value.toISOString());
  const d = moment().diff(m, "days");
  const s = m.fromNow();
  return d >= 7 ? <Mark>{s}</Mark> : s;
};

const Home: NextPage = () => {
  const session = useSession();

  const utils = api.useContext();
  const query = api.wishlist.allCharacterWishlistUploadInfo.useQuery(
    undefined,
    {
      enabled: session.status === "authenticated",
    }
  );
  const refreshData = api.wishlist.refreshData.useMutation({
    async onSettled() {
      await utils.wishlist.allCharacterWishlistUploadInfo.invalidate();
    },
  });

  const isLoading = query.isLoading || refreshData.isLoading;
  const isError = query.isError || refreshData.isError;

  if (session.status === "unauthenticated") void signIn();

  return (
    <Container fluid>
      <Group>
        <span>Last Sync</span>
        {!isLoading && (
          <LastSyncDate
            isLoading={isLoading}
            isError={isError}
            date={query.data?.lastSyncDate ?? null}
          />
        )}
        <Button onClick={() => refreshData.mutate()} disabled={isLoading}>
          {isLoading ? <Loader /> : <span>Refresh</span>}
        </Button>
      </Group>
      <Space h="md" />
      <Table>
        <thead>
          <tr>
            <th>Character</th>
            <th>Spec</th>
            <th>Normal</th>
            <th>Heroic</th>
            <th>Mythic</th>
          </tr>
        </thead>
        <tbody>
          {(query.data?.data ?? []).map((item, index) => (
            <tr key={index}>
              <td>{item.characterName}</td>
              <td>{item.spec}</td>
              <td>{mapDateValue(item.normal)}</td>
              <td>{mapDateValue(item.heroic)}</td>
              <td>{mapDateValue(item.mythic)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Home;
