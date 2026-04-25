"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface SettingsData {
  serverUrl: string;
  apiKey: string;
}

const STORAGE_KEY = "finstat-settings";

function loadSettings(): SettingsData {
  if (typeof window === "undefined") {
    return { serverUrl: "", apiKey: "" };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as SettingsData;
    }
  } catch {
    /* ignore parse errors */
  }
  return { serverUrl: "", apiKey: "" };
}

function saveSettings(settings: SettingsData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    serverUrl: "",
    apiKey: "",
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testStatus, setTestStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setSettings(loadSettings());
    });
  }, []);

  function handleSave() {
    saveSettings(settings);
  }

  async function handleTestConnection() {
    setTestStatus("loading");
    setTestMessage("");

    try {
      await api.healthCheck();
      setTestStatus("success");
      setTestMessage("Verbindung erfolgreich hergestellt!");
    } catch (err) {
      setTestStatus("error");
      setTestMessage(
        err instanceof Error ? err.message : "Verbindung fehlgeschlagen"
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground">
          Konfiguriere die Verbindung zu deinem Jellyfin-Server
        </p>
      </div>

      <Card className="border-border/50 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Server-Verbindung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="server-url">Jellyfin Server URL</Label>
            <Input
              id="server-url"
              type="url"
              placeholder="https://jellyfin.example.com"
              value={settings.serverUrl}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, serverUrl: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Die vollständige URL deines Jellyfin-Servers
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API-Schlüssel</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="Dein Jellyfin API-Schlüssel"
                value={settings.apiKey}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, apiKey: e.target.value }))
                }
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Erstelle einen API-Schlüssel unter Dashboard → API-Schlüssel in
              Jellyfin
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} variant="secondary">
              Speichern
            </Button>
            <Button
              onClick={handleTestConnection}
              disabled={testStatus === "loading"}
            >
              {testStatus === "loading" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verbindung testen
            </Button>
          </div>

          {testStatus !== "idle" && testStatus !== "loading" && (
            <div className="flex items-center gap-2">
              {testStatus === "success" ? (
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-400/30">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Verbunden
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-destructive/10 text-destructive border-destructive/30"
                >
                  <XCircle className="mr-1 h-3.5 w-3.5" />
                  Nicht verbunden
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {testMessage}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
