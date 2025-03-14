import { FullSlug, getFullSlug, pathToRoot, simplifySlug } from "../../util/path"

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export async function navigateToRandomPage() {
    const fullSlug = getFullSlug(window)
    const currentSlug = simplifySlug(getFullSlug(window))
    const data = await fetchData
    const allPosts = Object.keys(data).map((slug) => simplifySlug(slug as FullSlug))

    let newSlug = allPosts[getRandomInt(allPosts.length)];

    // Ensure newSlug is not the current page
    while (newSlug === currentSlug) {
        newSlug = allPosts[getRandomInt(allPosts.length)];
    }

    let newPageUrl;
    if (newSlug === '' || newSlug === '/') {
        newPageUrl = pathToRoot(fullSlug);
    } else {
        newPageUrl = `${pathToRoot(fullSlug)}/${newSlug}`;
    }
    window.location.href = newPageUrl;
}

document.addEventListener("nav", async (e: unknown) => {
    const button = document.getElementById("random-page-button")
    button?.removeEventListener("click", navigateToRandomPage)
    button?.addEventListener("click", navigateToRandomPage)
})