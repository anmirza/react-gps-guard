import { useState } from "react";
import { GPSGuard, useGPS, useGPSGuard, GPSProvider } from "react-gps-guard";
import "react-gps-guard/styles.css";

// -------------------------------------------------------------------
// 1. Basic Component Usage Example
// -------------------------------------------------------------------
const BasicGuardExample = () => {
  return (
    <div
      id="basic-example"
      style={{
        border: "1px solid #e2e8f0",
        padding: 24,
        borderRadius: 12,
        marginBottom: 20,
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#1e293b" }}>1. Basic GPSGuard</h3>
      <p style={{ color: "#64748b", fontSize: 14 }}>
        Intercepts rendering until the user grants permission. Displays the built-in primer screen first.
      </p>
      <div
        style={{
          border: "2px dashed #94a3b8",
          borderRadius: 8,
          minHeight: 180,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GPSGuard>
          {({ location }) => (
            <div style={{ padding: 24, background: "#ecfdf5", borderRadius: 8 }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#065f46" }}>✅ Location Secured</h4>
              <p style={{ margin: "0 0 12px 0", color: "#047857" }}>
                Welcome! This protected area is only accessible with GPS enabled.
              </p>
              {location && (
                <div style={{ background: "#ffffff", padding: 12, borderRadius: 6, display: "inline-block", border: "1px solid #a7f3d0" }}>
                  <strong>Lat:</strong> {location.latitude.toFixed(4)} | <strong>Lng:</strong> {location.longitude.toFixed(4)}
                </div>
              )}
            </div>
          )}
        </GPSGuard>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// 2. Optional GPS Mode Example
// -------------------------------------------------------------------
const OptionalExample = () => {
  return (
    <div
      id="optional-example"
      style={{
        border: "1px solid #e2e8f0",
        padding: 24,
        borderRadius: 12,
        marginBottom: 20,
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#1e293b" }}>2. Optional GPS Guard</h3>
      <p style={{ color: "#64748b", fontSize: 14 }}>
        Location is optional (<code>optional=&#123;true&#125;</code>). Users can tap "Not now" or "Continue without location" to access content.
      </p>

      <div
        style={{
          border: "2px dashed #10b981",
          borderRadius: 8,
          minHeight: 180,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GPSGuard optional>
          {({ location, isSkipped, retry, requestPermission }) => (
            <div
              style={{
                padding: 24,
                background: isSkipped ? "#fffbeb" : "#ecfdf5",
                borderRadius: 8,
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", color: isSkipped ? "#92400e" : "#065f46" }}>
                {isSkipped ? "⚠️ Running in Fallback Mode (Location Skipped)" : "✅ Location Provided"}
              </h4>
              {location ? (
                <div>
                  <p style={{ color: "#047857", margin: "0 0 8px 0" }}>Local content personalized for your area:</p>
                  <div style={{ background: "#ffffff", padding: 12, borderRadius: 6, display: "inline-block", border: "1px solid #a7f3d0" }}>
                    Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ color: "#78350f", margin: "0 0 12px 0" }}>
                    User chose not to share location. App remains completely functional!
                  </p>
                  <button
                    onClick={requestPermission}
                    style={{
                      marginRight: 10,
                      padding: "8px 16px",
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Enable Location Now
                  </button>
                  <button
                    onClick={retry}
                    style={{
                      padding: "8px 16px",
                      background: "#fff",
                      color: "#333",
                      border: "1px solid #cbd5e1",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Retry Detection
                  </button>
                </div>
              )}
            </div>
          )}
        </GPSGuard>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// 3. Context Usage Example
// -------------------------------------------------------------------
const LocationContextDisplay = () => {
  const { location, status } = useGPS();

  if (!location) {
    return <p style={{ color: "#64748b" }}>Status: {status} | Waiting for location...</p>;
  }

  return (
    <div style={{ padding: 16, background: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd" }}>
      <h4 style={{ margin: "0 0 6px 0", color: "#0369a1" }}>Connected to Global GPSContext:</h4>
      <p style={{ margin: 0, color: "#0c4a6e" }}>
        <strong>Coordinates:</strong> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
      </p>
    </div>
  );
};

const ContextExample = () => (
  <GPSProvider>
    <div
      id="context-example"
      style={{
        border: "1px solid #e2e8f0",
        padding: 24,
        borderRadius: 12,
        marginBottom: 20,
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#1e293b" }}>3. GPSProvider & useGPS Context</h3>
      <p style={{ color: "#64748b", fontSize: 14 }}>
        Wraps child hierarchy in a global provider so any nested component can consume live location.
      </p>
      <div style={{ border: "2px dashed #0284c7", borderRadius: 8, minHeight: 160, position: "relative" }}>
        <GPSGuard>
          <div style={{ padding: 20 }}>
            <LocationContextDisplay />
          </div>
        </GPSGuard>
      </div>
    </div>
  </GPSProvider>
);

// -------------------------------------------------------------------
// 4. Custom Component Override Example
// -------------------------------------------------------------------
const CustomUIExample = () => {
  return (
    <div
      id="custom-ui-example"
      style={{
        border: "1px solid #e2e8f0",
        padding: 24,
        borderRadius: 12,
        marginBottom: 20,
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#1e293b" }}>4. Custom UI via Render Props</h3>
      <p style={{ color: "#64748b", fontSize: 14 }}>
        Customizing primer and error screens completely using render props.
      </p>
      <div
        style={{
          border: "2px dashed #6366f1",
          borderRadius: 8,
          minHeight: 180,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GPSGuard
          renderLoading={() => (
            <div style={{ padding: 24, textAlign: "center", color: "#4f46e5" }}>⏳ Custom Animated Loading Spinner...</div>
          )}
          renderPermission={(requestPermission, decline) => (
            <div style={{ padding: 24, background: "#f5f3ff", textAlign: "center" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#4338ca" }}>🚀 Brand Permission Modal</h4>
              <p style={{ margin: "0 0 16px 0", color: "#4f46e5", fontSize: 14 }}>
                We'd love your location to show personalized nearby attractions!
              </p>
              <button
                onClick={requestPermission}
                style={{
                  marginRight: 10,
                  padding: "10px 20px",
                  background: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Yes, Discover Places!
              </button>
              <button
                onClick={decline}
                style={{
                  padding: "10px 20px",
                  background: "#fff",
                  border: "1px solid #c7d2fe",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                No Thanks
              </button>
            </div>
          )}
          renderError={(error, retry) => (
            <div style={{ padding: 24, background: "#fef2f2" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#991b1b" }}>Custom Error Display</h4>
              <p style={{ color: "#b91c1c" }}>{error?.message}</p>
              <button onClick={retry} style={{ padding: "8px 16px", cursor: "pointer" }}>Try Again</button>
            </div>
          )}
        >
          <div style={{ padding: 24, background: "#ecfdf5", borderRadius: 8 }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#065f46" }}>✅ Custom Guard Passed</h4>
            <p style={{ margin: 0, color: "#047857" }}>Welcome to the tailored map view!</p>
          </div>
        </GPSGuard>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// 5. Raw Hook Example
// -------------------------------------------------------------------
const RawHookExample = () => {
  const { location, permission, status, requestPermission, error } =
    useGPSGuard({
      enableHighAccuracy: false,
    });

  return (
    <div
      id="raw-hook-example"
      style={{
        border: "1px solid #e2e8f0",
        padding: 24,
        borderRadius: 12,
        marginBottom: 20,
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#1e293b" }}>5. Raw useGPSGuard Hook</h3>
      <p style={{ color: "#64748b", fontSize: 14 }}>
        Using the headless hook directly to manage custom status badges and prompts.
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
        <span style={{ padding: "4px 10px", background: "#f1f5f9", borderRadius: 4, fontSize: 13 }}>
          <strong>Status:</strong> {status}
        </span>
        <span style={{ padding: "4px 10px", background: "#f1f5f9", borderRadius: 4, fontSize: 13 }}>
          <strong>Permission:</strong> {permission}
        </span>
      </div>

      {error && <p style={{ color: "#dc2626" }}>Error: {error.message}</p>}

      {status === "priming" || permission === "prompt" ? (
        <button
          onClick={requestPermission}
          style={{
            padding: "10px 18px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Request Native Location
        </button>
      ) : null}

      {location && (
        <div style={{ padding: 16, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 12 }}>
          <strong>Raw Coords:</strong> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------------
// Main App
// -------------------------------------------------------------------
function App() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam) return parseInt(tabParam, 10);
    }
    return 1;
  });

  return (
    <div
      style={{
        padding: 30,
        maxWidth: 820,
        margin: "0 auto",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: "0 0 6px 0", fontSize: 26, color: "#0f172a" }}>react-gps-guard Examples</h1>
        <p style={{ margin: 0, color: "#64748b", fontSize: 15 }}>
          Interactive playground showing all implementation patterns and features.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { id: 1, label: "Basic Guard" },
          { id: 2, label: "Optional GPS" },
          { id: 3, label: "Context Provider" },
          { id: 4, label: "Custom UI" },
          { id: 5, label: "Raw Hook" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              border: "1px solid",
              borderColor: activeTab === tab.id ? "#2563eb" : "#cbd5e1",
              background: activeTab === tab.id ? "#2563eb" : "#ffffff",
              color: activeTab === tab.id ? "#ffffff" : "#334155",
              fontWeight: activeTab === tab.id ? 600 : 500,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 1 && <BasicGuardExample />}
      {activeTab === 2 && <OptionalExample />}
      {activeTab === 3 && <ContextExample />}
      {activeTab === 4 && <CustomUIExample />}
      {activeTab === 5 && <RawHookExample />}
    </div>
  );
}

export default App;
