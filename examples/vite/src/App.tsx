import React, { useState } from "react";
import { GPSGuard, useGPS, useGPSGuard, GPSProvider } from "react-gps-guard";
import "react-gps-guard/styles.css";

// -------------------------------------------------------------------
// 1. Context Usage Example
// -------------------------------------------------------------------
const LocationContextDisplay = () => {
  const { location } = useGPS();

  if (!location) return <p>Waiting for location...</p>;

  return (
    <div style={{ padding: 15, background: "#e0f2fe", borderRadius: 8 }}>
      <h4>From useGPS Context:</h4>
      <p>
        Lat: {location.latitude}, Lng: {location.longitude}
      </p>
    </div>
  );
};

const ContextExample = () => (
  <GPSProvider>
    <div
      style={{
        border: "1px solid #ccc",
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
      }}
    >
      <h3>1. GPSProvider & useGPS Context</h3>
      <p>
        Using the global provider. This button will trigger the prompt globally.
      </p>
      <GPSGuard>
        <LocationContextDisplay />
      </GPSGuard>
    </div>
  </GPSProvider>
);

// -------------------------------------------------------------------
// 2. Custom Component Override Example
// -------------------------------------------------------------------
const CustomUIExample = () => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
      }}
    >
      <h3>2. Custom UI Overrides</h3>
      <p>This guard uses custom React elements instead of the defaults.</p>
      <div
        style={{
          border: "2px dashed #6366f1",
          minHeight: 100,
          position: "relative",
        }}
      >
        <GPSGuard
          renderLoading={() => (
            <div style={{ padding: 20 }}>⏳ Custom Loading Spinner...</div>
          )}
          renderPermission={(requestPermission, decline) => (
            <div style={{ padding: 20, background: "#fef3c7" }}>
              <h4>Custom Permission Screen</h4>
              <button onClick={requestPermission} style={{ marginRight: 10 }}>
                YES PLEASE!
              </button>
              <button onClick={decline}>NOPE</button>
            </div>
          )}
          renderError={(error, retry) => (
            <div style={{ padding: 20, background: "#fee2e2" }}>
              <h4>Custom Error Screen</h4>
              <p>{error?.message}</p>
              <button onClick={retry}>Try Again</button>
            </div>
          )}
        >
          <div style={{ padding: 20, background: "#dcfce7" }}>
            <h4>✅ Location Secured</h4>
            <p>You can see this secret map area.</p>
          </div>
        </GPSGuard>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// 3. Raw Hook Example
// -------------------------------------------------------------------
const RawHookExample = () => {
  const { location, permission, status, requestPermission, error } =
    useGPSGuard({
      enableHighAccuracy: false,
    });

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
      }}
    >
      <h3>3. Raw useGPSGuard Hook</h3>
      <p>Using the hook completely standalone without any wrappers.</p>

      <p>
        <strong>Status:</strong> {status} | <strong>Permission:</strong>{" "}
        {permission}
      </p>

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {status === "priming" || permission === "prompt" ? (
        <button onClick={requestPermission}>Prompt Native Permission</button>
      ) : null}

      {location && (
        <div style={{ padding: 15, background: "#f3f4f6", borderRadius: 8 }}>
          Raw coords: {location.latitude}, {location.longitude}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------------
// Main App
// -------------------------------------------------------------------
function App() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 800,
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>react-gps-guard Examples</h1>
      <p>
        Select an example below to see different ways of implementing the
        library.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab(1)}
          style={{ fontWeight: activeTab === 1 ? "bold" : "normal" }}
        >
          Context Provider
        </button>
        <button
          onClick={() => setActiveTab(2)}
          style={{ fontWeight: activeTab === 2 ? "bold" : "normal" }}
        >
          Custom UI
        </button>
        <button
          onClick={() => setActiveTab(3)}
          style={{ fontWeight: activeTab === 3 ? "bold" : "normal" }}
        >
          Raw Hook
        </button>
      </div>

      {activeTab === 1 && <ContextExample />}
      {activeTab === 2 && <CustomUIExample />}
      {activeTab === 3 && <RawHookExample />}
    </div>
  );
}

export default App;
