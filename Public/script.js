// သင်ခန်းစာ အချက်အလက်များ (E-books အတွက်)
const courses = [
    { id: "ospf", name: "OSPF Basics to Advanced", fileName: "ospf_course.pdf" },
    { id: "bgp", name: "CCIE BGP", fileName: "CCIE_BGP.pdf" },
    { id: "mpls", name: "MPLS Concepts", fileName: "mpls_v1.pdf" },
    { id: "sdwan", name: "SD-WAN Architecture", fileName: "SDWAN_Architectire.pdf" },
    { id: "ccnp-switch", name: "CCNP Switching", fileName: "ccnp_switch.pdf" },
    { id: "ccna-dc", name: "CCNA Datacenter", fileName: "ccna_datacenter.pdf" },
    { id: "cisco-aci", name: "Cisco ACI", fileName: "cisco_aci.pdf" },
    { id: "python", name: "Python Networking", fileName: "Python_network_programming.pdf" },
    { id: "ccie-rs", name: "CCIE R&S Third Edition", fileName: "CCIE_R&S.pdf" },
    { id: "ccie-multi", name: "CCIE Multicast", fileName: "CCIE_Multicast.pdf" },
    { id: "ccie-ipsec", name: "CCIE Ipsec", fileName: "CCIE_Ipsec.pdf" },
    { id: "ccna", name: "CCNA", fileName: "CCNA.pdf" },
    { id: "ccnp-route", name: "CCNP Route", fileName: "CCNP_Route.pdf" },
    { id: "ccnp-ent", name: "CCNP Enterprise", fileName: "CCNP_Enterprise.pdf" },
    { id: "net-auto", name: "Network Automation", fileName: "Network_Automation.pdf" },
    { id: "sdwan-learn", name: "SDWAN Learning", fileName: "SDWAN_Learning.pdf" }
];

// --- Tab Switching Logic ---
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
    
    // Video Tab ကိုနှိပ်ရင် Level 1 အတိုင်း Category တွေကို ပြန်ပြမယ်
    if(tabId === 'videos') backToCategories();
}

// --- Video Navigation Logic ---
function toggleCategory(categoryId) {
    document.querySelectorAll('.category-card').forEach(card => card.style.display = 'none');
    document.getElementById('video-lists-container').style.display = 'block';
    document.querySelectorAll('.video-sub-grid').forEach(list => list.style.display = 'none');
    document.getElementById(categoryId).style.display = 'grid';
}

function toggleSubCategoryMenu(menuId) {
    document.querySelectorAll('.category-card').forEach(card => card.style.display = 'none');
    document.getElementById('video-lists-container').style.display = 'block';
    document.querySelectorAll('.video-sub-grid').forEach(list => list.style.display = 'none');
    document.getElementById(menuId).style.display = 'grid';
}

function toggleIGPVideos(videoId) {
    document.querySelectorAll('.video-sub-grid').forEach(list => list.style.display = 'none');
    document.getElementById(videoId).style.display = 'grid';
}

function backToCategories() {
    const container = document.getElementById('video-lists-container');
    if(container) container.style.display = 'none';
    document.querySelectorAll('.category-card').forEach(card => card.style.display = 'block');
    document.querySelectorAll('.video-sub-grid').forEach(list => list.style.display = 'none');
}

// --- PDF & Video Modal Logic ---
function openPDF(path, title) {
    const modal = document.getElementById('pdfModal');
    const frame = document.getElementById('pdf-frame');
    document.getElementById('pdf-title').innerText = title;
    document.getElementById('dl-link').href = path;
    frame.src = path;
    modal.style.display = "block";
}

function closePDF() {
    document.getElementById('pdfModal').style.display = "none";
    document.getElementById('pdf-frame').src = "";
}

function openVideo(id, title) {
    const modal = document.getElementById('videoModal');
    const frame = document.getElementById('video-frame');
    document.getElementById('video-title').innerText = title;
    
    // ?modestbranding=1&rel=0&showinfo=0 ဆိုတာတွေက YouTube logo နဲ့ တခြား ဗီဒီယိုတွေကို ဖျောက်ပေးတာပါ
    frame.src = `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0&iv_load_policy=3&controls=1`;
    
    modal.style.display = "block";
}
function closeVideo() {
    document.getElementById('videoModal').style.display = "none";
    document.getElementById('video-frame').src = "";
}

function goFull() {
    const frame = document.getElementById("pdf-frame");
    if (frame.requestFullscreen) frame.requestFullscreen();
    else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
}

window.onclick = function(event) {
    if (event.target.className === 'modal') {
        closePDF(); closeVideo();
    }
}
