import { env } from "~/env.mjs";

const getHeaders = () => {
  return {
    accept: "application/json",
    Authorization: env.WOWAUDIT_KEY,
  };
};

export default getHeaders;
