"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

const HOME_PATHS = ["/", "/home"];

export function NavbarConditional() {
	const pathname = usePathname();
	if (!HOME_PATHS.includes(pathname)) return null;
	return <Navbar />;
}
