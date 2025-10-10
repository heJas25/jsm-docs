import AddDocBtn from "@/components/AddDocBtn"
import Header from "@/components/Header"
import { SignedIn, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ActiveCollaborators from "@/components/ActiveCollaborators"
export default async function Home() {
  const documents = [];
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');
  return (
    <main className="home-container">
      <Header className='sticky left-0 top-0'>
        <div className='flex w-fit items-center lg:gap-4 gap-2'>
          
          Notification
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      {documents.length > 0 ? (
        <div className=""></div>
      ) : (
        <div className="document-list-empty">
          <Image
            src='/assets/icons/doc.svg'
            alt='doc'
            width={50}
            height={50}
            className="mx_auto" />
          <AddDocBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  )
}



