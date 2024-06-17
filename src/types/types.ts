// types/types.ts
export interface Hospital {
    id: string;
    Hospital: string;
    City?: string;
    State?: string;
    Lat: number;
    Long: number;
    [key: string]: any; // For dynamic properties
}
