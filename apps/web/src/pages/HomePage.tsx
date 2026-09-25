import { ProjectCard } from '../features/projects/ProjectCard';




export function HomePage() {
    return (
        <>
            <h1>Hello, I'm Willy Saronamihardja</h1>
            <p>Software Engineer | Cybersecurity & IT | AI-Assisted Workflows</p>

            <h2>Features Projects</h2>
            <ProjectCard
                title='Packet Sniffer'
                summary='Port scanner'
                tags={['python', 'networking']}
            />
            <ProjectCard
                title='Dungeon Map Generator'
                summary='Generates dungeon maps using GROQ AI'
                tags={['react', 'flask', 'ai']}
            />
        </>
    )
}