import { type NextRouter } from "next/router";
import {
  IconChartArrowsVertical,
  IconChecklist,
  IconGift,
} from "@tabler/icons-react";

export const actions = [
  {
    title: "Check Vault",
    route: "/check-vault",
    icon: <IconChecklist />,
  },
  {
    title: "Wishlist",
    route: "/wishlist",
    icon: <IconGift />,
  },
  {
    title: "Tier Set Dps",
    route: "/tier-sims",
    icon: <IconChartArrowsVertical />,
  },
];

export const spotlightActions = (router: NextRouter) =>
  actions.map((action) => ({
    title: action.title,
    onTrigger: () => router.push(action.route),
    icon: action.icon,
  }));
