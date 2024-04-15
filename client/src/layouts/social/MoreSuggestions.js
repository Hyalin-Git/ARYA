import { getFollowSuggestions } from "@/api/user/user";
import useSWR from "swr";

export default function MoreSuggestions() {
	const { data, error, isLoading } = useSWR(
		"/users/suggestion",
		getFollowSuggestions(3)
	);
}
