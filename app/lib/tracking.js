export const META_PIXEL_ID = "1356559159713530";

function pushToDataLayer(eventName, eventType, params) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "meta_event",
    meta_event_name: eventName,
    meta_event_type: eventType,
    ...params,
  });
}

export function trackMetaEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;

  pushToDataLayer(eventName, "standard", params);
  window.fbq?.("track", eventName, params);
}

export function trackMetaCustomEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;

  pushToDataLayer(eventName, "custom", params);
  window.fbq?.("trackCustom", eventName, params);
}

