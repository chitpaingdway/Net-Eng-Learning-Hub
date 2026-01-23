// သင်ခန်းစာ အချက်အလက်များ
const courses = [
    { id: "ospf", name: "OSPF Basics to Advanced", fileName: "ospf_course.pdf" },
    { id: "bgp", name: "CCIE BGP", fileName: "CCIE_BGP.pdf" },
    { id: "mpls", name: "MPLS Concepts", fileName: "mpls_v1.pdf" },
    { id: "sdwan", name: "SD-WAN Architecture", fileName: "SDWAN_Architectire.pdf" },
    { id: "ccnp Switch", name: "CCNP Switching", fileName: "ccnp_switch.pdf" },
    { id: "ccna datacenter", name: "CCNA Datacenter", fileName: "ccna_datacenter.pdf" },
    { id: "cisco aci", name: "Cisco ACI", fileName: "cisco_aci.pdf" },
    { id: "Python Networking", name: "Cisco ACI", fileName: "Python_network_programming.pdf" },

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
