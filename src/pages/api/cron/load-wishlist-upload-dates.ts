import type { NextRequest, NextResponse } from "next/server";
import loadWishlistUploadDates from "~/server/api/loadWishlistUploadDates";

export default async function handler(_: NextRequest, __: NextResponse) {
  await loadWishlistUploadDates();
}
