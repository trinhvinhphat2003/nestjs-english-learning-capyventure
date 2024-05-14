import { IsString } from "class-validator"

export interface Sort {
    by: string,
    direction: "asc" | "desc"
}

export class FilterVideoRequestDTO {
    caption: string

    category: string

    level: string

    sort: Sort
}