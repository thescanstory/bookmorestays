"use client";

import { GetStartedButton } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame" style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", minHeight: "340px" }}>
      <GetStartedButton style={{ width: "420px", height: "140px", borderRadius: "70px" }} />
    </div>
  );
}

export { GetStartedButton };
export default Scene;
