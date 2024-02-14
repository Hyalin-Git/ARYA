"use client";
import { AuthContext } from "@/context/auth";
import { useContext } from "react";

export default function Portal() {
	const { uid } = useContext(AuthContext);
	return <pre>{uid}</pre>;
}
