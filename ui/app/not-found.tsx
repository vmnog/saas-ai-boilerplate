import logoLight from '@/assets/logo-light.svg'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-dvh flex flex-col items-center justify-center gap-8 text-center bg-background">
            <Link href="/">
                <Image src={logoLight} alt="ACME" className="w-32 dark:invert" />
            </Link>

            <span className="font-serif font-bold text-[10rem] leading-none">
                404
            </span>

            <p className="max-w-120 leading-relaxed">
                Ops! A página que você está procurando não foi encontrada.
            </p>
        </div>
    )
}
