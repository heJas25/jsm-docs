import { useOthers } from '@liveblocks/react/suspense'
import React from 'react'
import Image from 'next/image';
const ActiveCollaborators = () => {
    const others = useOthers();//liveblocks hook to get other users
    const collaborators = others.map((other) => other.info);
    return (
        <ul>

            {collaborators.map(({ id, avatar, name, color }) => (
                <li key={id}>
                    <Image
                        className='rounded-full ring-2 inline-block size-8 ring-dark-100'
                        style={{border:`3px solid ${color}`}}
                        src={avatar}
                        alt={name}
                        width={100}
                        height={100} />
                </li>
            ))}

        </ul>
    )
}
export default ActiveCollaborators;
