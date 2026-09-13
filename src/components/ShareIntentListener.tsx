/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Capacitor } from "@capacitor/core";

export default function ShareIntentListener() {
  const router = useRouter();
  const { setSharedUrl } = useStore();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listener: any = null;

    const setupListener = async () => {
      try {
        const { CapacitorShareTarget } = await import("@capgo/capacitor-share-target");
        
        listener = await CapacitorShareTarget.addListener('shareReceived', (event: any) => {
          let url = "";
          
          if (event.texts && event.texts.length > 0) {
            url = event.texts.join(" ");
          } else if (event.title) {
            url = event.title;
          }

          // Basic URL extraction from a mixed string (like "Check out this reel: https://...")
          const urlMatch = url.match(/https?:\/\/[^\s]+/);
          if (urlMatch) {
            url = urlMatch[0];
          }

          if (url) {
            setSharedUrl(url);
            router.push('/search');
          }
        });
      } catch (error) {
        console.error("Error setting up ShareTarget:", error);
      }
    };

    setupListener();

    return () => {
      if (listener && listener.remove) {
        listener.remove();
      }
    };
  }, [router, setSharedUrl]);

  return null;
}
