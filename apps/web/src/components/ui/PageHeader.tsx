import styles from './PageHeader.module.css';




type PageHeaderProps = {
    kicker: string
    title: string
    lead?: string
}


export function PageHeader({ kicker, title, lead }: PageHeaderProps) {
    return (
        <header className={styles.header}>
            <title>{`${title} | Willy Saronamihardja`}</title>
            <p className={styles.kicker}>{kicker}</p>
            <h1>{title}</h1>
            {lead && <p className={styles.lead}>{lead}</p>}
        </header>
    )
}