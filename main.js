let currentUserRole = "";
let communityWallet = 1850000;

let projects = [
    { name: "Market Well Project", raised: 1250000, goal: 2500000 },
    { name: "Ivue Road Patching", raised: 600000, goal: 1500000 }
];

let posts = [
    { title: "Village Meeting", content: "Monthly security briefing at the town hall.", time: "2 hours ago", comments: ["(Local Resident) I'll be there"] }
];

function handleLogin() {
    currentUserRole = document.getElementById('userRole').value;
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    if (currentUserRole === "Village Head (Onojie Rep)") {
        document.getElementById('postInputArea').style.display = 'block';
    } else {
        document.getElementById('postInputArea').style.display = 'none';
    }
    
    refreshUI();
}

function refreshUI() {
    document.getElementById('walletTotal').innerText = communityWallet.toLocaleString();
    showProjects();
    showFeed();
}

function showProjects() {
    const list = document.getElementById('projectList');
    list.innerHTML = '';
    projects.forEach((p, i) => {
        let perc = Math.min((p.raised / p.goal) * 100, 100);
        list.innerHTML += `
            <div class="card p-3 mb-3">
                <h6 class="text-success mb-1">${p.name}</h6>
                <h4 class="mb-2">₦ ${p.raised.toLocaleString()}</h4>
                <div class="progress mb-2" style="height: 8px;"><div class="progress-bar bg-success" style="width: ${perc}%"></div></div>
                <div class="d-flex justify-content-between small text-muted mb-2">
                    <span>Goal: ₦ ${p.goal.toLocaleString()}</span>
                    <span>${Math.round(perc)}%</span>
                </div>
                <button onclick="donate(${i})" class="btn btn-sm btn-success w-100">Contribute Funds</button>
            </div>`;
    });
}

function donate(index) {
    let amt = prompt("Enter amount to donate to " + projects[index].name + ":");
    if (amt && !isNaN(amt)) {
        let v = parseInt(amt);
        projects[index].raised += v;
        communityWallet += v;
        refreshUI();
        alert("Thank you! Contribution successful.");
    }
}

function createNewProject() {
    const n = document.getElementById('projName').value;
    const g = document.getElementById('projGoal').value;
    if (n && g) {
        projects.push({ name: n, raised: 0, goal: parseInt(g) });
        document.getElementById('projName').value = "";
        document.getElementById('projGoal').value = "";
        refreshUI();
    }
}

function showFeed() {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    posts.forEach((p, i) => {
        let coms = p.comments.map(c => `<div class="comment-item">${c}</div>`).join('');
        feed.innerHTML += `
            <div class="card mb-3 p-3">
                <h6 class="text-success mb-0">${p.title}</h6>
                <p class="small text-muted mb-2">${p.time}</p>
                <p class="small">${p.content}</p>
                <div class="comment-box mt-2">${coms}
                    <div class="input-group mt-2">
                        <input type="text" id="com-${i}" class="form-control form-control-sm" placeholder="Reply...">
                        <button onclick="addComment(${i})" class="btn btn-sm btn-outline-success">Send</button>
                    </div>
                </div>
            </div>`;
    });
}

function addPost() {
    const t = document.getElementById('postTitle').value;
    const c = document.getElementById('postContent').value;
    if (t && c) {
        posts.unshift({ title: t, content: c, time: "Just now", comments: [] });
        document.getElementById('postTitle').value = "";
        document.getElementById('postContent').value = "";
        showFeed();
    }
}

function addComment(index) {
    const val = document.getElementById('com-' + index).value;
    if (val) {
        posts[index].comments.push(`(${currentUserRole}) ${val}`);
        showFeed();
    }
     }
