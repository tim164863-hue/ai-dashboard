"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useTheme } from "@/lib/theme";
import {
  Sun,
  Moon,
  Bell,
  BellOff,
  Monitor,
  RefreshCw,
  Globe,
  Save,
  RotateCcw,
  Eye,
  Layers,
} from "lucide-react";

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}

function Toggle({ label, description, checked, onChange, icon }: ToggleProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        {icon && <span className="text-text-muted">{icon}</span>}
        <div>
          <label htmlFor={id} className="text-sm text-text-primary font-medium cursor-pointer">
            {label}
          </label>
          {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
        </div>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
          ${checked ? "bg-primary" : "bg-border"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
            ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}

function SelectField({ label, value, options, onChange, icon }: SelectFieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        {icon && <span className="text-text-muted">{icon}</span>}
        <label htmlFor={id} className="text-sm text-text-primary font-medium">
          {label}
        </label>
      </div>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary
          focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
          transition-colors duration-200"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggle } = useTheme();

  // Display settings
  const [showAnimations, setShowAnimations] = useState(true);
  const [compactView, setCompactView] = useState(false);

  // Notification settings
  const [taskAlerts, setTaskAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [errorAlerts, setErrorAlerts] = useState(true);

  // Advanced settings
  const [refreshRate, setRefreshRate] = useState("30");
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:18789");

  const [saved, setSaved] = useState(false);

  function handleSave() {
    // Persist to localStorage
    localStorage.setItem(
      "ai-dash-settings",
      JSON.stringify({
        showAnimations,
        compactView,
        taskAlerts,
        systemAlerts,
        errorAlerts,
        refreshRate,
        apiEndpoint,
      })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setShowAnimations(true);
    setCompactView(false);
    setTaskAlerts(true);
    setSystemAlerts(true);
    setErrorAlerts(true);
    setRefreshRate("30");
    setApiEndpoint("http://localhost:18789");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main id="main-content" className="flex-1 ml-0 lg:ml-56 p-6 pt-16 lg:pt-8 lg:p-8">
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <Header title="Settings" subtitle="Configure dashboard preferences" />

          {/* Display */}
          <section className="glass p-5 mb-6" aria-labelledby="display-heading">
            <h2 id="display-heading" className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
              <Monitor size={15} className="text-primary" />
              Display
            </h2>
            <div className="divide-y divide-border">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon size={16} className="text-text-muted" />
                  ) : (
                    <Sun size={16} className="text-text-muted" />
                  )}
                  <div>
                    <p className="text-sm text-text-primary font-medium">Dark Mode</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Currently: {theme === "dark" ? "Dark" : "Light"}
                    </p>
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={theme === "dark"}
                  onClick={toggle}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200
                    ${theme === "dark" ? "bg-primary" : "bg-border"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
                      ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>
              <Toggle
                label="Show Animations"
                description="Enable smooth transitions and pulse effects"
                checked={showAnimations}
                onChange={setShowAnimations}
                icon={<Eye size={16} />}
              />
              <Toggle
                label="Compact View"
                description="Reduce spacing for denser information display"
                checked={compactView}
                onChange={setCompactView}
                icon={<Layers size={16} />}
              />
            </div>
          </section>

          {/* Notifications */}
          <section className="glass p-5 mb-6" aria-labelledby="notif-heading">
            <h2 id="notif-heading" className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
              <Bell size={15} className="text-primary" />
              Notifications
            </h2>
            <div className="divide-y divide-border">
              <Toggle
                label="Task Alerts"
                description="Notify when tasks complete or fail"
                checked={taskAlerts}
                onChange={setTaskAlerts}
                icon={<Bell size={16} />}
              />
              <Toggle
                label="System Alerts"
                description="Notify on system status changes"
                checked={systemAlerts}
                onChange={setSystemAlerts}
                icon={<Bell size={16} />}
              />
              <Toggle
                label="Error Alerts"
                description="Immediate notification on errors"
                checked={errorAlerts}
                onChange={setErrorAlerts}
                icon={<BellOff size={16} />}
              />
            </div>
          </section>

          {/* Advanced */}
          <section className="glass p-5 mb-6" aria-labelledby="advanced-heading">
            <h2 id="advanced-heading" className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
              <Globe size={15} className="text-primary" />
              Advanced
            </h2>
            <div className="divide-y divide-border">
              <div className="py-3">
                <label htmlFor="api-endpoint" className="text-sm text-text-primary font-medium flex items-center gap-2">
                  <Globe size={16} className="text-text-muted" />
                  API Endpoint
                </label>
                <input
                  id="api-endpoint"
                  type="url"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="mt-2 w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono
                    placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
                    transition-colors duration-200"
                  placeholder="http://localhost:18789"
                />
              </div>
              <SelectField
                label="Refresh Rate"
                value={refreshRate}
                onChange={setRefreshRate}
                icon={<RefreshCw size={16} />}
                options={[
                  { value: "5", label: "5 seconds" },
                  { value: "10", label: "10 seconds" },
                  { value: "30", label: "30 seconds" },
                  { value: "60", label: "1 minute" },
                ]}
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black font-medium text-sm
                hover:opacity-90 transition-opacity duration-200
                focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              <Save size={14} />
              {saved ? "Saved!" : "Save Settings"}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary text-sm
                hover:bg-surface-elevated transition-colors duration-200
                focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
