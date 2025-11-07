import { Pandal } from '@/lib/types';

export const validateForm = (form: Partial<Pandal>): { valid: boolean; error?: string } => {
    if (!form.name || !form.description || !form.address) {
        return {
            valid: false,
            error: 'Please fill in all required fields (Name, Description, Address)'
        };
    }

    if (!form.latitude || !form.longitude) {
        return {
            valid: false,
            error: 'Please provide valid latitude and longitude coordinates'
        };
    }

    if (form.rating && (form.rating < 0 || form.rating > 5)) {
        return {
            valid: false,
            error: 'Rating must be between 0 and 5'
        };
    }

    return { valid: true };
};