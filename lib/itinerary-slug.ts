import crypto from 'crypto';

/**
 * Generates a clean, human-readable, collision-resistant Itinerary ID / Slug.
 * Example formats:
 * - Single / Option 1: "amit-fu4tgu4" or "naushad-k8m9x2"
 * - Option 2 / Variation: "amit-2-fwebsu7" or "naushad-2-x7w8q2"
 */
export function generateLeadBasedItinerarySlug({
  leadName,
  optionNumber,
  destination
}: {
  leadName?: string;
  optionNumber?: number;
  destination?: string;
} = {}): string {
  // 1. Clean Lead Name
  let nameSlug = '';
  if (leadName) {
    nameSlug = leadName
      .replace(/^(Mr\.|Mr|Mrs\.|Mrs|Ms\.|Ms|Dr\.|Dr|Shri)\s+/i, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Trim length to max 20 chars
    if (nameSlug.length > 20) {
      nameSlug = nameSlug.slice(0, 20).replace(/-+$/, '');
    }
  }

  // 2. Short 6-7 char random alphanumeric hash for collision safety
  const randomHash = crypto.randomBytes(4).toString('hex').slice(0, 7).toLowerCase();

  // 3. Assemble ID based on Lead Name, Option Number, or Destination
  if (nameSlug) {
    if (optionNumber && optionNumber > 1) {
      return `${nameSlug}-${optionNumber}-${randomHash}`;
    }
    return `${nameSlug}-${randomHash}`;
  }

  if (destination) {
    const destSlug = destination
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 15)
      .replace(/^-+|-+$/g, '');
    if (optionNumber && optionNumber > 1) {
      return `${destSlug}-${optionNumber}-${randomHash}`;
    }
    return `${destSlug}-${randomHash}`;
  }

  return `wp-${randomHash}`;
}
