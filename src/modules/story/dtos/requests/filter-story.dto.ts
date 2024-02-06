import { IsString } from "class-validator"

export interface Sort {
    by: string,
    direction: "asc" | "desc"
}

export class FilterStoryRequestDTO {
    title: string

    category: string

    level: string

    sort: Sort
}