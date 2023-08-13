import Image from 'next/image'
import Link from 'next/link'
import { NavLinks } from '../constants/index'
import { AuthProviders, ProfileMenu } from '.'
import { getCurrentUser } from '@/lib/session'

const Navbar = async () => {
	const session = await getCurrentUser()
	return (
		<nav className="flexBetween navbar">
			<div className="flex-1 flexStart gap-10">
				<Link href="/">
					<Image src="/logo.svg" width={115} height={43} alt="Flexibble"></Image>
				</Link>
				<ul className="xl:flex hidden gap-7 text-small">
					{NavLinks.map((link) => (
						<Link href={link.href} key={link.key}>
							{link.text}
						</Link>
					))}
				</ul>
			</div>
			<div className="flexCenter gap-4">
				{session?.user ? (
					<>
						<ProfileMenu session={session} />
						<Link href="/create-project">Share Work</Link>
					</>
				) : (
					<AuthProviders />
				)}
			</div>
		</nav>
	)
}

export default Navbar
