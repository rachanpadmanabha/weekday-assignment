let controller;

const fetchJobs = async (page) => {
    const limit = 30;
    const offset = page * limit;

    if (controller) {
        controller.abort();
    }

    controller = new AbortController();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const body = JSON.stringify({ limit, offset });
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body,
        signal: controller.signal,
    };

    const response = await fetch(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        requestOptions
    );

    if (!response.ok) {
        throw new Error("Failed to fetch jobs");
    }

    const data = await response.json();
    return data;
};

const cancelFetchJobs = () => {
    if (controller) {
        controller.abort();
    }
};

export default fetchJobs;
export { cancelFetchJobs };