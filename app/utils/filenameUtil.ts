// src/utils/filenameUtil.ts

const base62Chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Generates a random base62 string of given length.
 */
export const generateBase62Id = (length = 22): string => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
        .map(b => base62Chars[b % 62])
        .join("");
};

/**
 * Generates a unique filename using a base62 ID and the file type extension.
 * @param fileType e.g., "audio/mpeg"
 * @param length Length of the base62 ID (default is 22)
 * @returns e.g., "aZ93KxQ81UfYo4wR7sD3Le.mpeg"
 */
export const generateFilename = (fileType: string, length = 22): string => {
    const extension = fileType.split("/")[1];
    const id = generateBase62Id(length);
    return `${id}.${extension}`;
};
