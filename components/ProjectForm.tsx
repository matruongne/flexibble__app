'use client'

import { ChangeEvent, useState } from 'react'
import { SessionInterface, ProjectInterface } from '../common.types'
import Image from 'next/image'
import { Button, CustomMenu, FormField } from '.'
import { categoryFilters } from '../constants/index'
import { EditProject, createNewProject, fetchToken } from '../lib/action'
import { useRouter } from 'next/navigation'

const ProjectForm = ({
	type,
	session,
	project,
}: {
	type: string
	session: SessionInterface
	project?: ProjectInterface
}) => {
	const router = useRouter()

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [form, setForm] = useState({
		title: project?.title || '',
		description: project?.description || '',
		image: project?.image || '',
		liveSiteUrl: project?.liveSiteUrl || '',
		githubUrl: project?.githubUrl || '',
		category: project?.category || '',
	})

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		setIsSubmitting(true)

		const token = await fetchToken()

		try {
			if (type === 'create') {
				await createNewProject(form, session?.user?.id, token.token)
				router.push('/')
			}
			if (type === 'edit') {
				await EditProject(form, project?.id!, token.token)
				router.push('/')
				router.refresh()
			}
		} catch (error) {
			throw error
		} finally {
			setIsSubmitting(false)
		}
	}
	const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		const file = e.target.files?.[0]
		if (!file) {
			return
		}
		if (!file.type.includes('image')) {
			return alert('Please select an image file to display in the browser and try again')
		}
		// const url = URL.createObjectURL(file)
		// handleStateChange('image', url)

		const reader = new FileReader()

		reader.readAsDataURL(file)

		reader.onload = () => {
			const result = reader.result as string
			handleStateChange('image', result)
		}
	}

	const handleStateChange = (fieldName: string, value: string) => {
		setForm((prev) => ({ ...prev, [fieldName]: value }))
	}
	console.log(form)
	return (
		<form onSubmit={handleFormSubmit} className="flexStart form">
			<div className="flexStart form_image-container">
				<label htmlFor="poster" className="flexCenter form_image-label">
					{!form.image && 'Choose a poster for your project'}
				</label>
				<input
					type="file"
					accept="image/*"
					id="image"
					required={type === 'create'}
					className="form_image-input"
					onChange={handleChangeImage}
				/>
				{form.image && (
					<Image
						src={form?.image}
						alt="Project poster"
						className="sm:p-10 object-contain z-20"
						fill
					/>
				)}
			</div>

			<FormField
				title="title"
				state={form.title}
				placeholder="Flexibble"
				setState={(value) => handleStateChange('title', value)}
			/>
			<FormField
				title="Description"
				state={form.description}
				placeholder="Showcase and discover remarkable developers projects."
				setState={(value) => handleStateChange('description', value)}
			/>
			<FormField
				type="url"
				title="Website URL"
				state={form.liveSiteUrl}
				placeholder="httpS://example.com"
				setState={(value) => handleStateChange('liveSiteUrl', value)}
			/>
			<FormField
				type="url"
				title="Github URL"
				state={form.githubUrl}
				placeholder="https://github.com"
				setState={(value) => handleStateChange('githubUrl', value)}
			/>

			<CustomMenu
				title="Category"
				state={form.category}
				filters={categoryFilters}
				setState={(value) => handleStateChange('category', value)}
			/>

			<div className="flexStart w-full">
				<Button
					title={
						isSubmitting
							? `${type === 'create' ? 'Creating' : 'Editing'}`
							: `${type === 'create' ? 'Create' : 'Edit'}`
					}
					type="submit"
					leftIcon={isSubmitting ? '' : '/plus.svg'}
					isSubmitting={isSubmitting}
				></Button>
			</div>
		</form>
	)
}

export default ProjectForm
