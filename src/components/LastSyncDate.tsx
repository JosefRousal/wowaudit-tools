import { Loader, Text } from "@mantine/core";

const LastSyncDate = (props: {
  isLoading: boolean;
  isError: boolean;
  date?: Date;
}) => {
  if (props.isLoading) return <Loader />;
  if (props.isError) return <Text variant="text">Error</Text>;
  if (props.date)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return <Text>{props.date?.toDateString()}</Text>;
  return <Text>never</Text>;
};

export default LastSyncDate;
