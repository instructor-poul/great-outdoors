const DEBUG_MODE = false;

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('globalTermsAccepted') === 'true' && !DEBUG_MODE) {
        return;
    }

    const handleFirstClick = (event) => {
        if (document.getElementById('termsModalOverlay')) return;

        event.preventDefault();
        event.stopPropagation();

        document.removeEventListener('click', handleFirstClick, true);
        renderTermsModal();
    };

    document.addEventListener('click', handleFirstClick, true);
});

function renderTermsModal() {
    // Dynamically inject and reference the external matching CSS file
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = './gateway.css'; // Adjust path if saving inside a /css/ folder
    document.head.appendChild(linkElement);

    // Structural Layout Build
    const overlay = document.createElement('div');
    overlay.id = 'termsModalOverlay';
    overlay.className = 'gateway-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    overlay.innerHTML = `
        <div class="gateway-box">
            <h2>Great Outdoors Gateway</h2>
            <p style="font-size: 0.95rem; color: #555;">Please review and confirm our global platform guidelines covering usage, reviews, and community donations before exploring.</p>
            
            <div class="gateway-scroll" tabindex="0">
                <strong>1. Terms & Moderation:</strong> Continuing confirms compliance with our basic community posting guidelines.<br><br>
                <strong>2. Privacy & Cookies:</strong> Data is handled securely via Firebase for basic account functionality; session cookies track auth states.<br><br>
                <strong>3. Review & Media License:</strong> Posting trail reviews or pictures grants Great Outdoors a royalty-free right to host and display them.<br><br>
                <strong>4. Voluntary Donations:</strong> Contributions are handled through secure payment nodes to support platform costs.<br><br>
                <strong>5. Data Security:</strong> Data breach alerts are distributed within 72 hours if necessary.<br><br>
                <strong>6. Settlement:</strong> Disputes are subject to individual mediation provisions.
            </div>

            <label class="gateway-checkbox-container">
                <input type="checkbox" id="legalCheckbox">
                <span>I have read, understood, and explicitly agree to the combined Terms of Service, Privacy Rules, Media License, and Donation Policies.</span>
            </label>

            <div class="gateway-actions">
                <button class="btn-cancel" id="gatewayCancel">Cancel & Exit</button>
                <button class="btn-agree" id="gatewayAgree" disabled>Agree & Continue</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const checkbox = document.getElementById('legalCheckbox');
    const agreeBtn = document.getElementById('gatewayAgree');
    const cancelBtn = document.getElementById('gatewayCancel');

    checkbox.addEventListener('change', () => {
        agreeBtn.disabled = !checkbox.checked;
    });

    agreeBtn.addEventListener('click', () => {
        localStorage.setItem('globalTermsAccepted', 'true');
        overlay.remove();
        console.log('Global terms confirmed.');
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = 'https://github.com/matthewludwick/great-outdoors';
    });
}