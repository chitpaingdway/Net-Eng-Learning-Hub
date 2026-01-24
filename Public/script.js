// သင်ခန်းစာ အချက်အလက်များ
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

const tabList = document.getElementById('tab-list');
const viewer = document.getElementById('pdf-viewer');
const title = document.getElementById('current-title');
const downloadBtn = document.getElementById('download-link');
const fileNameLabel = document.getElementById('file-name');

// Tab များ ထုတ်ပေးခြင်း
function renderTabs() {
    tabList.innerHTML = courses.map((course, index) => `
        <li class="nav-item" id="tab-${index}" onclick="selectCourse(${index})">
            ${course.name}
        </li>
    `).join('');
    
    // ပထမဆုံး သင်ခန်းစာကို auto ဖွင့်ထားပေးမယ်
    if(courses.length > 0) selectCourse(0);
}

// Course ရွေးချယ်ခြင်း
function selectCourse(index) {
    const selected = courses[index];
    
    // UI Update
    title.innerText = selected.name;
    fileNameLabel.innerText = "Viewing: " + selected.fileName;
    
    // PDF ပွင့်စေရန် (uploads folder ထဲက file ကို ခေါ်တာပါ)
    viewer.src = `/uploads/${selected.fileName}`;
    downloadBtn.href = `/uploads/${selected.fileName}`;

    // Active Tab အရောင်ပြောင်းရန်
    document.querySelectorAll('.nav-item').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });
}

// စတင်ပွင့်ချိန်မှာ tab တွေကို ဖော်ပြပေးမယ်
renderTabs();

function showTab(tabId) {
    // Content အားလုံးကို ဖျောက်ပါ
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // ခလုတ်အားလုံးက Active အရောင်ကို ဖြုတ်ပါ
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // နှိပ်လိုက်တဲ့ Tab ကို ပြပါ
    document.getElementById(tabId).classList.add('active');
    
    // နှိပ်လိုက်တဲ့ ခလုတ်ကို အရောင်တင်ပါ
    event.currentTarget.classList.add('active');
}
