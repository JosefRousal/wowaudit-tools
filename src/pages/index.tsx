import type { NextPage } from "next";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const query = api.characters.getAll.useQuery();
  return <>{JSON.stringify(query.data)}</>;
};

export default Home;
