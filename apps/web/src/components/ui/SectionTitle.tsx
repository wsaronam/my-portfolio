import type { ReactNode } from 'react';

import styles from './SectionTitle.module.css';




type SectionTitleProps = {
    id: string
    children: ReactNode
}


export function SectionTitle({ id, children }: SectionTitleProps) {
    return (
        <h2 id={id} className={styles.title}>
            <span className={styles.text}>{children}</span>
        </h2>
    )
}