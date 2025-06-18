export interface Category {
    id: number
    name: string
    description: string
    parent_id: number | null
    status: number
    image: any
    created_at: string
    updated_at: string
}