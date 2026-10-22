import type { Province } from './types';

export const provinces: Province[] = [
    { provinceName: 'Alberta', gst: 5, pst: 0, hst: 0 },
    { provinceName: 'British Columbia', gst: 5, pst: 7, hst: 0 },
    { provinceName: 'Manitoba', gst: 5, pst: 7, hst: 0 },
    { provinceName: 'New Brunswick', gst: 0, pst: 0, hst: 15 },
    { provinceName: 'Newfoundland and Labrador', gst: 0, pst: 0, hst: 15 },
    { provinceName: 'Northwest Territories', gst: 5, pst: 0, hst: 0 },
    { provinceName: 'Nova Scotia', gst: 0, pst: 0, hst: 14 },
    { provinceName: 'Nunavut', gst: 5, pst: 0, hst: 0 },
    { provinceName: 'Ontario', gst: 0, pst: 0, hst: 13 },
    { provinceName: 'Prince Edward Island', gst: 0, pst: 0, hst: 15 },
    { provinceName: 'Quebec', gst: 5, pst: 9.975, hst: 0 },
    { provinceName: 'Saskatchewan', gst: 5, pst: 6, hst: 0 },
    { provinceName: 'Yukon', gst: 5, pst: 0, hst: 0 },
];
