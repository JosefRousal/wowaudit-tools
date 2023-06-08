import type { NextRequest, NextResponse } from "next/server";
import loadClassSpecInfo from "~/server/api/loadClassSpecInfo";

export default async function handler(_: NextRequest, __: NextResponse) {
  await loadClassSpecInfo();
}
