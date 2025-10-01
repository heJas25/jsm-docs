import ColabRoom from "@/components/ColabRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface SearchParamProps {
  params: {
    id: string;
  };
}

const Document = async ({ params }: SearchParamProps) => {
  const { id } = params;
  try {
    // 1. Vérification de l'utilisateur
    const clerkUser = await currentUser();
    if (!clerkUser) {
      console.log("No clerk user found");
      redirect('/sign-in');
    }

    // 2. Récupération du document
    console.log("Fetching document for ID:", id);
    const room = await getDocument({
      roomId: id,
      userId: clerkUser.emailAddresses[0].emailAddress,
    });

    if (!room) {
      console.log("No room found");
      redirect('/');
    }

    // 3. Récupération des utilisateurs
    console.log("Getting user IDs from room");
    const userIds = Object.keys(room.usersAccesses);
    console.log("User IDs:", userIds);

    console.log("Fetching clerk users");
    const users = await getClerkUsers({ userIds });
    console.log("Fetched users:", users);

    if (!users || !Array.isArray(users)) {
      console.log("Invalid users data:", users);
      return (
        <main className="flex w-full flex-col items-center">
          <p>Error loading user data</p>
        </main>
      );
    }

    // 4. Transformation des données utilisateurs
    const usersData = users.filter(Boolean).map((user) => ({
      ...user,
      userType: room.usersAccesses[user.email]?.includes('room:write')
        ? 'editor'
        : 'viewer'
    }));

    const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write')
      ? 'editor'
      : 'viewer';

    // 5. Rendu du composant
    return (
      <main className="flex w-full flex-col items-center">
        <ColabRoom
          roomId={id}
          roomMetadata={room.metadata}
          users={usersData}
          currentUserType={currentUserType}
        />
      </main>
    );
  } catch (error) {
    console.error("Error in Document component:", error);
    return (
      <main className="flex w-full flex-col items-center">
        <p>An error occurred while loading the document. Please try again later.</p>
      </main>
    );
  }
};

export default Document;