import { type AppType } from "next/app";
import { MantineProvider } from "@mantine/core";
import { SpotlightProvider } from "@mantine/spotlight";
import { Analytics } from "@vercel/analytics/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { useRouter } from "next/router";
import AppLayout from "~/components/layout/AppLayout";
import { spotlightActions } from "~/components/actions";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  return (
    <>
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
      <Analytics />
    </>
  );
};

export default api.withTRPC(MyApp);
