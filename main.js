import { processUserData } from './DataTransformation.js';
import { fetchUserPosts } from './AsyncDataFetching.js';
import { createUserProfileHTML } from './UserComponent.js';
import { createStateManager } from './StateManagementHelper.js';
import { users, sampleUser } from './data.js';

// Processed User Data
const processedUsers = processUserData(users);
const usersTable = document.getElementById('processed-users');
let currentFeaturedUser = { ...sampleUser };

function renderProcessedUsers() {
    usersTable.innerHTML = '';
    processedUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td><button class="action-btn view-btn" data-index="${index}">View</button></td>
        `;
        usersTable.appendChild(row);
    });
}
renderProcessedUsers();

// User Posts
const postsList = document.getElementById('user-posts');
fetchUserPosts(1).then((titles) => {
    postsList.innerHTML = '';
    titles.slice(0, 8).forEach((title) => {
        const li = document.createElement('li');
        li.textContent = `${title.substring(0, 50)}${title.length > 50 ? '...' : ''}`;
        postsList.appendChild(li);
    });
});

// User List initial display
const profileDisplay = document.getElementById('user-profile');
profileDisplay.innerHTML = createUserProfileHTML(currentFeaturedUser);

// Message Popup
function createMessagePopup(user) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h3>Send Message to ${user.fullName}</h3>
            <textarea placeholder="Type your message here..."></textarea>
            <div class="popup-buttons">
                <button class="action-btn cancel-btn">Cancel</button>
                <button class="action-btn send-btn">Send</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);

    const cancelBtn = popup.querySelector('.cancel-btn');
    const sendBtn = popup.querySelector('.send-btn');
    const textarea = popup.querySelector('textarea');

    cancelBtn.addEventListener('click', () => {
        popup.remove();
    });

    sendBtn.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            log(`Message sent to ${user.fullName}: ${message}`);
        }
        popup.remove();
    });

    popup.style.display = 'flex';
}

// Update User List on view click and handle status toggle
function updateProfileDisplay(user) {
    profileDisplay.innerHTML = createUserProfileHTML(user);
    const toggleBtn = profileDisplay.querySelector('.toggle-status-btn');
    const messageBtn = profileDisplay.querySelector('.message-btn');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            user.active = !user.active;
            // Update the source users array
            const sourceUser = users.find(u => u.id === user.id);
            if (sourceUser) {
                sourceUser.active = user.active;
            }
            // Reprocess users to reflect active status changes
            processedUsers.length = 0;
            processedUsers.push(...processUserData(users));
            renderProcessedUsers();
            updateProfileDisplay(user);
            log(`User status toggled: ${user.fullName} is now ${user.active ? 'Active' : 'Inactive'}`);
        });
    }

    if (messageBtn) {
        messageBtn.addEventListener('click', () => {
            createMessagePopup(user);
        });
    }
}

document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        const selectedUser = processedUsers[index];
        currentFeaturedUser = {
            id: selectedUser.id,
            first: selectedUser.fullName.split(' ')[0],
            last: selectedUser.fullName.split(' ')[1],
            email: selectedUser.email,
            position: 'Team Member',
            active: users.find(u => u.id === selectedUser.id).active,
            fullName: selectedUser.fullName
        };
        updateProfileDisplay(currentFeaturedUser);
        log(`User displayed: ${currentFeaturedUser.fullName}`);
    });
});

// State Management
const stateElements = {
    initial: document.getElementById('initial-state'),
    current: document.getElementById('current-state')
};
const userState = createStateManager({ name: 'Alex', status: 'Inactive' });
stateElements.initial.textContent = JSON.stringify(userState.getState(), null, 2);
stateElements.current.textContent = JSON.stringify(userState.getState(), null, 2);

userState.subscribe((state) => {
    stateElements.current.textContent = JSON.stringify(state, null, 2);
});

setTimeout(() => userState.setState({ status: 'Active' }), 1000);
setTimeout(() => userState.setState({ lastSeen: new Date().toLocaleString() }), 2000);

// System Logs
const consoleOutput = document.getElementById('console-output');
const logMessages = [];
const log = (message) => {
    const time = new Date().toLocaleTimeString();
    logMessages.push({ time, message });
    consoleOutput.textContent += `${time} - ${message}\n`;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
};

log('System initialized');
log(`Loaded ${processedUsers.length} active users`);
fetchUserPosts(1)
    .then((titles) => log(`Fetched ${titles.length} posts`))
    .catch((error) => log(`Error fetching posts: ${error}`));
log(`Profile displayed: ${currentFeaturedUser.fullName}`);
userState.subscribe((state) => log(`Status updated: ${JSON.stringify(state)}`));

// Logs controls
document.getElementById('format-logs').addEventListener('click', () => {
    consoleOutput.textContent = logMessages.map(msg => `${msg.time} - ${msg.message}`).join('\n');
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
});

document.getElementById('export-data').addEventListener('click', async () => {
    const posts = await fetchUserPosts(1).catch(() => []);
    consoleOutput.textContent = `
Processed Users: ${JSON.stringify(processedUsers, null, 2)}

User Profile HTML: ${createUserProfileHTML(currentFeaturedUser)}

Initial State: ${JSON.stringify(userState.getState(), null, 2)}

User Posts: ${JSON.stringify(posts.slice(0, 8), null, 2)}

State changed: ${JSON.stringify({ name: 'Alex', status: 'Active' }, null, 2)}
State changed: ${JSON.stringify({ name: 'Alex', status: 'Active', lastSeen: new Date().toLocaleString() }, null, 2)}
    `;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
});

// Refresh button
document.querySelector('.refresh-btn').addEventListener('click', () => {
    log('Refreshing page...');
    location.reload();
});
