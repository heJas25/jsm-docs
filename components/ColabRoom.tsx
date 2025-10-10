"use client"

import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense"
import ActiveCollaborators from './ActiveCollaborators'
import { useRef, useState, useEffect } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { updateDocumentTitle } from '@/lib/actions/room.actions'
import Loader from './Loader'

const ColabRoom = ({ roomId, roomMetadata }: CollaborativeRoomProps) => {

    const currentUserType = 'editor';

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setEditing(false);
                updateDocumentTitle(roomId, documentTitle);
            }

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            }
        
        }
    }, [roomId, documentTitle])

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current?.focus();
        }
    }, [editing])

    const updateTitleHundler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setLoading(true);
            try {
                const TitleUpdate = await updateDocumentTitle(roomId, documentTitle);

                if (TitleUpdate) {
                    setEditing(false);
                }

            } catch (error) {
                console.log(error)
            }
            setLoading(false);

        }

    }

    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader/>}>
                <div className='collaborative-room'>
                    <Header>
                        <div ref={containerRef} className='flex w-fit ml-[35rem]  items-center justify-end gap-2'>
                            {editing && !loading ? (
                                <Input
                                    type='text'
                                    ref={inputRef}
                                    placeholder='Enter document title'
                                    value={documentTitle}
                                    onChange={(e) => setDocumentTitle(e.target.value)}
                                    onKeyDown={updateTitleHundler}
                                    className='document-title-input'
                                    disabled={!editing}
                                />
                            ) : (
                                <>
                                    <p className='document-title'>{documentTitle}</p>

                                </>
                            )}

                            {currentUserType === 'editor' && !editing && (
                                <Image
                                    src='/assets/icons/edit.svg'
                                    alt='edit'
                                    width={20}
                                    height={20}
                                    onClick={() => setEditing(!editing)}
                                    className='cursor-pointer'

                                />
                            )}
                            {currentUserType !== 'editor' && !editing && (
                                <p className='view-only-tag'> view-only</p>
                            )}
                            {loading && (
                                <p className='text-sm text-gray-400'>Saving...</p>
                            )}
                        </div>
                        <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
                            <ActiveCollaborators />
                        </div>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>

                            <UserButton />
                        </SignedIn>
                    </Header>

                    <Editor />

                </div>
            </ClientSideSuspense>
        </RoomProvider>
    )
}

export default ColabRoom