export function createUserProfileHTML(user) {
    const statusClass = user.active ? 'status-active' : 'status-inactive';
    return `
        <div class="profile-card">
            <img src="https://i.pravatar.cc/150?img=${user.id}" alt="${user.fullName}" class="profile-pic ${statusClass}">
            <div class="profile-info">
                <h3>${user.first} ${user.last}</h3>
                <p>${user.email}</p>
                <p>Position: ${user.position}</p>
                <span class="status ${statusClass}">${user.active ? 'Active' : 'Inactive'}</span>
                <button class="action-btn toggle-status-btn" data-active="${user.active}">${user.active ? 'Deactivate' : 'Activate'}</button>
            </div>
            <button class="action-btn message-btn ${statusClass}" data-user-id="${user.id}">Message</button>
        </div>
    `;
}
