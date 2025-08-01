"use client"
import { getClerkUsers } from '@/lib/actions/user.action';
import { ClientSideSuspense, LiveblocksProvider } from '@liveblocks/react/suspense'

const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <LiveblocksProvider
            authEndpoint="/api/liveblocks-auth"
            resolveUsers={async ({ userIds }) => {
                const users = await getClerkUsers({ userIds });

                return users;
            }}>

            <ClientSideSuspense fallback={<div>Loading…</div>}>
                {children}
            </ClientSideSuspense>

        </LiveblocksProvider>
    )
}

export default Provider