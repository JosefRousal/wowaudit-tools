import { type NextRouter } from "next/router";
import { IconChecklist } from "@tabler/icons-react";

export const actions = [
  {
    title: "Check Vault",
    route: "/check-vault",
    icon: <IconChecklist />,
  },
];

export const spotlightActions = (router: NextRouter) =>
  actions.map((action) => ({
    title: action.title,
    onTrigger: () => router.push(action.route),
    icon: action.icon,
  }));
