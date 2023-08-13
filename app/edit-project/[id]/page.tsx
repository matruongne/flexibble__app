import { Modal, ProjectForm } from '@/components'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getProjectDetails } from '../../../lib/action'
import { ProjectInterface } from '../../../common.types'

const EditProject = async ({ params: { id } }: { params: { id: string } }) => {
	const session = await getCurrentUser()
	if (!session?.user) redirect('/')

	const result = (await getProjectDetails(id)) as { project?: ProjectInterface }
	return (
		<Modal>
			<h3 className="modal-head-text">Edit project</h3>
			<ProjectForm type="edit" session={session} project={result?.project} />
		</Modal>
	)
}

export default EditProject
