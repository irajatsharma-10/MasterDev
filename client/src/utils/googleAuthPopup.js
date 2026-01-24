// Google OAuth Popup Utility
// Opens Google OAuth in a popup window instead of redirecting

const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 600;

export function openGoogleAuthPopup(state, onSuccess, onError) {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const authUrl = `${baseUrl}/oauth/google?state=${encodeURIComponent(JSON.stringify(state))}`;

    // Calculate popup position (center of screen)
    const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2;
    const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2;

    // Open popup window
    const popup = window.open(
        authUrl,
        'GoogleAuth',
        `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (!popup) {
        onError('popup_blocked');
        return null;
    }

    // Listen for messages from popup
    const messageHandler = (event) => {
        // Verify origin
        if (event.origin !== window.location.origin) return;

        const { type, data, error } = event.data || {};

        if (type === 'GOOGLE_AUTH_SUCCESS') {
            window.removeEventListener('message', messageHandler);
            clearInterval(pollTimer);
            onSuccess(data);
        } else if (type === 'GOOGLE_AUTH_ERROR') {
            window.removeEventListener('message', messageHandler);
            clearInterval(pollTimer);
            onError(error);
        }
    };

    window.addEventListener('message', messageHandler);

    // Poll to check if popup was closed without completing auth
    const pollTimer = setInterval(() => {
        if (popup.closed) {
            clearInterval(pollTimer);
            window.removeEventListener('message', messageHandler);
            // User closed the popup without completing
            onError('popup_closed');
        }
    }, 500);

    return popup;
}

export default openGoogleAuthPopup;
