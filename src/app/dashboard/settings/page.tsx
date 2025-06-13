"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export default function SettingsPage() {
  const [email, setEmail] = React.useState("")
  const [name, setName] = React.useState("")
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [twoFactor, setTwoFactor] = React.useState(false)

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Settings</h2>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/security/settings">Security Settings</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/security/company">Company Information</Link>
            </Button>
          </div>
        </div>
      </div>
      <Separator />

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1"
            />
          </div>
          <Button className="mt-2">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Email Notifications</Label>
            <Switch
              checked={notifications.email}
              onCheckedChange={v => setNotifications(n => ({ ...n, email: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>SMS Notifications</Label>
            <Switch
              checked={notifications.sms}
              onCheckedChange={v => setNotifications(n => ({ ...n, sms: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Push Notifications</Label>
            <Switch
              checked={notifications.push}
              onCheckedChange={v => setNotifications(n => ({ ...n, push: v }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Two-Factor Authentication</Label>
            <Switch
              checked={twoFactor}
              onCheckedChange={setTwoFactor}
            />
          </div>
          <Button variant="outline" className="mt-2">Change Password</Button>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  )
} 