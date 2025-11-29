"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

type Props = {
  isLoading?: boolean;
};

export default function AdminDashboard({ isLoading }: Props) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6" />
            <div className="h-4 w-48 bg-muted rounded-md" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-muted rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl">Admin Overview</h1>
        <p className="text-muted-foreground">Quick access to admin controls and system metrics.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Core integrations and services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Firestore: connected</div>
              <div className="text-sm font-semibold">OK</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Platform</CardTitle>
            <CardDescription>Users, Houses, Announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button asChild>
                <a href="/dashboard/admin">Open Admin Panel</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Audits & roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Role management and audit logs</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
