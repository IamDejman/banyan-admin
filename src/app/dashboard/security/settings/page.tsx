"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export default function SecuritySettingsPage() {
  const [sessionTimeout, setSessionTimeout] = React.useState("30")
  const [maxLoginAttempts, setMaxLoginAttempts] = React.useState("5")
  const [passwordExpiry, setPasswordExpiry] = React.useState("90")
  const [requireTwoFactor, setRequireTwoFactor] = React.useState(false)

  const handleSave = () => {
    // TODO: Implement API call to save security settings
    console.log({
      sessionTimeout,
      maxLoginAttempts,
      passwordExpiry,
      requireTwoFactor,
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-2">Security Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Session & Login Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
            <Input
              id="maxLoginAttempts"
              type="number"
              value={maxLoginAttempts}
              onChange={(e) => setMaxLoginAttempts(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
            <Input
              id="passwordExpiry"
              type="number"
              value={passwordExpiry}
              onChange={(e) => setPasswordExpiry(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Require Two-Factor Authentication</Label>
            <Switch
              checked={requireTwoFactor}
              onCheckedChange={setRequireTwoFactor}
            />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
} 