import { ProjectInterface } from '@/common.types'
import { fetchAllProjects } from '../lib/action'
import { Categories, LoadMore, ProjectCard } from '@/components'
type ProjectSearch = {
	projectSearch: {
		edges: {
			node: ProjectInterface
		}[]
		pageInfo: {
			hasPreviousPage: boolean
			hasNextPage: boolean
			startCursor: string
			endCursor: string
		}
	}
}
type searchParams = {
	category?: string | null
	endCursor?: string | null
}
type Props = {
	searchParams: searchParams
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export default async function ({ searchParams: { category, endCursor } }: Props) {
	const data = (await fetchAllProjects(category!, endCursor!)) as ProjectSearch
	const pagination = data?.projectSearch?.pageInfo
	console.log(data)
	const projectsToDisplay = data?.projectSearch?.edges || []
	if (projectsToDisplay.length === 0) {
		return (
			<section className="flexStart flex-col paddings">
				<Categories />

				<p className="no-result-text text-center">No projects found,go create some first.</p>
			</section>
		)
	}
	return (
		<section className="flex-start flex-col paddings mb-16">
			<Categories />
			<section className="projects-grid">
				{projectsToDisplay.map(({ node }: { node: ProjectInterface }, index) => (
					<ProjectCard
						key={index}
						id={node?.id}
						image={node?.image}
						title={node?.title}
						name={node?.createdBy?.name}
						avatarUrl={node?.createdBy?.avatarUrl}
						userId={node?.createdBy.id}
					/>
				))}
			</section>{' '}
			<LoadMore
				startCursor={pagination?.startCursor}
				endCursor={pagination?.endCursor}
				hasPreviousPage={pagination?.hasPreviousPage}
				hasNextPage={pagination?.hasNextPage}
			/>
		</section>
	)
}
