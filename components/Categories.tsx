'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { categoryFilters } from '@/constants'

const Categories = () => {
	const router = useRouter()
	const pathName = usePathname()
	const searchParams = useSearchParams()

	const category = searchParams.get('category')

	function handleTags(filter: string): void {
		router.push(`${pathName}?category=${filter}`)
	}

	return (
		<div className="flexBetween gap-5 w-full flex-wrap">
			<ul className="flex gap-2 overflow-auto">
				{categoryFilters.map((filter) => (
					<button
						key={filter}
						type="button"
						onClick={() => handleTags(filter)}
						className={`${
							category === filter ? 'bg-light-white-300 font-medium' : 'font-normal'
						} px-4 py-3 rounded-lg capitalize whitespace-nowrap`}
					>
						{filter}
					</button>
				))}
			</ul>
		</div>
	)
}

export default Categories
