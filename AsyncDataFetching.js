export async function fetchUserPosts(userId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    if (!response.ok) throw new Error('Network error');
    const posts = await response.json();
    return posts.map(post => post.title);
}
