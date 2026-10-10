import { getAllProjects } from "./projects.data"
import { PageHeader } from "../../components/ui/PageHeader";
import { EmptyState } from "../../components/ui/EmptyState";
import { ProjectGrid } from "./ProjectGrid";
import { CategoryFilter, type FilterOption } from "./CategoryFilter";
import { CATEGORY_LABELS, isProjectCategory, PROJECT_CATEGORIES } from "./categories";

import { useSearchParams } from "react-router";

import styles from './ProjectsPage.module.css';




export function ProjectsPage() {
    const [searchParams] = useSearchParams();
    const requested = searchParams.get('category');
    const activeCategory = isProjectCategory(requested) ? requested : 'all';

    const projects = getAllProjects();
    const visibleProjects =
        activeCategory === 'all'
            ? projects
            : projects.filter((project) => project.category === activeCategory)
    

    const filterOptions: FilterOption[] = [
        { value: 'all', label: 'All', count: projects.length },
        ...PROJECT_CATEGORIES.map((category) => ({
            value: category,
            label: CATEGORY_LABELS[category],
            count: projects.filter((project) => project.category === category).length
        }))
    ]


    return (
        <>
            <PageHeader
                kicker='Quest Log'
                title='Projects'
                lead="Things I've built and/or broken"
            />

            <CategoryFilter options={filterOptions} active={activeCategory} />

            <p className='visually-hidden' aria-live='polite'>
                Showing {visibleProjects.length} projects
            </p>

            {visibleProjects.length > 0 ? (
                <ProjectGrid projects={visibleProjects} />
            ) : (
                <EmptyState>No projects in this category yet.</EmptyState>
            )}
        </>
    )
}