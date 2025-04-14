export function processUserData(users) {
    return users
        .filter(user => user.active)
        .map(user => ({
            id: user.id,
            fullName: `${user.first} ${user.last}`,
            email: user.email
        }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
}
