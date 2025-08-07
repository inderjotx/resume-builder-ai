"use client";

import { LogOut, Trash2 } from "lucide-react";
import { deleteAccount } from "../action";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponsiveModalDrawer } from "@/components/ui/responsive-modal";

export function DangerZone() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirectTo: "/sign-in" });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    await deleteAccount();
    setIsDeleting(false);
  };

  const handleDialog = (value: boolean) => {
    if (isDeleting) return;
    setIsDeleteDialogOpen(value);
  };

  return (
    <Card className="max-w-4xl border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>Irreversible and destructive actions</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <ResponsiveModalDrawer
          open={isDeleteDialogOpen}
          onOpenChange={handleDialog}
          title="Are you absolutely sure?"
          trigger={
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          }
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => handleDialog(false)}
              >
                Cancel
              </Button>

              <Button onClick={handleDeleteAccount} variant="destructive">
                Delete Account
              </Button>
            </div>
          </div>
        </ResponsiveModalDrawer>

        <Button
          variant="outline"
          className="w-full border-destructive text-destructive hover:bg-destructive/90 hover:text-destructive-foreground sm:w-auto"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </CardContent>
    </Card>
  );
}
