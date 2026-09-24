import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { ProjectCard } from './features/projects/ProjectCard';




export function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <h1>Hello, world!</h1>
        <p>Software Engineer | Cybersecurity & IT | AI-Assisted Workflows</p>

        <h2>Featured Projects</h2>
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
      </main>
      <SiteFooter />
    </>
  )
}