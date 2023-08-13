'use client'

import { useRouter } from 'next/navigation'
import { Button } from '.'

type Props = {
	startCursor: string
	endCursor: string
	hasPreviousPage: boolean
	hasNextPage: boolean
}
const LoadMore = ({ startCursor, endCursor, hasPreviousPage, hasNextPage }: Props) => {
	const router = useRouter()

	function handleNavigation(direction: string) {
		const currentParams = new URLSearchParams(window.location.search)

		if (direction === 'next' && hasNextPage) {
			currentParams.delete('startCursor')
			currentParams.set('endCursor', endCursor)
		} else if (direction === 'prev' && hasPreviousPage) {
			currentParams.delete('endCursor')
			currentParams.set('startCursor', startCursor)
		}

		const newSearchParams = currentParams.toString()
		const newPathName = `${window.location.pathname}?${newSearchParams}`
		router.push(newPathName)
	}
	return (
		<div className="w-full flexCenter gap-5 mt-10">
			{hasPreviousPage && (
				<Button title="First Page" handleClick={() => handleNavigation('prev')} />
			)}
			{hasNextPage && <Button title="Next Page" handleClick={() => handleNavigation('next')} />}
		</div>
	)
}

export default LoadMore
