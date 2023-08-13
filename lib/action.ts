import { GraphQLClient } from 'graphql-request'
import {
	createProjectMutation,
	createUserMutation,
	getUserQuery,
	projectsQuery,
} from '../graphql/index'
import { ProjectForm } from '@/common.types'
import { updateProjectMutation } from '../graphql/index'
import {
	getProjectByIdQuery,
	getProjectsOfUserQuery,
	deleteProjectMutation,
} from '../graphql/index'

const isProduction = process.env.NODE_ENV === 'production'
const apiUrl = isProduction
	? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ''
	: ' http://127.0.0.1:4000/graphql'

const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY : '1234'
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000'
const client = new GraphQLClient(apiUrl)

const makeGraphQLRequest = async (query: string, variables = {}) => {
	try {
		return await client.request(query, variables)
	} catch (error: any) {
		throw error
	}
}

export const GetUser = (email: string) => {
	client.setHeader('x-api-key', apiKey!)
	return makeGraphQLRequest(getUserQuery, { email })
}

export const createUser = (name: string, email: string, avatarUrl: string) => {
	client.setHeader('x-api-key', apiKey!)
	const variables = {
		input: {
			name,
			email,
			avatarUrl,
		},
	}
	return makeGraphQLRequest(createUserMutation, variables)
}

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
	const imageUrl = await uploadImage(form.image)

	if (imageUrl.url) {
		client.setHeader('Authorization', `Bearer ${token}`)

		const variables = {
			input: {
				...form,
				image: imageUrl.url,
				createdBy: {
					link: creatorId,
				},
			},
		}
		return makeGraphQLRequest(createProjectMutation, variables)
	}
}

export const fetchToken = async () => {
	try {
		const response = await fetch(`${serverUrl}/api/auth/token`)
		return response.json()
	} catch (error) {
		throw error
	}
}

export const uploadImage = async (imagePath: string) => {
	try {
		const response = await fetch(`${serverUrl}/api/upload`, {
			method: 'POST',
			body: JSON.stringify({
				path: imagePath,
			}),
		})
		return response.json()
	} catch (err) {
		throw err
	}
}

export const fetchAllProjects = async (category?: string, endcursor?: string) => {
	client.setHeader('x-api-key', apiKey!)

	return makeGraphQLRequest(projectsQuery, { category, endcursor })
}

export const getProjectDetails = (id: string) => {
	client.setHeader('x-api-key', apiKey!)
	return makeGraphQLRequest(getProjectByIdQuery, { id })
}

export const getUserProjects = (id: string, last?: number) => {
	client.setHeader('x-api-key', apiKey!)
	return makeGraphQLRequest(getProjectsOfUserQuery, { id, last })
}

export const deleteProject = (id: string, token: string) => {
	client.setHeader('Authorization', `Bearer ${token}`)
	return makeGraphQLRequest(deleteProjectMutation, { id })
}

export const EditProject = async (form: ProjectForm, projectId: string, token: string) => {
	function isBase64DataURL(value: string) {
		const base64Regex = /^data:image\/[a-z]+;base64,/
		return base64Regex.test(value)
	}
	let updatedForm = { ...form }
	console.log(updatedForm)
	const isUploadingNewImage = isBase64DataURL(form.image)

	if (isUploadingNewImage) {
		const imageUrl = await uploadImage(form.image)
		if (imageUrl)
			updatedForm = {
				...form,
				image: imageUrl.url,
			}
	}

	const variables = {
		id: projectId,
		input: updatedForm,
	}
	client.setHeader('Authorization', `Bearer ${token}`)

	return makeGraphQLRequest(updateProjectMutation, variables)
}
