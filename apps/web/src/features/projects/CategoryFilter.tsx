import { Link } from "react-router";
import type { ProjectCategory } from "./categories";

import styles from './CategoryFilter.module.css';




export type CategoryFilterValue = ProjectCategory | 'all';

export type FilterOption = {
    value: CategoryFilterValue
    label: string
    count: number
};


type CategoryFilterProps = {
    options: FilterOption[]
    active: CategoryFilterValue
};


export function CategoryFilter({ options, active }: CategoryFilterProps) {
    return (
        <nav aria-label='Filter projects by category'>
            <ul className={styles.list}>
                {options.map((option) => (
                    <li key={option.value}>
                        <Link
                            to={option.value === 'all' ? '/projects' : `/projects?category=${option.value}`}
                            className={styles.option}
                            aria-current={option.value === active ? 'true' : undefined}
                        >
                            {option.label}
                            <span className={styles.count}>{option.count}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}