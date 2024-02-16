import { NextResponse } from "next/server";
import { getSession } from "./actions/auth";
import { cookies } from "next/headers";

export async function middleware(request) {
	const privateRoutes = ["/portal"];
	const cantAccessWhenLogged = ["/", "/auth"];

	// If user is logged in
	if (cookies().get("session")) {
		if (cantAccessWhenLogged.includes(request.nextUrl.pathname)) {
			return NextResponse.redirect(new URL("/portal", request.url));
		} else {
			return NextResponse.next();
		}
	} else {
		if (privateRoutes.includes(request.nextUrl.pathname)) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}
}
