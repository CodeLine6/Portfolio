// sanity.js
import {createClient} from '@sanity/client'
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_APP_ID,
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-04-13', // use current date (YYYY-MM-DD) to target the latest API version
  // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
})

// uses GROQ to query content: https://www.sanity.io/docs/groq
export async function getBio() {
    //fetch only single document
    const bio = await client.fetch('*[_type == "bio"][0]{name,"image":image.asset->url,description,resume,roles,github,twitter,linkedin}')
    return bio
}

export async function getSkills() {
  //fetch skills and auto-populate referenced skill in a Sanity.io schema and order skills by date created in ascending order
  const skills = await client.fetch('*[_type == "skills"] | order(_createdAt asc) {title, skills[]->{name,"image": image.asset->url}}')
  return skills
}

export async function getExperience() {
  const experience = await client.fetch('*[_type == "experience"]{"img":img.asset->url,role,company,date,description,"skills":skills[]->name}')
  return experience
}

export async function getProjects() {
  const projects = await client.fetch('*[_type == "projects"]{title,description,"image":image.asset->url,tags,"category":category[]->name,github,webapp}')
  return projects
}

export async function getEducation() {
  const education = await client.fetch('*[_type == "education"]{"img":img.asset->url,school,date,grade,desc,degree}')
  return education
}

export async function getProjectFilters() {
  const projectCategories = await client.fetch('*[_type == "projects"]{"category":category[]->name}')
  const uniqueProjectCategories = projectCategories.map(category => category.category).flat().filter((value, index, self) => self.indexOf(value) === index)
  return uniqueProjectCategories
}