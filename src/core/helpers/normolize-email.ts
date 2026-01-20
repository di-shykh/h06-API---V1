export function normalizeEmail(email: string): string {
    let normalized = email.toLowerCase().trim();
    const atIndex = normalized.indexOf('@');
    if (atIndex > 0) {
        const localPart = normalized.substring(0, atIndex);
        const domain = normalized.substring(atIndex);
        const plusIndex = localPart.indexOf('+');
        if (plusIndex > 0) {
            normalized = localPart.substring(0, plusIndex) + domain;
        }
    }
    return normalized;
}