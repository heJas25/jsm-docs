import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const Header = ({ children, className }: HeaderProps) => {
    return (
        <div className={cn('header', className)}>
            <Link href='/' className='md:flax-1'>
                <Image
                    src="/assets/icons/logo.svg"
                    alt="logo"
                    height={30}
                    width={130}
                    className='md:block hidden' />

                <Image
                    src="/assets/icons/logo.svg"
                    alt="logo"
                    height={30}
                    width={50}
                    className='md-2 md:hidden' />

            </Link>

            {children}
        </div>
    )
}

export default Header