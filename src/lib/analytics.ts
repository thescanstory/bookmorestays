import { supabase } from './supabaseClient';

export interface AnalyticsEvent {
    event_name: string;
    properties?: Record<string, unknown>;
    session_id?: string;
}

// Generate or get session ID
const getSessionId = (): string => {
    if (typeof window === 'undefined') return 'server';
    let sessionId = sessionStorage.getItem('bms_session_id');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('bms_session_id', sessionId);
    }
    return sessionId;
};

export const trackEvent = async (eventName: string, properties?: Record<string, unknown>) => {
    try {
        const sessionId = getSessionId();

        // Get current user if authenticated
        const { data: { user } } = await supabase.auth.getUser();

        await supabase.from('analytics_events').insert({
            event_name: eventName,
            properties: properties || {},
            session_id: sessionId,
            user_id: user?.id || null
        });
    } catch (error) {
        // Silently fail - analytics should not break the app
        console.debug('Analytics tracking failed:', error);
    }
};

// Predefined event trackers
export const analytics = {
    // Search events
    search: (query: string, resultsCount: number, filters?: Record<string, unknown>) =>
        trackEvent('search', { query, results_count: resultsCount, ...filters }),

    // Property view events
    propertyView: (propertyId: string, propertyName: string, source: 'feed' | 'search' | 'admin' | 'shared') =>
        trackEvent('property_view', { property_id: propertyId, property_name: propertyName, source }),

    // Save/unsave events
    save: (propertyId: string, propertyName: string) =>
        trackEvent('save', { property_id: propertyId, property_name: propertyName, action: 'save' }),

    unsave: (propertyId: string, propertyName: string) =>
        trackEvent('save', { property_id: propertyId, property_name: propertyName, action: 'unsave' }),

    // Inquiry events
    inquiry: (propertyId: string, propertyName: string, checkIn: string, checkOut: string, guests: number) =>
        trackEvent('inquiry', { property_id: propertyId, property_name: propertyName, check_in: checkIn, check_out: checkOut, guests }),

    // Share events
    share: (propertyId: string, propertyName: string, platform: 'whatsapp' | 'native' | 'copy_link') =>
        trackEvent('share', { property_id: propertyId, property_name: propertyName, platform }),

    // Tour request events
    tourRequest: (propertyName: string, city: string) =>
        trackEvent('tour_request', { property_name: propertyName, city }),

    // WhatsApp click events
    whatsappClick: (propertyId: string, propertyName: string, context: 'search_result' | 'property_detail' | 'admin') =>
        trackEvent('whatsapp_click', { property_id: propertyId, property_name: propertyName, context }),

    // Direct booking click
    directBookingClick: (propertyId: string, propertyName: string, hasOfficialUrl: boolean) =>
        trackEvent('direct_booking_click', { property_id: propertyId, property_name: propertyName, has_official_url: hasOfficialUrl }),

    // Authentication events
    login: (method: 'google' | 'apple' | 'email') =>
        trackEvent('login', { method }),

    signup: (method: 'google' | 'apple' | 'email') =>
        trackEvent('signup', { method }),

    logout: () =>
        trackEvent('logout', {}),

    // Admin events
    adminPropertyCreate: (propertyId: string, propertyName: string) =>
        trackEvent('admin_property_create', { property_id: propertyId, property_name: propertyName }),

    adminPropertyUpdate: (propertyId: string, propertyName: string, changes: string[]) =>
        trackEvent('admin_property_update', { property_id: propertyId, property_name: propertyName, changes }),

    adminPropertyDelete: (propertyId: string, propertyName: string) =>
        trackEvent('admin_property_delete', { property_id: propertyId, property_name: propertyName }),

    // Referral events
    referralShare: (code: string) =>
        trackEvent('referral_share', { code }),

    referralSignup: (code: string) =>
        trackEvent('referral_signup', { code }),

    // Page view events
    pageView: (page: string, referrer?: string) =>
        trackEvent('page_view', { page, referrer: referrer || document.referrer }),

    // Error events
    error: (error: string, context: string) =>
        trackEvent('error', { error, context }),

    // Feature usage
    featureUsed: (feature: string, properties?: Record<string, unknown>) =>
        trackEvent('feature_used', { feature, ...properties })
};

// Auto-track page views
export const initPageTracking = () => {
    if (typeof window === 'undefined') return;

    // Track initial page view
    analytics.pageView(window.location.pathname);

    // Track navigation changes (for SPA)
    let lastPath = window.location.pathname;
    const observer = new MutationObserver(() => {
        if (window.location.pathname !== lastPath) {
            lastPath = window.location.pathname;
            analytics.pageView(lastPath);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also listen for popstate (back/forward navigation)
    window.addEventListener('popstate', () => {
        if (window.location.pathname !== lastPath) {
            lastPath = window.location.pathname;
            analytics.pageView(lastPath);
        }
    });
};