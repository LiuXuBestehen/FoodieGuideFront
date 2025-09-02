export const getTodaySeed = () => {
    const today = new Date().toISOString().split("T")[0]; // e.g. "2025-06-27"
    return today.split("-").join(""); // e.g. "20250627"
};

export const getRandomPage = (seed, total, pageSize) => {
    const numPages = Math.ceil(total / pageSize);
    const hash = Array.from(seed).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return (hash % numPages) + 1;
};