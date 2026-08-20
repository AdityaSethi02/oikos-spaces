import { env, isClerkServerConfigured } from "@/lib/env";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

function failClosed() {
  if (env.NODE_ENV === "production") {
    return new NextResponse("Service unavailable", { status: 503 });
  }
  return NextResponse.next();
}

const clerkHandler = clerkMiddleware();

export function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!isClerkServerConfigured) {
    return failClosed();
  }
  return clerkHandler(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
