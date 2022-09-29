import type { LoaderFunction } from "@remix-run/node"
import { requireUserId } from "~/utils/session.server"

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await requireUserId(request, "/");
    console.log(userId)
    return null
}

export default function Feed() {
    return (
        <h1>
            FEED
        </h1>
    )
}