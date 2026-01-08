let currentUserRole = "";
let communityWallet = 1550000;

let projects = [
    { name: "Market Well Project", raised: 1250000, goal: 2500000 },
    { name: "Ivue Road Repair", raised: 300000, goal: 1000000 }
];

let posts = [
    { title: "Town Hall Meeting", content: "Updates on the new health post location.", time: "1 day ago", comments: ["(Local) Ready to help!", "(Diaspora) Supporting from UK"] }
];

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    currentUserRole = document.getElementById('userRole').value;
    
    if (email != "" && pass != "") {
        document.getElementById('authPage').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        
        // RBAC: Show admin tools ONLY to Village Head
        document.getElementById('postInputArea').style.display = (currentUserRole === "Village Head") ? "block" : "none";
        
        refreshUI();
    } else {
        alert("Please fill in login details");
    }
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
            <div class="card p-3 shadow-sm mb-3">
                <h5 class="text-success mb-1">${p.name}</h5>
                <h4 class="mb-2">₦ ${p.raised.toLocaleString()}</h4>
                <div class="progress mb-2" style="height: 8px;">
                    <div class="progress-bar bg-success" style="width: ${perc}%"></div>
                </div>
                <div class="d-flex justify-content-between small text-muted mb-3">
                    <span>Target: ₦ ${p.goal.toLocaleString()}</span>
                    <span>${Math.round(perc)}%</span>
                </div>
                <button onclick="donate(${i})" class="btn btn-sm btn-success w-100">Contribute Funds</button>
            </div>`;
    });
}

function donate(index) {
    let amt = prompt("How much would you like to contribute to " + projects[index].name + "?");
    if (amt && !isNaN(amt)) {
        let val = parseInt(amt);
        projects[index].raised += val;
        communityWallet += val;
        refreshUI();
        alert("Success! ₦" + val.toLocaleString() + " added to wallet.");
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
        let coms = p.comments.map(c => `<div class="p-1 border-bottom small">${c}</div>`).join('');
        feed.innerHTML += `
            <div class="card mb-3">
                <div class="p-3">
                    <h6 class="text-success mb-1">${p.title}</h6>
                    <p class="small mb-1">${p.content}</p>
                    <small class="text-muted">${p.time}</small>
                </div>
                <div class="comment-box">
                    <div class="text-muted small mb-2">Comments:</div>
                    ${coms}
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
        // We tag the comment with the user's role
        posts[index].comments.push(`(${currentUserRole}) ${val}`);
        showFeed();
    }
  }
