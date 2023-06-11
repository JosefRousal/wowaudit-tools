import { type AppType } from "next/app";
import { MantineProvider } from "@mantine/core";
import { SpotlightProvider } from "@mantine/spotlight";
import { Analytics } from "@vercel/analytics/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { useRouter } from "next/router";
import AppLayout from "~/components/layout/AppLayout";
import { spotlightActions } from "~/components/actions";
import { SessionProvider, signIn } from "next-auth/react";
import type { Session } from "next-auth";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  return (
    <>
      <SessionProvider session={session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "dark",
          }}
        >
          <SpotlightProvider actions={spotlightActions(router)}>
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          </SpotlightProvider>
        </MantineProvider>
      </SessionProvider>
      <Analytics />
    </>
  );
};

export default api.withTRPC(MyApp);
