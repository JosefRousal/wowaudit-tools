import { Code, Loader } from "@mantine/core";

const LastSyncDate = (props: {
  isLoading: boolean;
  isError: boolean;
  date?: Date;
}) => {
  if (props.isLoading) return <Loader />;
  if (props.isError) return <Code>Error</Code>;
  if (props.date)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return <Code>{props.date?.toString()}</Code>;
  return <Code>never</Code>;
};

export default LastSyncDate;
