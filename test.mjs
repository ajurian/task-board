const data = [];

for (let i = 0; i < 100; i++) {
    data.push(i * 100);
}

function returnWithDelay({ id }, delay) {
    return new Promise((resolve) => setTimeout(() => resolve(data[id]), delay));
}

const array = [];

for (let i = 0; i < 100; i++) {
    array.push({ id: i });
}

(async () => {
    const test = await Promise.all(
        array.map(async (data) => {
            const result = await returnWithDelay(data, 1000);
            return { ...data, result };
        })
    );
    console.log(test);
})();
