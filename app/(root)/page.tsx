import AddDocBtn from "@/components/AddDocBtn"
import Header from "@/components/Header"
import { SignedIn, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getDocuments } from "@/lib/actions/room.actions"
import Link from "next/link"
import { dateConverter } from "@/lib/utils"

export default async function Home() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const roomDocuments = await getDocuments(clerkUser.emailAddresses[0].emailAddress);

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
      {roomDocuments.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All Documents</h3>
            <AddDocBtn
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
          <ul className="document-ul">
            {roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
              <li key={id} className="document-list-item">
                <Link href={`/documents/${id}`} className="flex flex-1 items-center">
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image
                      src="/assets/icons/doc.svg"
                      alt="doc"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-camp-1 text-lg">{metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">Created about {dateConverter(createdAt)}</p>
                  </div>

                </Link>

              </li>
            ))}
          </ul>
        </div>
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



