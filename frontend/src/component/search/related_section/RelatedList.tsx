import { RelatedCard, RelatedCardProps } from "./RelatedCard"

interface RelatedListProps {
    searches: RelatedCardProps[]
    className?: string
}

export function RelatedList({ searches, className }: RelatedListProps) {
    return (
        <div className={className}>
            <div className="mb-4 text-lg font-medium text-center">Related Searches</div>
            <div className="flex w-full gap-4 overflow-x-auto pb-4 justify-between">
                {searches.map((search) => (
                    <RelatedCard
                        key={search.id}
                        id={search.id}
                        image={search.image}
                        url={search.url}
                        label={search.label}
                    />
                ))}
            </div>
        </div>
    )
}
