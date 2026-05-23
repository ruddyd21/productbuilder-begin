const backBtn = document.getElementById('back');
const forwardBtn = document.getElementById('forward');
const refreshBtn = document.getElementById('refresh');
const addressBar = document.getElementById('address-bar');
const contentFrame = document.getElementById('content-frame');

backBtn.addEventListener('click', () => {
    contentFrame.contentWindow.history.back();
});

forwardBtn.addEventListener('click', () => {
    contentFrame.contentWindow.history.forward();
});

refreshBtn.addEventListener('click', () => {
    contentFrame.contentWindow.location.reload();
});

addressBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        let url = addressBar.value;
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        contentFrame.src = url;
    }
});

contentFrame.addEventListener('load', () => {
    addressBar.value = contentFrame.contentWindow.location.href;
});
