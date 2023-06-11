import { ActionIcon, Group, Text } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";

const AuthButton = () => {
  const session = useSession();
  if (session.data) {
    return (
      <Group>
        <Text>Signed in as {session.data?.user.name}</Text>
        <ActionIcon onClick={() => void signOut()}>
          <IconUser />
        </ActionIcon>
      </Group>
    );
  }
  return (
    <Group>
      <Text>Sign in</Text>
      <ActionIcon onClick={() => void signIn()}>
        <IconUser />
      </ActionIcon>
    </Group>
  );
};

export default AuthButton;
