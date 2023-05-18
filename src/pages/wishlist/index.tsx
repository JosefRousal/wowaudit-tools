import { type NextPage } from "next";
import { api } from "~/utils/api";
import {
  Card,
  Container,
  Grid,
  Group,
  Loader,
  Select,
  SimpleGrid,
  Space,
  Table,
  Text,
} from "@mantine/core";
import { type WowauditCharacter } from "~/server/api/routers/characters";
import { useState } from "react";
import moment from "moment";

const CharacterWishlist = (props: {
  character: WowauditCharacter;
  wishlistName: string | null;
}) => {
  const query = api.wishlist.characterWishlistUploadInfo.useQuery({
    characterId: props.character.id,
    wishlistName: props.wishlistName ?? "",
  });

  return (
    <Card shadow="xs" padding="md">
      <Grid>
        <Grid.Col span={4}>
          <Text>{props.character.name}</Text>
          <Text>{props.character.class}</Text>
        </Grid.Col>
        <Grid.Col span={8}>
          {query.isLoading && <Loader />}
          {query.data && (
            <Table>
              <thead>
                <tr>
                  <th>Difficulty</th>
                  <th>Spec</th>
                  <th>Last Upload</th>
                </tr>
              </thead>
              <tbody>
                {query.data.filter(x => x.uploadDate).map((item, index) => (
                  <tr key={index}>
                    <td>{item.difficulty}</td>
                    <td>{item.spec}</td>
                    <td>
                      {item.uploadDate
                        ? moment(item.uploadDate.toISOString()).fromNow()
                        : "never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Grid.Col>
      </Grid>
    </Card>
  );
};

const Home: NextPage = () => {
  const query = api.characters.getAll.useQuery();

  const [wishlistName, setWishlistName] = useState<string | null>(
    "Single Target - Max Upgrades"
  );

  if (query.isLoading) return <Loader />;

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
      <SimpleGrid cols={3}>
        {query.data?.map((character, index) => (
          <CharacterWishlist
            key={index}
            character={character}
            wishlistName={wishlistName}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Home;
