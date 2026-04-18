"use client";

import { useState } from "react";
import { 
  NewsletterSubscriber, 
  deleteNewsletterSubscriber, 
  updateSubscriberStatus 
} from "@/actions/newsletter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2, UserX, UserCheck, Mail, Calendar, AlertTriangle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface NewsletterTableProps {
  initialSubscribers: NewsletterSubscriber[];
}

export function NewsletterTable({ initialSubscribers }: NewsletterTableProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<NewsletterSubscriber | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!subscriberToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteNewsletterSubscriber(subscriberToDelete.id);
      if (result.success) {
        setSubscribers(subscribers.filter(s => s.id !== subscriberToDelete.id));
        toast.success("Subscriber deleted successfully");
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(result.error || "Failed to delete subscriber");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  }

  function openDeleteDialog(subscriber: NewsletterSubscriber) {
    setSubscriberToDelete(subscriber);
    setIsDeleteDialogOpen(true);
  }

  async function handleStatusUpdate(id: string, currentStatus: "active" | "unsubscribed") {
    const newStatus = currentStatus === "active" ? "unsubscribed" : "active";
    const result = await updateSubscriberStatus(id, newStatus);
    
    if (result.success) {
      setSubscribers(subscribers.map(s => 
        s.id === id ? { ...s, status: newStatus } : s
      ));
      toast.success(`Subscriber marked as ${newStatus}`);
    } else {
      toast.error(result.error || "Failed to update status");
    }
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
            <TableHead className="w-[300px]">Subscriber</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subscribed On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-slate-400">
                No subscribers found.
              </TableCell>
            </TableRow>
          ) : (
            subscribers.map((subscriber) => (
              <TableRow key={subscriber.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {subscriber.name || "Anonymous Subscriber"}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {subscriber.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={subscriber.status === 'active' ? 'default' : 'secondary'}
                    className={
                      subscriber.status === 'active' 
                        ? "bg-green-100 text-green-700 hover:bg-green-100 border-none px-2.5 py-0.5 capitalize flex items-center w-fit gap-1"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-100 border-none px-2.5 py-0.5 capitalize flex items-center w-fit gap-1"
                    }
                  >
                    {subscriber.status === 'active' ? (
                      <UserCheck className="w-3 h-3" />
                    ) : (
                      <UserX className="w-3 h-3" />
                    )}
                    {subscriber.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {format(new Date(subscriber.created_at), "MMM d, yyyy")}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleStatusUpdate(subscriber.id, subscriber.status)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {subscriber.status === 'active' ? (
                          <>
                            <UserX className="w-4 h-4 text-slate-400" />
                            <span>Mark as Unsubscribed</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 text-green-500" />
                            <span>Mark as Active</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openDeleteDialog(subscriber)}
                        className="text-red-600 focus:text-red-700 focus:bg-red-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Subscriber</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-none shadow-2xl bg-white dark:bg-slate-900">
          <DialogHeader className="pt-4 px-2">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Delete Subscriber</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 pt-1">
              Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-100">{subscriberToDelete?.email}</span>? 
              This action cannot be undone and they will no longer receive any newsletters.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-slate-50 dark:bg-slate-950/50 mt-4 -mx-6 -mb-6 p-6 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl border-slate-200 dark:border-slate-800"
              disabled={isDeleting}
            >
              No, keep them
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white min-w-[120px]"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
