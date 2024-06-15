// types/types.ts
export interface Hospital {
    id: string;
    Hospital: string;
    City?: string;
    State?: string;
    Lat: string;
    Long: string;
    [key: string]: any; // For dynamic properties
}
